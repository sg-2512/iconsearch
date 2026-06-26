'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import AuthModal from '@/app/components/AuthModal'
import { createClient, isSupabaseConfigured } from '@/lib/supabase'

type ConnectClientProps = {
  product: string
  code: string
  authError: string
}

type Approval = {
  product: string
  tier: 'free' | 'founder'
  founderNumber: number | null
}

const productNames: Record<string, string> = {
  vscode: 'VS Code extension',
  figma: 'Figma plugin',
}

export default function ConnectClient({ product, code, authError }: ConnectClientProps) {
  const [user, setUser] = useState<User | null>(null)
  const [checkingUser, setCheckingUser] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [approving, setApproving] = useState(false)
  const [error, setError] = useState(authError)
  const [approval, setApproval] = useState<Approval | null>(null)

  const validRequest = Boolean(productNames[product] && code.length >= 20)
  const redirectTo = useMemo(
    () => `/connect?product=${encodeURIComponent(product)}&code=${encodeURIComponent(code)}`,
    [code, product]
  )

  useEffect(() => {
    let unsubscribe = () => {}

    void (async () => {
      const supabase = await createClient()
      if (!supabase) {
        setCheckingUser(false)
        return
      }

      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setCheckingUser(false)

      const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
      })
      unsubscribe = () => subscription.subscription.unsubscribe()
    })()

    return () => unsubscribe()
  }, [])

  const approve = async () => {
    setApproving(true)
    setError('')

    try {
      const response = await fetch('/api/device/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, code }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Could not approve this device.')

      setApproval({
        product: payload.product,
        tier: payload.tier,
        founderNumber: payload.founderNumber ?? null,
      })
    } catch (approvalError) {
      setError(approvalError instanceof Error ? approvalError.message : 'Could not approve this device.')
    } finally {
      setApproving(false)
    }
  }

  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 32px', minHeight: '70vh' }}>
      <div style={{
        border: '1px solid var(--border)',
        borderRadius: '18px',
        background: 'var(--bg-card)',
        padding: 'clamp(24px, 6vw, 48px)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          color: 'var(--accent)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          letterSpacing: '0.16em',
          marginBottom: '14px',
        }}>
          {'// SECURE DEVICE CONNECTION'}
        </div>
        <h1 style={{ fontSize: 'clamp(30px, 6vw, 48px)', lineHeight: 1.05, margin: '0 0 14px' }}>
          Connect IconSearch
        </h1>

        {!validRequest ? (
          <StatusCard tone="error" title="This connection link is invalid">
            Start sign-in again from the IconSearch extension or plugin. Device links expire after 10 minutes.
          </StatusCard>
        ) : approval ? (
          <StatusCard tone="success" title="Connection approved">
            {approval.tier === 'founder' && approval.founderNumber
              ? `You claimed lifetime Founder access #${approval.founderNumber} for the ${productNames[approval.product]}.`
              : `Your free ${productNames[approval.product]} access is active.`}
            {' '}You can close this browser tab and return to the app.
          </StatusCard>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.7, marginBottom: '28px' }}>
              The <strong style={{ color: 'var(--text)' }}>{productNames[product]}</strong> is requesting
              access to your IconSearch account. Your password never enters the extension or plugin.
            </p>

            {error && (
              <StatusCard tone="error" title="Could not connect">
                {error}
              </StatusCard>
            )}

            {!isSupabaseConfigured() ? (
              <StatusCard tone="error" title="Authentication is not configured">
                Add the Supabase environment variables to the website before testing extension sign-in.
              </StatusCard>
            ) : checkingUser ? (
              <StatusCard tone="neutral" title="Checking your account">
                One moment while IconSearch verifies your browser session.
              </StatusCard>
            ) : user ? (
              <div>
                <div style={{
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '18px',
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                }}>
                  Signed in as <strong style={{ color: 'var(--text)' }}>{user.email}</strong>
                </div>
                <button
                  type="button"
                  onClick={approve}
                  disabled={approving}
                  style={primaryButtonStyle}
                >
                  {approving ? 'Approving...' : `Approve ${productNames[product]}`}
                </button>
              </div>
            ) : (
              <div>
                <button type="button" onClick={() => setShowAuth(true)} style={primaryButtonStyle}>
                  Sign in or create a free account
                </button>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6, marginTop: '14px' }}>
                  The first 500 verified users of each product receive lifetime Founder access.
                </p>
              </div>
            )}
          </>
        )}

        <div style={{ borderTop: '1px solid var(--border)', marginTop: '28px', paddingTop: '20px', color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.7 }}>
          Approving shares only your account email, product entitlement, and an opaque revocable session token.
          {' '}Read the <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/terms">Terms</Link>.
        </div>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onAuthSuccess={(signedInUser) => {
          setUser(signedInUser)
          setShowAuth(false)
        }}
        redirectTo={redirectTo}
      />
    </main>
  )
}

function StatusCard({
  tone,
  title,
  children,
}: {
  tone: 'success' | 'error' | 'neutral'
  title: string
  children: React.ReactNode
}) {
  const colors = {
    success: { border: 'rgba(16,185,129,.45)', bg: 'rgba(16,185,129,.1)', text: '#6ee7b7' },
    error: { border: 'rgba(244,63,94,.45)', bg: 'rgba(244,63,94,.1)', text: '#fda4af' },
    neutral: { border: 'var(--border)', bg: 'rgba(148,163,184,.06)', text: 'var(--text-muted)' },
  }[tone]

  return (
    <div style={{ border: `1px solid ${colors.border}`, background: colors.bg, borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
      <strong style={{ display: 'block', color: 'var(--text)', marginBottom: '6px' }}>{title}</strong>
      <span style={{ color: colors.text, lineHeight: 1.6 }}>{children}</span>
    </div>
  )
}

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid rgba(129,140,248,.65)',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #7c6af7, #4f46e5)',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 800,
  padding: '13px 18px',
}
