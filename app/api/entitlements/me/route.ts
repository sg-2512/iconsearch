import { publicJson, publicOptions } from '@/lib/device-auth'
import { readExtensionSession } from '@/lib/extension-session'

export const runtime = 'nodejs'

export function OPTIONS() {
  return publicOptions()
}

export async function GET(request: Request) {
  const result = await readExtensionSession(request)
  if (!result) return publicJson({ error: 'Invalid or expired session.' }, { status: 401 })

  return publicJson({
    access: {
      email: result.email,
      product: result.session.product,
      tier: result.entitlement.tier,
      status: result.entitlement.status,
      founderNumber: result.entitlement.founder_number,
      expiresAt: result.session.expires_at,
    },
  })
}
