// Mirrors the server-side User model for type consistency
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
  githubCreatedAt?: string;
  githubUpdatedAt?: string;

  // Company-only fields
  companyName?: string;
  companySize?: string;
  industry?: string;
  hiring?: boolean;
  openRoles?: {
    title: string;
    description?: string;
    requirements?: string[];
    benefits?: string[];
    type?: string;
    url?: string;
    location?: string;
    salary?: string;
  }[];
  foundingYear?: number;
  teamLinks?: {
    name: string;
    url: string;
  }[];
  orgDescription?: string;

  // Auth & Security (excluding sensitive fields like password)
  emailVerified: boolean;
  role: Role;

  createdAt: string;
  updatedAt: string;
}

// For profile update operations, make most fields optional
export type UserUpdateInput = Partial<Omit<User, 'id' | 'email' | 'emailVerified' | 'role' | 'createdAt' | 'updatedAt'>>;

// For auth token
export interface TokenPayload {
  userId: string;
  role: string;
  exp: number;
}

// Auth response formats
export interface LoginResponse {
  token: string;
  user: User;
  expiresAt: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
  expiresAt: string;
} 