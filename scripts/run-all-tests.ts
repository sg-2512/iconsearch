/**
 * IconSearch Unified Automated Test Runner
 * Executes all automated test suites and validates results against TEST_INFRA.md criteria.
 */

import { spawn } from 'child_process'
import { join } from 'path'

type TestSuiteResult = {
  name: string
  file: string
  passed: number
  failed: number
  total: number
  durationMs: number
  tier1: number
  tier2: number
  tier3: number
  tier4: number
  output: string
  exitCode: number
}

const SUITES = [
  { name: 'Search API & Facets', file: 'tests/api-search-facets.test.ts' },
  { name: 'Universal Exporter & Code Gen', file: 'tests/exporter-code-gen.test.ts' },
  { name: 'SEO & Schema.org JSON-LD', file: 'tests/seo-schema.test.ts' },
  { name: 'M4 Discoverability & SEO Hubs', file: 'tests/m4-discoverability-seo.test.ts' },
  { name: 'M3 Stress & Idempotency', file: 'tests/challenger-m3-stress.test.ts' },
  { name: 'M3 Adversarial Edge Cases', file: 'tests/challenger-m3-exporter-stress.test.ts' },
]

const THRESHOLDS = {
  tier1: 50,
  tier2: 50,
  tier3: 10,
  tier4: 5,
  total: 115,
}

function runCommand(cmd: string, args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32'
    const executable = isWindows ? 'npx.cmd' : 'npx'
    const child = spawn(executable, args, {
      cwd: process.cwd(),
      env: { ...process.env, FORCE_COLOR: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: isWindows,
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    child.on('close', (code) => {
      resolve({ stdout, stderr, exitCode: code ?? 0 })
    })
  })
}

function parseTestOutput(output: string): {
  passed: number
  failed: number
  total: number
  durationMs: number
  tier1: number
  tier2: number
  tier3: number
  tier4: number
} {
  let tier1 = 0
  let tier2 = 0
  let tier3 = 0
  let tier4 = 0

  const lines = output.split('\n')
  for (const line of lines) {
    if (line.includes('✔ T1.') || line.includes('✖ T1.')) tier1++
    else if (line.includes('✔ T2.') || line.includes('✖ T2.')) tier2++
    else if (line.includes('✔ T3.') || line.includes('✖ T3.')) tier3++
    else if (line.includes('✔ T4.') || line.includes('✖ T4.')) tier4++
  }

  const passMatch = output.match(/ℹ pass (\d+)/)
  const failMatch = output.match(/ℹ fail (\d+)/)
  const totalMatch = output.match(/ℹ tests (\d+)/)
  const durationMatch = output.match(/ℹ duration_ms ([\d.]+)/)

  const passed = passMatch ? parseInt(passMatch[1], 10) : tier1 + tier2 + tier3 + tier4
  const failed = failMatch ? parseInt(failMatch[1], 10) : 0
  const total = totalMatch ? parseInt(totalMatch[1], 10) : passed + failed
  const durationMs = durationMatch ? parseFloat(durationMatch[1]) : 0

  return { passed, failed, total, durationMs, tier1, tier2, tier3, tier4 }
}

async function main() {
  console.log('\n================================================================================')
  console.log('                 ICONSEARCH AUTOMATED TEST SUITE RUNNER                         ')
  console.log('================================================================================\n')

  const results: TestSuiteResult[] = []
  const startTime = Date.now()

  for (const suite of SUITES) {
    process.stdout.write(`▶ Running ${suite.name} (${suite.file})... `)
    const suiteStart = Date.now()
    const { stdout, stderr, exitCode } = await runCommand('npx', ['tsx', '--test', suite.file])
    const suiteDuration = Date.now() - suiteStart
    const parsed = parseTestOutput(stdout + '\n' + stderr)

    const statusStr = exitCode === 0 && parsed.failed === 0 ? '✔ PASS' : '✖ FAIL'
    console.log(`${statusStr} (${parsed.passed}/${parsed.total} passed in ${(suiteDuration / 1000).toFixed(2)}s)`)

    results.push({
      name: suite.name,
      file: suite.file,
      passed: parsed.passed,
      failed: parsed.failed,
      total: parsed.total,
      durationMs: suiteDuration,
      tier1: parsed.tier1,
      tier2: parsed.tier2,
      tier3: parsed.tier3,
      tier4: parsed.tier4,
      output: stdout + '\n' + stderr,
      exitCode,
    })
  }

  const totalDuration = (Date.now() - startTime) / 1000
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0)
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0)
  const totalTests = results.reduce((sum, r) => sum + r.total, 0)

  const sumTier1 = results.reduce((sum, r) => sum + r.tier1, 0)
  const sumTier2 = results.reduce((sum, r) => sum + r.tier2, 0)
  const sumTier3 = results.reduce((sum, r) => sum + r.tier3, 0)
  const sumTier4 = results.reduce((sum, r) => sum + r.tier4, 0)

  console.log('\n================================================================================')
  console.log('                             TEST EXECUTION SUMMARY                             ')
  console.log('================================================================================\n')

  console.log('SUITE BREAKDOWN:')
  for (const r of results) {
    const status = r.exitCode === 0 && r.failed === 0 ? '✔ PASS' : '✖ FAIL'
    console.log(`  ${status.padEnd(8)} ${r.name.padEnd(32)} ${r.passed.toString().padStart(3)} / ${r.total.toString().padStart(3)} passed (${(r.durationMs / 1000).toFixed(2)}s)`)
  }

  console.log('\nTIER COVERAGE & COMPLIANCE (vs TEST_INFRA.md):')
  const checkMark = (actual: number, required: number) => actual >= required ? '✔ PASS' : '✖ FAIL'
  console.log(`  ${checkMark(sumTier1, THRESHOLDS.tier1).padEnd(8)} Tier 1 (Feature Coverage):       ${sumTier1.toString().padStart(3)} test cases (threshold: ≥${THRESHOLDS.tier1})`)
  console.log(`  ${checkMark(sumTier2, THRESHOLDS.tier2).padEnd(8)} Tier 2 (Boundary & Corner):      ${sumTier2.toString().padStart(3)} test cases (threshold: ≥${THRESHOLDS.tier2})`)
  console.log(`  ${checkMark(sumTier3, THRESHOLDS.tier3).padEnd(8)} Tier 3 (Pairwise Combinations):  ${sumTier3.toString().padStart(3)} test cases (threshold: ≥${THRESHOLDS.tier3})`)
  console.log(`  ${checkMark(sumTier4, THRESHOLDS.tier4).padEnd(8)} Tier 4 (Developer Workloads):   ${sumTier4.toString().padStart(3)} test cases (threshold: ≥${THRESHOLDS.tier4})`)
  console.log(`  ----------------------------------------------------------------------`)
  console.log(`  ${checkMark(totalTests, THRESHOLDS.total).padEnd(8)} Total Test Suite:               ${totalTests.toString().padStart(3)} test cases (threshold: ≥${THRESHOLDS.total})`)

  console.log(`\nOVERALL STATUS: ${totalFailed === 0 && totalTests >= THRESHOLDS.total ? '✔ ALL TEST SUITES PASSED' : '✖ TEST FAILURES DETECTED'}`)
  console.log(`Total Passed: ${totalPassed} | Total Failed: ${totalFailed} | Execution Time: ${totalDuration.toFixed(2)}s\n`)

  if (totalFailed > 0 || totalTests < THRESHOLDS.total) {
    process.exit(1)
  } else {
    process.exit(0)
  }
}

main().catch((err) => {
  console.error('Fatal error executing test runner:', err)
  process.exit(1)
})
