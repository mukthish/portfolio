datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   
  role      Role     @default(USER)
  createdAt DateTime @default(now())
}

model Project {
  id          String   @id @default(uuid())
  title       String
  description String
  techStack   String[] 
  githubUrl   String?
  liveUrl     String?
  isFeatured  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SandboxApp {
  id          String   @id @default(uuid())
  name        String
  category    String   // e.g., 'llm', 'data-pipeline', 'embedded'
  embedUrl    String   // Target link for the rendering iframe
  description String
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
