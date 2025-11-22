"use client"

const platforms = [
  { id: 'x', label: 'X / Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
]

export default function PlatformSelector({
  value,
  onChange,
}: {
  value: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter((v) => v !== id))
    else onChange([...value, id])
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-white/90">Platforms</h2>
      <div className="grid grid-cols-2 gap-2">
        {platforms.map((p) => (
          <button
            key={p.id}
            className={`rounded-md border border-white/10 px-3 py-2 text-sm ${value.includes(p.id) ? 'bg-white/10' : 'bg-transparent hover:bg-white/5'}`}
            onClick={() => toggle(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
