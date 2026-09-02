'use client'

import { useState } from 'react'
import { t, type Lang } from '@/lib/i18n'

export default function FAQSection({
  lang,
  heading,
  items,
}: {
  lang: Lang
  heading?: string
  items?: { q: string; a: string }[]
}) {
  const tr = t[lang].faq
  const faqHeading = heading ?? tr.heading
  const faqItems = items ?? tr.items
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" style={{ background: '#F8FAFC', padding: '7rem 3.5rem' }}>
      <div className="faq-grid" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <div className="rv" style={{ textAlign: 'center' }}>
          {/* Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(0, 128, 128, 0.08)',
            border: '1px solid rgba(0, 128, 128, 0.2)',
            borderRadius: 50,
            padding: '0.35rem 1.1rem',
            marginBottom: '1.25rem'
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#007a63', display: 'block' }} />
            <span style={{
              fontFamily: 'var(--font-outfit)',
              fontWeight: 600,
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#007a63'
            }}>
              FAQ
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-archivo)',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)',
            lineHeight: 1.2,
            color: '#1A1A1A',
            margin: 0
          }}>
            {faqHeading}
          </h2>
        </div>

        {/* Accordion List */}
        <div className="rv d1" style={{ borderTop: '1px solid #E2E8F0' }}>
          {faqItems.map((it, i) => {
            const isOpen = open === i
            return (
              <div key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    padding: '1.75rem 0',
                    textAlign: 'left'
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-archivo)',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    color: isOpen ? '#007a63' : '#1A1A1A',
                    lineHeight: 1.4,
                    transition: 'color 0.2s ease'
                  }}>
                    {it.q}
                  </span>

                  {/* Circular icon */}
                  <span style={{
                    flexShrink: 0,
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: isOpen ? '1px solid #007a63' : '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isOpen ? '#FFFFFF' : '#4A5568',
                    transition: 'all 0.3s ease',
                    transform: isOpen ? 'rotate(45deg)' : 'none',
                    background: isOpen ? '#007a63' : 'transparent',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>

                <div style={{
                  maxHeight: isOpen ? 320 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.35s ease, opacity 0.35s ease',
                  opacity: isOpen ? 1 : 0
                }}>
                  <p style={{
                    fontSize: '0.98rem',
                    lineHeight: 1.7,
                    color: '#4A5568',
                    fontFamily: 'var(--font-outfit)',
                    fontWeight: 400,
                    paddingBottom: '1.75rem',
                    margin: 0,
                    maxWidth: '92%'
                  }}>
                    {it.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}