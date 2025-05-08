generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String    @id @default(uuid())
  type           String?   // 'developer' or 'company'
  username       String?   @unique
  email          String?   @unique
  displayName    String?
  profileImage   String?
  bio            String?
  githubHandle   String?
  location       String?
  website        String?
  title          String?

  // Universal optional
  socialLinks    Json?
  tags           String[]
  preferences    Json?
  interests      String[]

  // Developer-only fields
  experience     Json?
  education      Json?
  techStacks     Json?
  accolades      Json?
  roles          String[]
  githubStats    Json?

  // Company-only fields
  companySize    String?
  industry       String?
  hiring         Boolean?
  openRoles      Json?
  foundingYear   Int?
  teamLinks      Json?

  // Relationships
  projects       Project[]     @relation("UserProjects")
  watches        Watch[]       @relation("UserWatches")
  posts          Post[]        @relation("UserPosts")
  likes          Like[]        @relation("UserLikes")
  messagesSent   Message[]     @relation("SentMessages")
  messagesReceived Message[]   @relation("ReceivedMessages")
  following      String[]
  followers      String[]

  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
}

model Project {
  id               String   @id @default(uuid())
  userId           String

  // Basic Info
  title            String
  description      String?
  url              String?
  livePreviewUrl   String?
  coverImage       String?

  // Project Status / Type / Access
  status           String?
  visibility       String?
  projectType      String?
  repoType         String?
  collaboration    Boolean?

  // Timeline & Milestones
  startDate        DateTime?
  endDate          DateTime?
  lastUpdated      DateTime?

  // Technology & Team
  tags             String[]
  stack            Json?
  contributors     Json?

  // Production / Deployment Info
  deploymentHost   String?
  infraDetails     Json?
  changelog        Json?
  featureStatus    Json?
  testCoverage     String?
  analyticsEnabled Boolean?

  // Ownership & Org Context
  isClientWork     Boolean?
  isWhiteLabeled   Boolean?
  orgName          String?

  // Relations
  creator          User     @relation("UserProjects", fields: [userId], references: [id])
  watchers         Watch[]  @relation("WatchedProject")

  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model Watch {
  id          String   @id @default(uuid())
  userId      String
  projectId   String

  user        User     @relation("UserWatches", fields: [userId], references: [id])
  project     Project  @relation("WatchedProject", fields: [projectId], references: [id])

  createdAt   DateTime @default(now())
}

model TagColor {
  id         String   @id @default(uuid())
  name       String   @unique
  type       String   // 'category' or 'subcategory'
  category   String?
  color      String   // Tailwind class e.g. 'bg-blue-500'
}

model Message {
  id          String   @id @default(uuid())
  senderId    String
  recipientId String
  content     String
  read        Boolean  @default(false)

  sender      User     @relation("SentMessages", fields: [senderId], references: [id])
  recipient   User     @relation("ReceivedMessages", fields: [recipientId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Post {
  id            String   @id @default(uuid())
  userId        String
  title         String?
  description   String?
  subtext       String?
  mediaUrl      String?
  linkUrl       String?
  tags          String[]
  taggedUsers   String[]

  author        User     @relation("UserPosts", fields: [userId], references: [id])
  likes         Like[]   @relation("PostLikes")

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Like {
  id        String   @id @default(uuid())
  userId    String
  postId    String

  user      User     @relation("UserLikes", fields: [userId], references: [id])
  post      Post     @relation("PostLikes", fields: [postId], references: [id])

  createdAt DateTime @default(now())

  @@unique([userId, postId])
}
