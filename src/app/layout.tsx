import type { Metadata } from 'next'
import { JetBrains_Mono, Roboto } from 'next/font/google'
import './globals.css'
import ThemeToggle from '@/components/ThemeToggle'
import NodeGraph from '@/components/ui/NodeGraph'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'Portfolio & Sandbox',
  description: 'Engineering Portfolio and Interactive Sandbox',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark bg-background text-foreground" suppressHydrationWarning>
      <head>
        {/* Anti-theme-flash script using client-side theme detection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${roboto.variable} ${jetbrainsMono.variable} font-sans min-h-screen flex flex-col transition-colors duration-300 relative overflow-x-hidden`}
      >
        {/* Background Canvas Node Graph */}
        <NodeGraph />

        {/* Floating background glowing lights */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-30 select-none">
          <div className="absolute -top-40 -left-40 w-96 md:w-[600px] h-96 md:h-[600px] bg-accent/20 rounded-full mix-blend-screen filter blur-[120px] dark:opacity-10 opacity-20" />
          <div className="absolute -bottom-40 -right-40 w-96 md:w-[600px] h-96 md:h-[600px] bg-accent/20 rounded-full mix-blend-screen filter blur-[120px] dark:opacity-10 opacity-20" />
        </div>

        <ThemeToggle />
        <main className="flex-1 p-6 sm:p-12 max-w-6xl w-full mx-auto relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
