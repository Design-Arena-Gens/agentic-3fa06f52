"use client"

export default function ExportButtons({ outputs }: { outputs: any }) {
  const hasData = !!outputs?.items?.length

  const exportJSON = () => {
    if (!hasData) return
    const blob = new Blob([JSON.stringify(outputs, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'content.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    if (!hasData) return
    const header = ['platform', 'type', 'text']
    const rows = outputs.items.map((i: any) => [i.platform, i.type, JSON.stringify(i.text)])
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'content.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex items-center gap-3">
      <button className="button-primary" disabled={!hasData} onClick={exportJSON}>Export JSON</button>
      <button className="button-primary" disabled={!hasData} onClick={exportCSV}>Export CSV</button>
      <div className="ml-auto text-xs text-white/50">Ready for any social scheduler</div>
    </div>
  )
}
