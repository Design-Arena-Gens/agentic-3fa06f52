"use client"

const types = [
  { id: 'post', label: 'Single Post' },
  { id: 'thread', label: 'Thread / Carousel Outline' },
  { id: 'caption', label: 'Caption' },
  { id: 'video_script', label: 'Short Video Script' },
]

export default function ContentTypeSelector({
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
      <h2 className="text-sm font-medium text-white/90">Content types</h2>
      <div className="grid grid-cols-2 gap-2">
        {types.map((t) => (
          <button
            key={t.id}
            className={`rounded-md border border-white/10 px-3 py-2 text-sm ${value.includes(t.id) ? 'bg-white/10' : 'bg-transparent hover:bg-white/5'}`}
            onClick={() => toggle(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
