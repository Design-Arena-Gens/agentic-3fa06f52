import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Agentic Social Content Studio',
  description: 'Generate on-brand content for AI digital twins',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight text-white/90">
              Agentic Social Content Studio
            </h1>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-white/50 hover:text-white/80"
            >
              Powered by Next.js
            </a>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
