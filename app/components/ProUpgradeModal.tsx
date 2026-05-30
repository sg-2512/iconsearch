'use client'

interface ProUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  reason: string
}

export default function ProUpgradeModal({ isOpen, onClose, reason }: ProUpgradeModalProps) {
  if (!isOpen) return null

  const features = [
    { icon: '♾️', title: 'Unlimited Icon Packs', desc: 'Create as many workspace packs as you need' },
    { icon: '📦', title: 'Unlimited Icons per Pack', desc: 'No cap on the number of icons in each pack' },
    { icon: '⚛️', title: 'React & Vue Exports', desc: 'Download production-ready component files' },
    { icon: '🖼️', title: 'PNG Rasterization', desc: 'Export high-DPI PNG images at any scale' },
    { icon: '🗂️', title: 'SVG Sprite Sheets', desc: 'Generate optimized sprite bundles for performance' },
    { icon: '☁️', title: 'Cloud Sync', desc: 'Access your workspaces from any device, any browser' },
  ]

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(9, 9, 11, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      padding: '20px',
    }}>
      <div style={{
        background: 'rgba(17, 17, 27, 0.82)',
        border: '1px solid rgba(234, 179, 8, 0.35)',
        borderRadius: '20px',
        padding: '36px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 0 40px rgba(234, 179, 8, 0.1), 0 25px 50px -12px rgb(0 0 0 / 0.6)',
        position: 'relative',
        animation: 'proModalIn 0.35s ease-out',
        fontFamily: 'Inter, sans-serif',
      }}>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes proModalIn {
            from { transform: scale(0.95) translateY(10px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }
          @keyframes proShimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
        `}} />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted, #94a3b8)',
            cursor: 'pointer',
            fontSize: '18px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#f43f5e'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted, #94a3b8)'}
        >
          ✕
        </button>

        {/* Badge */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 50%, #eab308 100%)',
            backgroundSize: '200% auto',
            animation: 'proShimmer 3s linear infinite',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            ✦ PRO WORKSPACE ✦
          </span>
        </div>

        {/* Header */}
        <h2 style={{
          textAlign: 'center',
          fontSize: '22px',
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '-0.02em',
          margin: '0 0 8px 0',
        }}>
          Unlock the Full Experience
        </h2>
        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--text-muted, #94a3b8)',
          margin: '0 0 6px 0',
          lineHeight: '1.5',
        }}>
          {reason}
        </p>

        {/* Limit Notice */}
        <div style={{
          background: 'rgba(234, 179, 8, 0.08)',
          border: '1px solid rgba(234, 179, 8, 0.25)',
          borderRadius: '10px',
          padding: '12px',
          marginTop: '16px',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '12px',
            color: '#fef08a',
            margin: 0,
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            Free Plan → 3 packs · 12 icons/pack · SVG only
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '24px',
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '12px',
              transition: 'border-color 0.2s',
            }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>{f.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{f.title}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted, #94a3b8)', lineHeight: '1.4' }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 50%, #d97706 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '14px',
            color: '#000',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(234, 179, 8, 0.3)',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(234, 179, 8, 0.5)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(234, 179, 8, 0.3)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Upgrade to Pro — Coming Soon
        </button>

        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--text-muted, #64748b)',
          marginTop: '12px',
        }}>
          Pro workspace features are under active development.
        </p>
      </div>
    </div>
  )
}
