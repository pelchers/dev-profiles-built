// Mirrors the User model in the Prisma schema
export enum UserType {
  DEVELOPER = 'DEVELOPER',
  COMPANY = 'COMPANY'
}

export enum DevFocus {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  FULLSTACK = 'FULLSTACK',
  API = 'API',
  DESIGN = 'DESIGN',
  ANIMATION = 'ANIMATION',
  DEVOPS = 'DEVOPS',
  DATA = 'DATA',
  MOBILE = 'MOBILE',
  QA = 'QA',
  PRODUCT = 'PRODUCT',
  OTHER = 'OTHER'
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  userType: UserType;
  username: string;
  email: string;
  password?: string; // Only for internal use, never returned to client
  displayName?: string;
  profileImage?: string;
  bio?: string;
  githubUrl?: string;
  githubUsername?: string;
  location?: string;
  website?: string;
  title?: string;

  // Developer/Company Focus & Skills
  devFocus?: DevFocus[];
  languages?: string[];
  frameworks?: string[];
  tools?: string[];
  specialties?: string[];
  yearsExp?: number;
  openToRoles?: string[];

  // Social & Links
  socialLinks?: any; // JSON
  tags?: string[];
  preferences?: any; // JSON
  interests?: string[];

  // Developer-only fields
  experience?: any; // JSON
  education?: any; // JSON
  techStacks?: any; // JSON
  accolades?: any; // JSON
  roles?: string[];
  githubStats?: any; // JSON
  githubProfile?: any; // JSON
  githubId?: number;
  githubAvatarUrl?: string;
  githubHtmlUrl?: string;
  githubBio?: string;
  githubCompany?: string;
  githubBlog?: string;
  githubTwitter?: string;
  githubFollowers?: number;
  githubFollowing?: number;
  githubPublicRepos?: number;
  githubPublicGists?: number;
  githubCreatedAt?: Date;
  githubUpdatedAt?: Date;

  // Company-only fields
  companyName?: string;
  companySize?: string;
  industry?: string;
  hiring?: boolean;
  openRoles?: any; // JSON
  foundingYear?: number;
  teamLinks?: any; // JSON
  orgDescription?: string;

  // Auth & Security
  emailVerified: boolean;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  role: Role;

  createdAt: Date;
  updatedAt: Date;
}

// For profile update operations, make most fields optional
export type UserUpdateInput = Partial<Omit<User, 'id' | 'email' | 'emailVerified' | 'role' | 'createdAt' | 'updatedAt'>>;

// For auth tokens
export interface TokenPayload {
  userId: string;
  role: string;
}

// For user response (no sensitive fields)
export type UserResponse = Omit<User, 'password' | 'verificationToken' | 'resetToken' | 'resetTokenExpiry'>; 