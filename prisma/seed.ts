import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const defaultEmail = 'admin@portfolio.local'
  const defaultPassword = 'admin' // User requested default password, can be changed later
  const hashedPassword = await bcrypt.hash(defaultPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: defaultEmail },
    update: {},
    create: {
      email: defaultEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log(`Admin user created with email: ${admin.email}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
