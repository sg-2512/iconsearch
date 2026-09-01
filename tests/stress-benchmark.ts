import { GET, loadIcons, normalizeLicenseGroup } from '../app/api/icon-search/route'
import v8 from 'v8'

let ipCounter = 2000

function makeRequest(params: Record<string, string | number | boolean> = {}, customIp?: string) {
  const url = new URL('http://localhost:3000/api/icon-search')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }
  const ip = customIp || `10.10.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`
  return new Request(url.toString(), {
    headers: {
      'x-forwarded-for': ip,
    },
  })
}

async function runBenchmark() {
  console.log('=== IconSearch M2 Empirical Stress & Memory Harness ===')
  const icons = loadIcons()
  console.log(`Loaded icon database: ${icons.length} icons`)

  const keywords = ['', 'arrow', 'user', 'settings', 'cloud', 'chart', 'edit', 'delete', 'check', 'mail', 'search', 'folder', 'plus', 'star', 'heart', 'lock', 'calendar', 'phone', 'globe', 'home']
  const styles = ['all', 'stroke', 'solid', 'duotone', 'twotone', 'sharp']
  const colorModels = ['all', 'mono', 'multicolor']
  const licenses = ['all', 'MIT', 'Apache-2.0', 'CC0', 'OFL', 'ISC']
  const sourceTypes = ['all', 'curated', 'iconify']
  const categories = ['all', 'ai', 'alert', 'arrows', 'media', 'editor', 'communication', 'commerce', 'weather', 'devices', 'design', 'security']
  const libs = ['all', 'lucide-icons', 'heroicons', 'tabler-icons', 'feather-icons', 'radix-icons', 'bootstrap-icons', 'remix-icon', 'phosphor-icons']

  // 1. Warm-up Phase
  console.log('\n[1/3] Warming up JIT and V8 heap...')
  for (let i = 0; i < 50; i++) {
    const req = makeRequest({ q: keywords[i % keywords.length], limit: 20 })
    await GET(req)
  }

  if (global.gc) {
    global.gc()
  }

  const baseHeap = process.memoryUsage().heapUsed / (1024 * 1024)
  console.log(`Base Heap after Warm-up & GC: ${baseHeap.toFixed(2)} MB`)

  // 2. High-Frequency Parameter Permutation Test (500 Sequential Requests)
  console.log('\n[2/3] Executing 500 High-Frequency Parameter Permutations...')
  const latencies: number[] = []
  const startTime = performance.now()

  for (let i = 0; i < 500; i++) {
    const q = keywords[i % keywords.length]
    const style = styles[(i * 3) % styles.length]
    const colorModel = colorModels[(i * 5) % colorModels.length]
    const license = licenses[(i * 7) % licenses.length]
    const sourceType = sourceTypes[(i * 11) % sourceTypes.length]
    const category = categories[(i * 13) % categories.length]
    const lib = libs[(i * 17) % libs.length]
    const legalOnly = i % 2 === 0 ? '1' : '0'

    const t0 = performance.now()
    const req = makeRequest({ q, style, colorModel, license, sourceType, category, lib, legalOnly, limit: 50 })
    const res = await GET(req)
    const data = await res.json()
    const t1 = performance.now()

    latencies.push(t1 - t0)

    // Verify facet integrity on every single response
    const total = data.total
    const cmSum = (data.facets.colorModels.mono || 0) + (data.facets.colorModels.multicolor || 0)
    const stSum = (data.facets.sourceTypes.curated || 0) + (data.facets.sourceTypes.iconify || 0)
    const licSum = Object.values(data.facets.licenseCounts as Record<string, number>).reduce((a, b) => a + b, 0)

    if (cmSum !== total) {
      throw new Error(`Facet mismatch for query #${i}: colorModels sum ${cmSum} != total ${total}`)
    }
    if (stSum !== total) {
      throw new Error(`Facet mismatch for query #${i}: sourceTypes sum ${stSum} != total ${total}`)
    }
    if (licSum !== total) {
      throw new Error(`Facet mismatch for query #${i}: licenseCounts sum ${licSum} != total ${total}`)
    }
  }

  const totalTime = performance.now() - startTime
  latencies.sort((a, b) => a - b)
  const avgLat = latencies.reduce((a, b) => a + b, 0) / latencies.length
  const p50 = latencies[Math.floor(latencies.length * 0.5)]
  const p90 = latencies[Math.floor(latencies.length * 0.9)]
  const p95 = latencies[Math.floor(latencies.length * 0.95)]
  const p99 = latencies[Math.floor(latencies.length * 0.99)]
  const maxLat = latencies[latencies.length - 1]

  console.log(`- Total Duration: ${(totalTime / 1000).toFixed(2)}s for 500 requests`)
  console.log(`- Throughput: ${(500 / (totalTime / 1000)).toFixed(2)} req/sec`)
  console.log(`- Latency: Avg=${avgLat.toFixed(2)}ms, P50=${p50.toFixed(2)}ms, P90=${p90.toFixed(2)}ms, P95=${p95.toFixed(2)}ms, P99=${p99.toFixed(2)}ms, Max=${maxLat.toFixed(2)}ms`)

  const midHeap = process.memoryUsage().heapUsed / (1024 * 1024)
  console.log(`- Heap during load: ${midHeap.toFixed(2)} MB (Delta from base: ${(midHeap - baseHeap).toFixed(2)} MB)`)

  // 3. Parallel Bursts & Memory Leak / Stability Check
  console.log('\n[3/3] Executing Parallel Concurrency Bursts (10 rounds x 20 concurrent reqs = 200 reqs)...')
  for (let round = 0; round < 10; round++) {
    const burstPromises = Array.from({ length: 20 }).map(async (_, idx) => {
      const q = keywords[(round * 20 + idx) % keywords.length]
      const style = styles[(idx * 2) % styles.length]
      const colorModel = colorModels[(idx * 3) % colorModels.length]
      const req = makeRequest({ q, style, colorModel, limit: 30 })
      const res = await GET(req)
      return res.json()
    })
    await Promise.all(burstPromises)
  }

  if (global.gc) {
    global.gc()
  }

  const postGcHeap = process.memoryUsage().heapUsed / (1024 * 1024)
  console.log(`- Heap after concurrent bursts & GC: ${postGcHeap.toFixed(2)} MB`)
  console.log(`- Net Heap Growth: ${(postGcHeap - baseHeap).toFixed(2)} MB`)

  console.log('\n=== Stress Test Assessment ===')
  if (postGcHeap - baseHeap < 30) {
    console.log('✅ PASS: Memory leak check passed (heap reclaimed cleanly by GC).')
  } else {
    console.log(`⚠️ WARN: Heap growth of ${(postGcHeap - baseHeap).toFixed(2)} MB observed.`)
  }

  if (avgLat < 100 && p95 < 250) {
    console.log('✅ PASS: Latency baseline satisfied (Avg < 100ms, P95 < 250ms).')
  } else {
    console.log('⚠️ Latency higher than ideal.')
  }
}

runBenchmark().catch(console.error)
