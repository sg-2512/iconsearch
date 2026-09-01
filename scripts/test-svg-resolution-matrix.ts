import { GET, OPTIONS } from '../app/api/svg/[library]/[name]/route'

interface TestCase {
  category: string
  library: string
  name: string
  query?: string
  expectedStatus: number
  description: string
  verifySvg?: boolean
  expectedColor?: string
  expectedSize?: string
}

const TEST_CASES: TestCase[] = [
  // 1. akar-icons
  { category: 'akar-icons', library: 'akar-icons', name: 'air', expectedStatus: 200, description: 'akar-icons air icon', verifySvg: true },
  { category: 'akar-icons', library: 'akar-icons', name: 'circle-alert', expectedStatus: 200, description: 'akar-icons circle-alert icon', verifySvg: true },
  { category: 'akar-icons', library: 'akar-icons', name: 'chevron-right', expectedStatus: 200, description: 'akar-icons chevron-right icon', verifySvg: true },
  { category: 'akar-icons', library: 'akar-icons', name: 'heart', expectedStatus: 200, description: 'akar-icons heart icon', verifySvg: true },
  { category: 'akar-icons', library: 'akar-icons', name: 'search', expectedStatus: 200, description: 'akar-icons search icon', verifySvg: true },

  // 2. file-icons
  { category: 'file-icons', library: 'file-icons', name: 'c', expectedStatus: 200, description: 'file-icons c icon', verifySvg: true },
  { category: 'file-icons', library: 'file-icons', name: 'js', expectedStatus: 200, description: 'file-icons js icon', verifySvg: true },
  { category: 'file-icons', library: 'file-icons', name: 'python', expectedStatus: 200, description: 'file-icons python icon', verifySvg: true },
  { category: 'file-icons', library: 'file-icons', name: 'rust', expectedStatus: 200, description: 'file-icons rust icon', verifySvg: true },
  { category: 'file-icons', library: 'file-icons', name: 'typescript', expectedStatus: 200, description: 'file-icons typescript icon', verifySvg: true },

  // 3. flat-color-icons
  { category: 'flat-color-icons', library: 'flat-color-icons', name: 'plus', expectedStatus: 200, description: 'flat-color-icons plus icon', verifySvg: true },
  { category: 'flat-color-icons', library: 'flat-color-icons', name: 'settings', expectedStatus: 200, description: 'flat-color-icons settings icon', verifySvg: true },
  { category: 'flat-color-icons', library: 'flat-color-icons', name: 'google', expectedStatus: 200, description: 'flat-color-icons google icon', verifySvg: true },
  { category: 'flat-color-icons', library: 'flat-color-icons', name: 'folder', expectedStatus: 200, description: 'flat-color-icons folder icon', verifySvg: true },
  { category: 'flat-color-icons', library: 'flat-color-icons', name: 'calendar', expectedStatus: 200, description: 'flat-color-icons calendar icon', verifySvg: true },

  // 4. radix-icons
  { category: 'radix-icons', library: 'radix-icons', name: 'accessibility', expectedStatus: 200, description: 'radix-icons accessibility icon', verifySvg: true },
  { category: 'radix-icons', library: 'radix-icons', name: 'cross-1', expectedStatus: 200, description: 'radix-icons cross-1 icon', verifySvg: true },
  { category: 'radix-icons', library: 'radix-icons', name: 'check', expectedStatus: 200, description: 'radix-icons check icon', verifySvg: true },
  { category: 'radix-icons', library: 'radix-icons', name: 'magnifying-glass', expectedStatus: 200, description: 'radix-icons magnifying-glass icon', verifySvg: true },
  { category: 'radix-icons', library: 'radix-icons', name: 'gear', expectedStatus: 200, description: 'radix-icons gear icon', verifySvg: true },

  // 5. simple-icons
  { category: 'simple-icons', library: 'simple-icons', name: 'github', expectedStatus: 200, description: 'simple-icons github icon', verifySvg: true },
  { category: 'simple-icons', library: 'simple-icons', name: 'google', expectedStatus: 200, description: 'simple-icons google icon', verifySvg: true },
  { category: 'simple-icons', library: 'simple-icons', name: 'twitter', expectedStatus: 200, description: 'simple-icons twitter icon', verifySvg: true },
  { category: 'simple-icons', library: 'simple-icons', name: 'react', expectedStatus: 200, description: 'simple-icons react icon', verifySvg: true },
  { category: 'simple-icons', library: 'simple-icons', name: 'nextdotjs', expectedStatus: 200, description: 'simple-icons nextdotjs icon', verifySvg: true },

  // 6. bootstrap-icons & bi
  { category: 'bootstrap-icons', library: 'bootstrap-icons', name: 'alarm', expectedStatus: 200, description: 'bootstrap-icons alarm (long name)', verifySvg: true },
  { category: 'bootstrap-icons', library: 'bi', name: 'alarm', expectedStatus: 200, description: 'bi alarm (short alias)', verifySvg: true },
  { category: 'bootstrap-icons', library: 'bootstrap-icons', name: 'check', expectedStatus: 200, description: 'bootstrap-icons check (long name)', verifySvg: true },
  { category: 'bootstrap-icons', library: 'bi', name: 'check', expectedStatus: 200, description: 'bi check (short alias)', verifySvg: true },
  { category: 'bootstrap-icons', library: 'bi', name: 'heart', expectedStatus: 200, description: 'bi heart', verifySvg: true },
  { category: 'bootstrap-icons', library: 'bi', name: 'gear', expectedStatus: 200, description: 'bi gear', verifySvg: true },

  // 7. phosphor-icons & ph
  { category: 'phosphor-icons', library: 'phosphor-icons', name: 'airplane', expectedStatus: 200, description: 'phosphor-icons airplane (long name)', verifySvg: true },
  { category: 'phosphor-icons', library: 'ph', name: 'airplane', expectedStatus: 200, description: 'ph airplane (short alias)', verifySvg: true },
  { category: 'phosphor-icons', library: 'phosphor-icons', name: 'user', expectedStatus: 200, description: 'phosphor-icons user', verifySvg: true },
  { category: 'phosphor-icons', library: 'ph', name: 'user', expectedStatus: 200, description: 'ph user', verifySvg: true },
  { category: 'phosphor-icons', library: 'ph', name: 'house', expectedStatus: 200, description: 'ph house', verifySvg: true },

  // 8. remix-icon & ri
  { category: 'remix-icon', library: 'remix-icon', name: 'home', expectedStatus: 200, description: 'remix-icon home (long name)', verifySvg: true },
  { category: 'remix-icon', library: 'ri', name: 'home', expectedStatus: 200, description: 'ri home (short alias)', verifySvg: true },
  { category: 'remix-icon', library: 'remix-icon', name: 'search', expectedStatus: 200, description: 'remix-icon search', verifySvg: true },
  { category: 'remix-icon', library: 'ri', name: 'search', expectedStatus: 200, description: 'ri search', verifySvg: true },
  { category: 'remix-icon', library: 'ri', name: 'user-line', expectedStatus: 200, description: 'ri user-line', verifySvg: true },

  // 9. ant-design & ant-design-icons
  { category: 'ant-design', library: 'ant-design', name: 'user', expectedStatus: 200, description: 'ant-design user', verifySvg: true },
  { category: 'ant-design', library: 'ant-design-icons', name: 'user', expectedStatus: 200, description: 'ant-design-icons user', verifySvg: true },
  { category: 'ant-design', library: 'ant-design', name: 'home', expectedStatus: 200, description: 'ant-design home', verifySvg: true },
  { category: 'ant-design', library: 'ant-design-icons', name: 'home', expectedStatus: 200, description: 'ant-design-icons home', verifySvg: true },
  { category: 'ant-design', library: 'ant-design', name: 'search', expectedStatus: 200, description: 'ant-design search', verifySvg: true },

  // 10. flag & flag-icons
  { category: 'flag-icons', library: 'flag', name: 'us-4x3', expectedStatus: 200, description: 'flag us-4x3 (short alias)', verifySvg: true },
  { category: 'flag-icons', library: 'flag-icons', name: 'us-4x3', expectedStatus: 200, description: 'flag-icons us-4x3 (long name)', verifySvg: true },
  { category: 'flag-icons', library: 'flag', name: 'gb-4x3', expectedStatus: 200, description: 'flag gb-4x3', verifySvg: true },
  { category: 'flag-icons', library: 'flag-icons', name: 'gb-4x3', expectedStatus: 200, description: 'flag-icons gb-4x3', verifySvg: true },
  { category: 'flag-icons', library: 'flag-icons', name: 'de-4x3', expectedStatus: 200, description: 'flag-icons de-4x3', verifySvg: true },
  { category: 'flag-icons', library: 'flag-icons', name: 'fr-4x3', expectedStatus: 200, description: 'flag-icons fr-4x3', verifySvg: true },
  { category: 'flag-icons', library: 'flag-icons', name: 'jp-4x3', expectedStatus: 200, description: 'flag-icons jp-4x3', verifySvg: true },

  // 11. Extended -icons libraries
  { category: 'extended-icons', library: 'bitcoin-icons', name: 'bitcoin', expectedStatus: 200, description: 'bitcoin-icons bitcoin', verifySvg: true },
  { category: 'extended-icons', library: 'eos-icons', name: 'loading', expectedStatus: 200, description: 'eos-icons loading', verifySvg: true },
  { category: 'extended-icons', library: 'game-icons', name: 'sword-brandish', expectedStatus: 200, description: 'game-icons sword-brandish', verifySvg: true },
  { category: 'extended-icons', library: 'grommet-icons', name: 'amazon', expectedStatus: 200, description: 'grommet-icons amazon', verifySvg: true },
  { category: 'extended-icons', library: 'lets-icons', name: 'done-ring-round', expectedStatus: 200, description: 'lets-icons done-ring-round', verifySvg: true },
  { category: 'extended-icons', library: 'mono-icons', name: 'heart', expectedStatus: 200, description: 'mono-icons heart', verifySvg: true },
  { category: 'extended-icons', library: 'skill-icons', name: 'typescript', expectedStatus: 200, description: 'skill-icons typescript', verifySvg: true },
  { category: 'extended-icons', library: 'vscode-icons', name: 'file-type-reactts', expectedStatus: 200, description: 'vscode-icons file-type-reactts', verifySvg: true },
  { category: 'extended-icons', library: 'patternfly-icons', name: 'user', expectedStatus: 200, description: 'patternfly-icons user (local/fallback)', verifySvg: true },
  { category: 'extended-icons', library: 'patternfly', name: 'user', expectedStatus: 200, description: 'patternfly user alias', verifySvg: true },
  { category: 'extended-icons', library: 'untitled-ui-icons', name: 'zap', expectedStatus: 200, description: 'untitled-ui-icons zap', verifySvg: true },
  { category: 'extended-icons', library: 'untitledui', name: 'zap', expectedStatus: 200, description: 'untitledui alias zap', verifySvg: true },
  { category: 'extended-icons', library: 'lucide-icons', name: 'home', expectedStatus: 200, description: 'lucide-icons home', verifySvg: true },
  { category: 'extended-icons', library: 'lucide', name: 'home', expectedStatus: 200, description: 'lucide alias home', verifySvg: true },
  { category: 'extended-icons', library: 'tabler-icons', name: 'home', expectedStatus: 200, description: 'tabler-icons home', verifySvg: true },
  { category: 'extended-icons', library: 'tabler', name: 'home', expectedStatus: 200, description: 'tabler alias home', verifySvg: true },
  { category: 'extended-icons', library: 'feather-icons', name: 'activity', expectedStatus: 200, description: 'feather-icons activity', verifySvg: true },
  { category: 'extended-icons', library: 'feather', name: 'activity', expectedStatus: 200, description: 'feather alias activity', verifySvg: true },
  { category: 'extended-icons', library: 'devicon', name: 'c', expectedStatus: 200, description: 'devicon c', verifySvg: true },
  { category: 'extended-icons', library: 'devicons', name: 'c', expectedStatus: 200, description: 'devicons c', verifySvg: true },

  // 12. Normalization & Variations
  { category: 'normalization', library: 'akar-icons', name: 'air.svg', expectedStatus: 200, description: 'Name with .svg suffix normalized', verifySvg: true },
  { category: 'normalization', library: 'akar-icons', name: 'circle_alert', expectedStatus: 200, description: 'Name with underscore normalized to dash', verifySvg: true },
  { category: 'normalization', library: 'akar-icons', name: 'AIR', expectedStatus: 200, description: 'Case normalization', verifySvg: true },
  { category: 'normalization', library: 'iconify-akar-icons', name: 'air', expectedStatus: 200, description: 'iconify- prefix normalization', verifySvg: true },

  // 13. Customization Query Parameters
  { category: 'customization', library: 'akar-icons', name: 'air', query: '?width=64&color=%23FF0000', expectedStatus: 200, description: 'Custom width=64 and color=#FF0000', verifySvg: true, expectedSize: '64', expectedColor: '#FF0000' },
  { category: 'customization', library: 'bi', name: 'alarm', query: '?width=48&color=%2300FF00', expectedStatus: 200, description: 'Custom width=48 and color=#00FF00 on local bi icon', verifySvg: true, expectedSize: '48', expectedColor: '#00FF00' },

  // 14. Edge Cases & Error Handling (Graceful 404 / 400, no crashes)
  { category: 'edge-cases', library: 'akar-icons', name: 'totally-nonexistent-icon-xyz-987654', expectedStatus: 404, description: 'Nonexistent icon in valid upstream library' },
  { category: 'edge-cases', library: 'bi', name: 'totally-nonexistent-icon-xyz-987654', expectedStatus: 404, description: 'Nonexistent icon in local library' },
  { category: 'edge-cases', library: 'nonexistent-fake-lib-12345', name: 'test-icon', expectedStatus: 404, description: 'Nonexistent library' },
  { category: 'edge-cases', library: 'akar-icons', name: '..', expectedStatus: 400, description: 'Path traversal attempt .. in name' },
  { category: 'edge-cases', library: 'akar-icons', name: 'subdir/icon', expectedStatus: 400, description: 'Slash in name' },
  { category: 'edge-cases', library: 'akar-icons', name: '<script>alert(1)</script>', expectedStatus: 400, description: 'XSS characters in name' },
  { category: 'edge-cases', library: '..', name: 'air', expectedStatus: 400, description: 'Path traversal attempt .. in library' },
  { category: 'edge-cases', library: 'akar<script>', name: 'air', expectedStatus: 400, description: 'XSS characters in library' },
]

async function runTestSuite() {
  console.log('======================================================================')
  console.log('STARTING EMPIRICAL ADVERSARIAL TEST SUITE: SVG RESOLUTION ROUTE')
  console.log('======================================================================\n')

  let passed = 0
  let failed = 0
  const results: Array<{
    test: TestCase
    actualStatus: number
    passed: boolean
    errorMessage?: string
    details: Record<string, unknown>
  }> = []

  for (let i = 0; i < TEST_CASES.length; i++) {
    const tc = TEST_CASES[i]
    const url = `http://localhost:3000/api/svg/${tc.library}/${tc.name}${tc.query || ''}`
    const req = new Request(url)

    let actualStatus = -1
    let contentType: string | null = null
    let body = ''
    let isSvgValid = false
    let hasXss = false
    let sizeMatched = true
    let colorMatched = true
    let errorMessage = ''

    try {
      const res = await GET(req, {
        params: Promise.resolve({ library: tc.library, name: tc.name }),
      })

      actualStatus = res.status
      contentType = res.headers.get('content-type')
      body = await res.text()

      if (tc.expectedStatus === 200) {
        if (!contentType || !contentType.includes('image/svg+xml')) {
          errorMessage += `Invalid content-type: ${contentType}. `
        }
        if (!body.startsWith('<svg') || !body.includes('</svg>')) {
          errorMessage += `Body is not a well-formed SVG element. `
        } else {
          isSvgValid = true
        }

        // Check for disallowed XSS constructs
        if (
          body.includes('<script') ||
          body.includes('javascript:') ||
          body.includes('<foreignObject') ||
          /\son[a-z]+\s*=/i.test(body)
        ) {
          hasXss = true
          errorMessage += `Body contains dangerous XSS constructs! `
        }

        // Customization verification
        if (tc.expectedSize) {
          if (!body.includes(`width="${tc.expectedSize}"`) || !body.includes(`height="${tc.expectedSize}"`)) {
            sizeMatched = false
            errorMessage += `Expected size ${tc.expectedSize} not reflected in SVG attributes. `
          }
        }
        if (tc.expectedColor) {
          if (!body.includes(tc.expectedColor)) {
            colorMatched = false
            errorMessage += `Expected color ${tc.expectedColor} not reflected in SVG. `
          }
        }
      } else {
        // Error status (400 or 404)
        if (!contentType || !contentType.includes('application/json')) {
          errorMessage += `Expected JSON error response content-type, got ${contentType}. `
        }
        try {
          const json = JSON.parse(body)
          if (!json.error) {
            errorMessage += `Error response missing 'error' property: ${body}. `
          }
        } catch {
          errorMessage += `Failed to parse error response as JSON: ${body}. `
        }
      }

      const testPassed =
        actualStatus === tc.expectedStatus &&
        (tc.expectedStatus !== 200 || (isSvgValid && !hasXss && sizeMatched && colorMatched))

      if (testPassed) {
        passed++
        console.log(`[PASS] (${i + 1}/${TEST_CASES.length}) [${tc.category}] ${tc.description} -> HTTP ${actualStatus}`)
      } else {
        failed++
        console.error(
          `[FAIL] (${i + 1}/${TEST_CASES.length}) [${tc.category}] ${tc.description} -> Expected HTTP ${tc.expectedStatus}, got ${actualStatus}. Errors: ${errorMessage}`
        )
      }

      results.push({
        test: tc,
        actualStatus,
        passed: testPassed,
        errorMessage: errorMessage || undefined,
        details: {
          contentType,
          bodyLength: body.length,
          preview: body.slice(0, 120).replace(/\n/g, ' '),
        },
      })
    } catch (err) {
      failed++
      console.error(`[EXCEPTION] (${i + 1}/${TEST_CASES.length}) [${tc.category}] ${tc.description}:`, err)
      results.push({
        test: tc,
        actualStatus: -1,
        passed: false,
        errorMessage: (err as Error).message,
        details: {},
      })
    }
  }

  // Also test OPTIONS handler
  console.log('\nTesting OPTIONS preflight handler...')
  try {
    const optRes = OPTIONS()
    const optStatus = optRes.status
    const allowOrigin = optRes.headers.get('Access-Control-Allow-Origin')
    const allowMethods = optRes.headers.get('Access-Control-Allow-Methods')
    const optPass = optStatus === 204 && allowOrigin === '*' && !!allowMethods
    if (optPass) {
      console.log(`[PASS] OPTIONS handler -> HTTP 204 with CORS headers (Allow-Origin: ${allowOrigin}, Methods: ${allowMethods})`)
      passed++
    } else {
      console.error(`[FAIL] OPTIONS handler -> Status ${optStatus}, Origin: ${allowOrigin}, Methods: ${allowMethods}`)
      failed++
    }
  } catch (err) {
    console.error(`[FAIL] OPTIONS handler exception:`, err)
    failed++
  }

  console.log('\n======================================================================')
  console.log(`TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED (TOTAL ${TEST_CASES.length + 1})`)
  console.log('======================================================================')

  return { passed, failed, total: TEST_CASES.length + 1, results }
}

runTestSuite()
  .then((res) => {
    if (res.failed > 0) {
      process.exit(1)
    }
    process.exit(0)
  })
  .catch((err) => {
    console.error('Fatal test runner error:', err)
    process.exit(1)
  })
