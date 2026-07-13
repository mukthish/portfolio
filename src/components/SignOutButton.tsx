'use client'

import { signOut } from 'next-auth/react'
import { TerminalButton } from './ui/TerminalButton'

export default function SignOutButton() {
  return (
    <TerminalButton
      variant="outline"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-xs border-red-500/50 text-red-500 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
    >
      terminate_session
    </TerminalButton>
  )
}
