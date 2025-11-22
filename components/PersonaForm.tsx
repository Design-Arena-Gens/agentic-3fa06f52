"use client"

import { useState } from 'react'
import { clsx } from 'clsx'
import type { Persona } from '@/app/page'

export default function PersonaForm({
  value,
  onChange,
}: {
  value: Persona
  onChange: (p: Persona) => void
}) {
  const [isScraping, setIsScraping] = useState(false)

  const update = (key: keyof Persona, v: string) => onChange({ ...value, [key]: v })

  const scrape = async () => {
    if (!value.website) return
    setIsScraping(true)
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value.website }),
      })
      const data = await res.json()
      if (data?.brandVoice) {
        update('brandGuidelines', `${value.brandGuidelines ? value.brandGuidelines + '\n\n' : ''}${data.brandVoice}`)
      }
    } finally {
      setIsScraping(false)
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-white/90">Persona</h2>
      <div className="grid grid-cols-1 gap-3">
        <input className="input" placeholder="Twin name (e.g., Ava the AI PM)" value={value.name} onChange={(e) => update('name', e.target.value)} />
        <textarea className="input min-h-20" placeholder="Voice & tone" value={value.voice} onChange={(e) => update('voice', e.target.value)} />
        <input className="input" placeholder="Audience" value={value.audience} onChange={(e) => update('audience', e.target.value)} />
        <input className="input" placeholder="Primary goals" value={value.goals} onChange={(e) => update('goals', e.target.value)} />
        <div className="flex gap-2">
          <input className="input flex-1" placeholder="Website (optional)" value={value.website}
                 onChange={(e) => update('website', e.target.value)} />
          <button className={clsx('button-primary', 'whitespace-nowrap')} disabled={!value.website || isScraping} onClick={scrape}>
            {isScraping ? 'Analyzing?' : 'Infer voice'}
          </button>
        </div>
        <textarea className="input min-h-28" placeholder="Brand guidelines (keywords, banned phrases, emoji policy, hashtags, etc.)" value={value.brandGuidelines}
                  onChange={(e) => update('brandGuidelines', e.target.value)} />
      </div>
    </div>
  )
}
