'use client'

import { useState, useEffect, useRef, useActionState } from 'react'
import { uploadSectionImage, deleteSectionImage, moveSectionImage } from './actions'

// ── design tokens (matching existing admin) ───────────────────────────────────
const C = {
  teal: '#1A6B60',
  tealBg: 'rgba(42,191,168,0.12)',
  border: '1px solid rgba(20,24,29,0.10)',
  text: '#14181D',
  sub: '#5B6470',
  muted: '#97A0AC',
  bg: '#FFFFFF',
  page: '#F2F5F8',
  danger: '#F87171',
  dangerBg: 'rgba(248,113,113,0.10)',
} as const

// ── types ─────────────────────────────────────────────────────────────────────
export type SectionDef = {
  key: string
  label: string
  description?: string
  max: number
  images: string[]
}

// ── SectionUploader ───────────────────────────────────────────────────────────
function SectionUploader({ sectionKey, disabled }: { sectionKey: string; disabled: boolean }) {
  const bound = uploadSectionImage.bind(null, sectionKey)
  const [state, formAction, pending] = useActionState(bound, null)
  const [ok, setOk] = useState(false)
  const [selectedCount, setSelectedCount] = useState(0)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!state?.ok) return
    setOk(true)
    if (ref.current) ref.current.value = ''
    setSelectedCount(0)
    const t = setTimeout(() => setOk(false), 3000)
    return () => clearTimeout(t)
  }, [state])

  return (
    <form action={formAction}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
        <input
          ref={ref}
          type="file"
          name="files"
          accept="image/*"
          multiple
          disabled={disabled || pending}
          onChange={(e) => setSelectedCount(e.target.files?.length || 0)}
          style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={disabled || pending}
          style={{
            background: disabled ? C.page : 'transparent',
            color: disabled ? C.muted : C.text,
            border: C.border,
            borderRadius: 5,
            padding: '0.45rem 1rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: disabled || pending ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          {selectedCount > 0 ? `${selectedCount} geselecteerd` : '+ Bestanden kiezen'}
        </button>
        <button
          type="submit"
          disabled={disabled || pending || selectedCount === 0}
          style={{
            background: disabled || selectedCount === 0 ? C.page : C.teal,
            color: disabled || selectedCount === 0 ? C.muted : '#fff',
            border: 'none',
            borderRadius: 5,
            padding: '0.45rem 1rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: disabled || pending || selectedCount === 0 ? 'not-allowed' : 'pointer',
            opacity: pending ? 0.65 : 1,
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          {pending ? 'Uploaden…' : 'Uploaden'}
        </button>

        {ok && (
          <span style={{ fontSize: '0.74rem', color: C.teal }}>Opgeslagen ✓</span>
        )}
        {state && !state.ok && state.error && (
          <span style={{ fontSize: '0.74rem', color: C.danger }}>{state.error}</span>
        )}
        {disabled && (
          <span style={{ fontSize: '0.72rem', color: C.muted, fontStyle: 'italic' }}>
            Maximum bereikt
          </span>
        )}
      </div>
    </form>
  )
}

// ── ImageCard ─────────────────────────────────────────────────────────────────
function ImageCard({
  url,
  index,
  total,
  sectionKey,
}: {
  url: string
  index: number
  total: number
  sectionKey: string
}) {
  const btnBase: React.CSSProperties = {
    border: 'none',
    borderRadius: 3,
    width: '100%',
    height: 22,
    cursor: 'pointer',
    fontSize: '0.72rem',
    fontFamily: 'inherit',
    fontWeight: 600,
    background: 'rgba(20,24,29,0.60)',
    color: '#fff',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Thumbnail */}
      <div
        style={{
          position: 'relative',
          borderRadius: 5,
          overflow: 'hidden',
          aspectRatio: '1',
          background: C.page,
          border: C.border,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Position badge */}
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: 3,
            background: 'rgba(20,24,29,0.60)',
            color: '#fff',
            fontSize: '0.58rem',
            fontWeight: 700,
            borderRadius: 3,
            padding: '1px 5px',
            lineHeight: 1.6,
          }}
        >
          {index + 1}
        </span>

        {/* Delete button */}
        <form
          action={deleteSectionImage.bind(null, sectionKey, url)}
          style={{ position: 'absolute', top: 3, right: 3 }}
        >
          <button
            type="submit"
            title="Verwijderen"
            onClick={(e) => {
              if (!confirm('Afbeelding verwijderen?')) e.preventDefault()
            }}
            style={{
              background: 'rgba(220,50,50,0.88)',
              color: '#fff',
              border: 'none',
              borderRadius: 3,
              width: 22,
              height: 22,
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: 'inherit',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </form>
      </div>

      {/* Order controls */}
      <div style={{ display: 'flex', gap: 2 }}>
        <form action={moveSectionImage.bind(null, sectionKey, url, 'left')} style={{ flex: 1 }}>
          <button
            type="submit"
            disabled={index === 0}
            title="Naar links"
            style={{
              ...btnBase,
              opacity: index === 0 ? 0.25 : 1,
              cursor: index === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ←
          </button>
        </form>
        <form
          action={moveSectionImage.bind(null, sectionKey, url, 'right')}
          style={{ flex: 1 }}
        >
          <button
            type="submit"
            disabled={index === total - 1}
            title="Naar rechts"
            style={{
              ...btnBase,
              opacity: index === total - 1 ? 0.25 : 1,
              cursor: index === total - 1 ? 'not-allowed' : 'pointer',
            }}
          >
            →
          </button>
        </form>
      </div>
    </div>
  )
}

// ── SectionCard ───────────────────────────────────────────────────────────────
function SectionCard({ section }: { section: SectionDef }) {
  const isFull = section.images.length >= section.max

  return (
    <div
      style={{
        background: C.bg,
        border: C.border,
        borderRadius: 8,
        padding: '1.4rem 1.6rem',
        marginBottom: '0.85rem',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: section.images.length > 0 ? '1rem' : '0.75rem',
        }}
      >
        <div>
          <p
            style={{
              color: C.text,
              fontWeight: 700,
              fontSize: '0.9rem',
              marginBottom: section.description ? '0.2rem' : 0,
            }}
          >
            {section.label}
          </p>
          {section.description && (
            <p style={{ color: C.muted, fontSize: '0.73rem', lineHeight: 1.5 }}>
              {section.description}
            </p>
          )}
        </div>
        <span
          style={{
            flexShrink: 0,
            fontSize: '0.68rem',
            fontWeight: 700,
            color: isFull ? C.danger : C.teal,
            background: isFull ? C.dangerBg : C.tealBg,
            borderRadius: 999,
            padding: '0.18rem 0.65rem',
          }}
        >
          {section.images.length} / {section.max}
        </span>
      </div>

      {/* Image grid */}
      {section.images.length === 0 ? (
        <div
          style={{
            border: '1px dashed rgba(20,24,29,0.15)',
            borderRadius: 6,
            padding: '1.75rem',
            textAlign: 'center',
            color: C.muted,
            fontSize: '0.78rem',
            marginBottom: '0.75rem',
          }}
        >
          Nog geen afbeeldingen — upload hieronder de eerste.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
            gap: '0.5rem',
            marginBottom: '0.85rem',
          }}
        >
          {section.images.map((url, i) => (
            <ImageCard
              key={url}
              url={url}
              index={i}
              total={section.images.length}
              sectionKey={section.key}
            />
          ))}
        </div>
      )}

      {/* Upload */}
      <SectionUploader sectionKey={section.key} disabled={isFull} />
    </div>
  )
}

// ── main exported component ───────────────────────────────────────────────────
export default function ImageSectionClient({
  homepageSections,
  dienstenSections,
}: {
  homepageSections: SectionDef[]
  dienstenSections: SectionDef[]
}) {
  const [tab, setTab] = useState<'homepage' | 'diensten'>('homepage')

  const total = (arr: SectionDef[]) => arr.reduce((s, x) => s + x.images.length, 0)

  function tabBtn(id: typeof tab, label: string, count: number) {
    const active = tab === id
    return (
      <button
        key={id}
        onClick={() => setTab(id)}
        style={{
          padding: '0.42rem 1.1rem',
          borderRadius: 5,
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.82rem',
          fontWeight: active ? 700 : 500,
          background: active ? C.teal : 'transparent',
          color: active ? '#fff' : C.sub,
          transition: 'all 0.15s',
        }}
      >
        {label}{' '}
        <span
          style={{
            fontSize: '0.68rem',
            opacity: 0.8,
            background: active ? 'rgba(255,255,255,0.2)' : 'rgba(20,24,29,0.08)',
            borderRadius: 999,
            padding: '0.1rem 0.45rem',
            marginLeft: 3,
          }}
        >
          {count}
        </span>
      </button>
    )
  }

  const active = tab === 'homepage' ? homepageSections : dienstenSections

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-archivo)',
              color: C.text,
              fontSize: '1.5rem',
              fontWeight: 800,
              marginBottom: '0.25rem',
            }}
          >
            Afbeeldingen
          </h1>
          <p style={{ color: C.muted, fontSize: '0.85rem' }}>
            Beheer foto&apos;s per sectie — homepage en dienstenpagina&apos;s.
          </p>
        </div>
        <div
          style={{
            background: C.page,
            border: C.border,
            borderRadius: 6,
            padding: '0.65rem 1rem',
            textAlign: 'right',
          }}
        >
          <p style={{ fontSize: '1.2rem', fontWeight: 700, color: C.text, lineHeight: 1 }}>
            {total(homepageSections) + total(dienstenSections)}
          </p>
          <p style={{ fontSize: '0.68rem', color: C.muted, marginTop: 2 }}>totaal afbeeldingen</p>
        </div>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          gap: '0.3rem',
          background: C.page,
          padding: '0.28rem',
          borderRadius: 7,
          width: 'fit-content',
          marginBottom: '1.5rem',
        }}
      >
        {tabBtn('homepage', 'Homepage', total(homepageSections))}
        {tabBtn('diensten', 'Diensten', total(dienstenSections))}
      </div>

      {/* Sections */}
      <div>
        {active.map((section) => (
          <SectionCard key={section.key} section={section} />
        ))}
      </div>
    </div>
  )
}
