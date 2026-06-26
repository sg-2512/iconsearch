import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const requestedNext = url.searchParams.get('next') || '/account'
  const next = requestedNext.startsWith('/') && !requestedNext.startsWith('//')
    ? requestedNext
    : '/account'

  if (code) {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) return NextResponse.redirect(new URL(next, url.origin))
    }
  }

  const failureUrl = new URL(next, url.origin)
  failureUrl.searchParams.set('authError', 'Could not complete sign in. Please try again.')
  return NextResponse.redirect(failureUrl)
}
