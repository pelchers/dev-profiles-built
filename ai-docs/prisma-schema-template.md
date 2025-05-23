generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --- User Model ---
model User {
  id             String    @id @default(uuid())
  userType       UserType  // 'DEVELOPER' or 'COMPANY' or 'DESIGNER'
  username       String    @unique
  email          String    @unique
  password       String
  displayName    String?
  profileImage   String?
  bio            String?
  githubUrl      String?
  githubUsername String?
  location       String?
  website        String?
  title          String?

  // Developer/Company Focus & Skills
  devFocus       DevFocus[]      // e.g. [FRONTEND, BACKEND, FULLSTACK, API, DESIGN, ANIMATION, DEBUGGING]
  languages      String[]        // e.g. ["JavaScript", "TypeScript", "Python"]
  frameworks     String[]        // e.g. ["React", "Next.js", "Django"]
  tools          String[]        // e.g. ["Docker", "Figma", "AWS"]
  specialties    String[]        // e.g. ["UI/UX", "Testing", "DevOps"]
  yearsExp       Int?            // Years of experience
  openToRoles    String[]        // e.g. ["Mentor", "Freelance", "Full-time"]

  // Social & Links
  socialLinks    Json?           // { twitter: "...", linkedin: "...", ... }
  tags           String[]
  preferences    Json?
  interests      String[]

  // Developer-only fields
  experience     Json?           // [{ company, title, start, end, description }]
  education      Json?           // [{ school, degree, start, end }]
  techStacks     Json?           // [{ name, description, tools }]
  accolades      Json?           // [{ title, issuer, date }]
  roles          String[]        // e.g. ["Lead", "Contributor"]
  githubStats    Json?           // Cached GitHub stats

  // Company-only fields
  companyName    String?
  companySize    String?         // e.g. "1-10", "11-50", "51-200"
  industry       String?
  hiring         Boolean?
  openRoles      Json?           // [{ title, description, requirements }]
  foundingYear   Int?
  teamLinks      Json?           // [{ name, url }]
  orgDescription String?

  // Relationships
  projects       Project[]     @relation("UserProjects")
  watches        Watch[]       @relation("UserWatches")
  posts          Post[]        @relation("UserPosts")
  likes          Like[]        @relation("UserLikes")
  messagesSent   Message[]     @relation("SentMessages")
  messagesReceived Message[]   @relation("ReceivedMessages")
  following      String[]
  followers      String[]
  repos          Repo[]        // All repos added/owned by this user

  // Auth & Security
  emailVerified     Boolean   @default(false)
  verificationToken String?
  resetToken        String?
  resetTokenExpiry  DateTime?
  role              Role      @default(USER)

  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
}

enum UserType {
  DEVELOPER
  COMPANY
}

enum DevFocus {
  FRONTEND
  BACKEND
  FULLSTACK
  API
  DESIGN
  ANIMATION
  DEVOPS
  DATA
  MOBILE
  QA
  PRODUCT
  OTHER
}

enum Role {
  USER
  ADMIN
}

// --- Project Model ---
model Project {
  id               String   @id @default(uuid())
  userId           String
  title            String
  description      String?
  url              String?
  livePreviewUrl   String?
  coverImage       String?
  status           String?
  visibility       String?
  projectType      String?
  repoType         String?
  collaboration    Boolean?
  startDate        DateTime?
  endDate          DateTime?
  lastUpdated      DateTime?
  tags             String[]
  stack            Json?
  contributors     Json?
  deploymentHost   String?
  infraDetails     Json?
  changelog        Json?
  featureStatus    Json?
  testCoverage     String?
  analyticsEnabled Boolean?
  isClientWork     Boolean?
  isWhiteLabeled   Boolean?
  orgName          String?
  creator          User     @relation("UserProjects", fields: [userId], references: [id])
  watchers         Watch[]  @relation("WatchedProject")
  repos            Repo[]   // All repos associated with this project
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

// --- Repo Model (GitHub Integration) ---
model Repo {
  id             String   @id @default(uuid())
  ownerId        String              // User who added/owns this repo (foreign key)
  githubId       Int                 // GitHub repo ID (from GitHub API)
  githubOwner    String              // GitHub username/org (from API)
  githubName     String              // GitHub repo name (from API)
  fullName       String              // e.g. "owner/repo"
  description    String?
  htmlUrl        String              // GitHub repo URL
  homepage       String?
  language       String?
  topics         String[]
  license        String?
  forksCount     Int
  stargazersCount Int
  watchersCount  Int
  openIssuesCount Int
  isPrivate      Boolean
  isFork         Boolean
  createdAt      DateTime
  updatedAt      DateTime
  pushedAt       DateTime
  owner          User     @relation(fields: [ownerId], references: [id])
  projectId      String?
  project        Project? @relation(fields: [projectId], references: [id])
  notes          String?
  featured       Boolean  @default(false)
}

// --- Other Models ---
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
