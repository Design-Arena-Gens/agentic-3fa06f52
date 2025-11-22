import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') throw new Error('Missing url')

    const r = await fetch(url, { headers: { 'User-Agent': 'Agentic-Voice-Scraper/1.0' } })
    const html = await r.text()
    const $ = cheerio.load(html)

    const text = $('p, h1, h2, h3, li').map((_, el) => $(el).text()).get().join('\n')
    const cleaned = text
      .replace(/\s+/g, ' ')
      .replace(/\n{2,}/g, '\n')
      .slice(0, 5000)

    const brandVoice = `Inferred voice (draft):\n- Common phrases: ${Array.from(new Set(cleaned.split(' ').filter(w => w.length > 6).slice(0, 20))).join(', ')}\n- Style: ${cleaned.includes('we ') ? 'Collective, company-forward' : 'Personal, direct'}\n- Reading level: ${cleaned.length > 2000 ? 'Mid' : 'Simple'}\n- Tone: ${cleaned.includes('innov') ? 'Innovative' : 'Practical'}\n\nKey excerpts:\n${cleaned.slice(0, 600)}?`

    return NextResponse.json({ brandVoice })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to scrape' }, { status: 400 })
  }
}
