import { publicJson, publicOptions } from '@/lib/device-auth'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

export function OPTIONS() {
  return publicOptions()
}

export async function GET() {
  const admin = createSupabaseAdminClient()
  if (!admin) return publicJson({ error: 'Launch status is not configured.' }, { status: 503 })

  const { data, error } = await admin
    .from('products')
    .select('id,name,founder_limit,founder_claimed')
    .order('id')

  if (error) return publicJson({ error: 'Could not load launch status.' }, { status: 500 })

  return publicJson({
    products: (data || []).map((product) => ({
      id: product.id,
      name: product.name,
      founderLimit: product.founder_limit,
      founderClaimed: product.founder_claimed,
      founderRemaining: Math.max(0, product.founder_limit - product.founder_claimed),
    })),
  })
}
