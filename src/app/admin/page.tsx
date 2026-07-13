import { prisma } from '@/lib/prisma'
import AdminDashboard from '@/components/AdminDashboard'

export const revalidate = 0

export default async function AdminPage() {
  const projects = await prisma.project.findMany({
    orderBy: [
      { displayOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  })

  const heroSettings = await prisma.heroSettings.findFirst()

  return (
    <AdminDashboard
      initialProjects={projects}
      initialHeroSettings={heroSettings || null}
    />
  )
}
