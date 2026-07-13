'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { TerminalCard } from '@/components/ui/TerminalCard'
import { TerminalButton } from '@/components/ui/TerminalButton'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        setError('AUTH_FAILURE: Access Denied.')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('SYSTEM_ERROR: Connection failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <TerminalCard title="sudo_login.sh">
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-sm">
          <div className="text-accent text-xs mb-2">
            WARNING: UNAUTHORIZED ACCESS IS LOGGED
          </div>

          {error && (
            <div className="bg-red-950/20 border border-red-500 text-red-500 p-2 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-foreground/70 text-xs block">ADMIN_EMAIL:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-border text-foreground px-3 py-2 focus:border-accent focus:outline-none"
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-foreground/70 text-xs block">ACCESS_KEY:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-background border border-border text-foreground px-3 py-2 focus:border-accent focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <TerminalButton type="submit" disabled={loading} className="w-full">
              {loading ? 'AUTHENTICATING...' : 'ESTABLISH_SESSION'}
            </TerminalButton>
          </div>
        </form>
      </TerminalCard>
    </div>
  )
}
