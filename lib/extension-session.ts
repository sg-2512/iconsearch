import { createSupabaseAdminClient } from './supabase-admin'
import { getBearerToken, hashOpaqueToken } from './device-auth'

export async function readExtensionSession(request: Request) {
  const token = getBearerToken(request)
  const admin = createSupabaseAdminClient()
  if (!token || !admin) return null

  let tokenHash: string
  try {
    tokenHash = hashOpaqueToken(token)
  } catch {
    return null
  }

  const { data: session, error } = await admin
    .from('extension_sessions')
    .select('id,user_id,product,entitlement_id,expires_at,revoked_at')
    .eq('token_hash', tokenHash)
    .maybeSingle()

  if (error || !session || session.revoked_at) return null
  if (new Date(session.expires_at).getTime() <= Date.now()) return null

  const { data: entitlement } = await admin
    .from('entitlements')
    .select('id,tier,status,founder_number,expires_at')
    .eq('id', session.entitlement_id)
    .maybeSingle()

  if (!entitlement || entitlement.status !== 'active') return null
  if (entitlement.expires_at && new Date(entitlement.expires_at).getTime() <= Date.now()) return null

  const { data: userResult } = await admin.auth.admin.getUserById(session.user_id)

  await admin
    .from('extension_sessions')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', session.id)

  return {
    admin,
    session,
    entitlement,
    email: userResult.user?.email || '',
  }
}
