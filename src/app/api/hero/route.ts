import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.heroSettings.findFirst()
    return NextResponse.json(settings || {})
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { name, subtitle, techStack, githubUrl, linkedinUrl } = body

    const settings = await prisma.heroSettings.upsert({
      where: { id: 'singleton' },
      update: {
        name,
        subtitle,
        techStack,
        githubUrl,
        linkedinUrl,
      },
      create: {
        id: 'singleton',
        name,
        subtitle,
        techStack,
        githubUrl,
        linkedinUrl,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
