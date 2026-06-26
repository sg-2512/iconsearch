import { publicJson, publicOptions } from '@/lib/device-auth'
import { readExtensionSession } from '@/lib/extension-session'

export const runtime = 'nodejs'

export function OPTIONS() {
  return publicOptions()
}

export async function POST(request: Request) {
  const result = await readExtensionSession(request)
  if (!result) return publicJson({ error: 'Invalid or expired session.' }, { status: 401 })

  const { error } = await result.admin
    .from('extension_sessions')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', result.session.id)

  if (error) return publicJson({ error: 'Could not revoke session.' }, { status: 500 })
  return publicJson({ revoked: true })
}
