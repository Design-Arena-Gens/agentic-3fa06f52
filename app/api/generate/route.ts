import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const InputSchema = z.object({
  persona: z.object({
    name: z.string().optional(),
    voice: z.string(),
    audience: z.string(),
    goals: z.string(),
    website: z.string().optional(),
    brandGuidelines: z.string().optional(),
  }),
  platforms: z.array(z.enum(['x', 'linkedin', 'instagram', 'tiktok'])).min(1),
  contentTypes: z.array(z.enum(['post', 'thread', 'caption', 'video_script'])).min(1),
  quantity: z.number().min(1).max(10).default(4),
})

type Item = { platform: string; type: string; text: string; metadata?: any }

type AIProvider = 'openai' | 'local'

async function useOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('NO_KEY')
  const { default: OpenAI } = await import('openai')
  const client = new OpenAI({ apiKey })
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a social media copywriter for AI digital twins. Keep copy tight, specific, and on-brand. Use platform-native conventions. Avoid fluff.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
  })
  const text = response.choices?.[0]?.message?.content?.trim() || ''
  return text
}

function fallbackLocal(prompt: string): string {
  const lines = prompt.split('\n').slice(0, 3).join(' ')
  return [
    `Idea: ${lines}`,
    '',
    'Hook: What nobody tells you about this?',
    'Value: 3 crisp bullets with specifics.',
    'CTA: Reply "GO" for the full breakdown.',
    '',
    '#AI #DigitalTwins #ContentStrategy',
  ].join('\n')
}

function platformHashtags(platform: string): string[] {
  const common = ['#AI', '#DigitalTwin', '#Automation']
  if (platform === 'linkedin') return [...common, '#Leadership']
  if (platform === 'instagram') return [...common, '#Creator']
  if (platform === 'tiktok') return [...common, '#HowTo']
  return [...common, '#BuildInPublic']
}

function buildPrompt(input: z.infer<typeof InputSchema>): string {
  const { persona, platforms, contentTypes, quantity } = input
  return `Persona: ${persona.name || 'Unnamed twin'}\nVoice: ${persona.voice}\nAudience: ${persona.audience}\nGoals: ${persona.goals}\nBrand: ${persona.brandGuidelines || 'N/A'}\n\nGenerate ${quantity} options across platforms [${platforms.join(', ')}] and types [${contentTypes.join(', ')}].\nEach item must be concise, skimmable, platform-native, and end with a strong CTA when relevant. Provide copy only.`
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const input = InputSchema.parse(json)

    const provider: AIProvider = process.env.OPENAI_API_KEY ? 'openai' : 'local'
    const prompt = buildPrompt(input)

    const items: Item[] = []
    for (const platform of input.platforms) {
      for (const type of input.contentTypes) {
        for (let i = 0; i < input.quantity; i++) {
          const content = provider === 'openai' ? await useOpenAI(`${prompt}\n\nPlatform: ${platform}\nType: ${type}`) : fallbackLocal(`${prompt} [${platform} ? ${type}]`)
          items.push({
            platform,
            type,
            text: content,
            metadata: { suggestedHashtags: platformHashtags(platform) },
          })
        }
      }
    }

    return NextResponse.json({ provider, items }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 400 })
  }
}
