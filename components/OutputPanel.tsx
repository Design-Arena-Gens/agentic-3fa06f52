"use client"

import { useMemo } from 'react'

function Copy({ text }: { text: string }) {
  return (
    <button
      className="text-xs text-white/60 hover:text-white/90"
      onClick={() => navigator.clipboard.writeText(text)}
    >
      Copy
    </button>
  )
}

export default function OutputPanel({ outputs, loading }: { outputs: any; loading: boolean }) {
  const hasData = useMemo(() => !!outputs && !!outputs.items?.length, [outputs])

  if (loading) return <p className="text-white/70">Generating content?</p>
  if (!hasData) return <p className="text-white/60">No content yet. Configure and click Generate.</p>

  return (
    <div className="space-y-4">
      {outputs.items.map((item: any, idx: number) => (
        <div key={idx} className="rounded-lg border border-white/10 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs uppercase tracking-wide text-white/50">{item.platform} ? {item.type}</div>
            <Copy text={item.text} />
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">{item.text}</pre>
          {item.metadata?.suggestedHashtags?.length ? (
            <div className="mt-2 text-xs text-white/60">
              Hashtags: {item.metadata.suggestedHashtags.join(' ')}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
