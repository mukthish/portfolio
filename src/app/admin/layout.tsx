import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4 font-mono">
        <div>
          <h1 className="text-xl font-bold text-accent">~/admin_dashboard</h1>
          <p className="text-xs text-foreground/60">Logged in as: {session.user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs hover:text-accent border border-border px-3 py-1">
            [view_site]
          </Link>
          <SignOutButton />
        </div>
      </div>
      {children}
    </div>
  )
}
