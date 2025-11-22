"use client"

import { addDays, format } from 'date-fns'

export default function CalendarSuggestions() {
  const today = new Date()
  const slots = Array.from({ length: 10 }).map((_, i) => addDays(today, i + 1))

  return (
    <div>
      <h2 className="mb-2 text-sm font-medium text-white/90">Suggested posting schedule (next 10 days)</h2>
      <div className="grid grid-cols-2 gap-2 text-sm text-white/80">
        {slots.map((d, i) => (
          <div key={i} className="rounded-md border border-white/10 bg-white/5 px-3 py-2">
            {format(d, 'EEE, MMM d')} ? {['9:12 AM', '12:03 PM', '5:47 PM'][i % 3]}
          </div>
        ))}
      </div>
    </div>
  )
}
