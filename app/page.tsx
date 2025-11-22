"use client"

import { useState } from 'react'
import PersonaForm from '@/components/PersonaForm'
import PlatformSelector from '@/components/PlatformSelector'
import ContentTypeSelector from '@/components/ContentTypeSelector'
import OutputPanel from '@/components/OutputPanel'
import CalendarSuggestions from '@/components/CalendarSuggestions'
import ExportButtons from '@/components/ExportButtons'

export type Persona = {
  name: string
  voice: string
  audience: string
  goals: string
  website?: string
  brandGuidelines?: string
}

export type GenerationRequest = {
  persona: Persona
  platforms: string[]
  contentTypes: string[]
  quantity: number
  keywords?: string
  callToAction?: string
}

export default function Page() {
  const [persona, setPersona] = useState<Persona>({
    name: '',
    voice: 'Witty, insightful, and helpful. Short sentences. Active voice.',
    audience: 'AI-curious creators, indie hackers, and operators',
    goals: 'Drive signups, educate, and entertain while building trust',
    website: '',
    brandGuidelines: '',
  })
  const [platforms, setPlatforms] = useState<string[]>(['x', 'linkedin'])
  const [contentTypes, setContentTypes] = useState<string[]>(['post'])
  const [quantity, setQuantity] = useState<number>(4)
  const [loading, setLoading] = useState(false)
  const [outputs, setOutputs] = useState<any>(null)

  const generate = async () => {
    setLoading(true)
    setOutputs(null)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persona, platforms, contentTypes, quantity }),
    })
    const data = await res.json()
    setOutputs(data)
    setLoading(false)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-4">
        <div className="card">
          <PersonaForm value={persona} onChange={setPersona} />
        </div>

        <div className="card">
          <PlatformSelector value={platforms} onChange={setPlatforms} />
        </div>

        <div className="card">
          <ContentTypeSelector value={contentTypes} onChange={setContentTypes} />
          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm text-white/70">Quantity</label>
            <input
              type="number"
              min={1}
              max={10}
              className="input max-w-24"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value || '1'))}
            />
            <button className="button-primary ml-auto" onClick={generate} disabled={loading}>
              {loading ? 'Generating?' : 'Generate'}
            </button>
          </div>
        </div>

        <div className="card">
          <CalendarSuggestions />
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="card">
          <OutputPanel outputs={outputs} loading={loading} />
        </div>
        <div className="card">
          <ExportButtons outputs={outputs} />
        </div>
      </div>
    </div>
  )
}
