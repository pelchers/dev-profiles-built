# 🧩 Boilerplates GitHub Integration Guide

This guide outlines the process for enhancing the Boilerplates page with GitHub API integration, allowing users to add boilerplates by providing a GitHub repository URL and automatically retrieving repository data.

## 📁 File Structure

```
dev-profiles/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── ...
│   │   │   └── flows/
│   │   │       └── boilerplates/
│   │   │           └── AddBoilerplateModal.tsx  <- New component
│   │   ├── pages/
│   │   │   └── Boilerplates.tsx                 <- Modified page
│   │   └── types/
│   │       └── boilerplate.ts                   <- New type definitions
├── server/
│   ├── common/
│   │   └── types/
│   │       └── boilerplate.ts                   <- New type definitions
│   ├── flows/
│   │   └── boilerplates/                        <- New module
│   │       ├── boilerplateController.ts
│   │       └── boilerplateRoutes.ts
│   ├── middleware/
│   │   └── auth.ts
│   └── index.ts                                 <- Add routes
└── prisma/
    └── schema.prisma                            <- Add schema
```

## 🌐 Integration Flow

1. User provides a GitHub repository URL via an "Add Boilerplate" form
2. Backend validates the URL and extracts owner/repo information
3. Backend queries the GitHub API to fetch repository metadata
4. Backend saves the boilerplate entry with GitHub metadata to the database
5. Frontend displays the boilerplate with real GitHub stats and data

## 🧪 API Endpoints and Data Flow

### Frontend to Backend

**Endpoint:** `POST /api/boilerplates`

**Request Body:**
```typescript
{
  githubUrl: string; // e.g., "https://github.com/owner/repo-name"
  notes?: string;    // Optional user notes/description override
  featured?: boolean; // Optional admin flag
}
```

### Backend to GitHub API

**GitHub API Endpoint:** `GET /repos/{owner}/{repo}`

**Example URL:** `https://api.github.com/repos/facebook/react`

**Required Headers:**
- `Authorization: Bearer YOUR_GITHUB_TOKEN` (for higher rate limits)
- `Accept: application/vnd.github+json`
- `X-GitHub-Api-Version: 2022-11-28`

### GitHub Response to Database

**GitHub API Response (partial):**
```json
{
  "id": 10270250,
  "name": "react",
  "full_name": "facebook/react",
  "private": false,
  "owner": {
    "login": "facebook",
    "avatar_url": "https://avatars.githubusercontent.com/u/69631?v=4"
  },
  "html_url": "https://github.com/facebook/react",
  "description": "The library for web and native user interfaces.",
  "fork": false,
  "created_at": "2013-05-24T16:15:54Z",
  "updated_at": "2023-10-07T13:55:45Z",
  "pushed_at": "2023-10-07T15:45:29Z",
  "homepage": "https://react.dev",
  "size": 378035,
  "stargazers_count": 213764,
  "watchers_count": 213764,
  "language": "JavaScript",
  "forks_count": 44689,
  "open_issues_count": 1193,
  "license": {
    "key": "mit",
    "name": "MIT License",
    "url": "https://api.github.com/licenses/mit"
  },
  "topics": [
    "declarative",
    "frontend",
    "javascript",
    "library",
    "react",
    "ui"
  ]
}
```

## 📝 TypeScript Definitions

### Boilerplate Model

```typescript
// server/common/types/boilerplate.ts

export interface Boilerplate {
  id: string;
  githubId: number;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  homepage: string | null;
  size: number;
  stargazersCount: number;
  watchersCount: number;
  language: string | null;
  forksCount: number;
  openIssuesCount: number;
  topics: string[];
  license: {
    key: string;
    name: string;
    url: string;
  } | null;
  owner: {
    login: string;
    avatarUrl: string;
  };
  notes?: string; // Optional user-provided notes
  featured: boolean;
  addedAt: string;
  addedBy?: string; // User ID who added it
}
```

### Backend Schema (Prisma)

```prisma
// prisma/schema.prisma

model Boilerplate {
  id             String   @id @default(cuid())
  githubId       Int      @unique
  name           String
  fullName       String
  description    String?
  htmlUrl        String
  createdAt      DateTime
  updatedAt      DateTime
  pushedAt       DateTime
  homepage       String?
  size           Int
  stargazersCount Int
  watchersCount  Int
  language       String?
  forksCount     Int
  openIssuesCount Int
  topics         String[]
  licenseKey     String?
  licenseName    String?
  licenseUrl     String?
  ownerLogin     String
  ownerAvatarUrl String
  notes          String?
  featured       Boolean  @default(false)
  addedAt        DateTime @default(now())
  addedBy        String?
  user           User?    @relation(fields: [addedBy], references: [id])
}
```

## 🖥️ Frontend Components

### 1. Add Boilerplate Modal

```typescript
// client/src/components/flows/boilerplates/AddBoilerplateModal.tsx

import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { Button, Input, Modal } from '../../common';

interface AddBoilerplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBoilerplate: (githubUrl: string, notes?: string) => Promise<void>;
}

export const AddBoilerplateModal: React.FC<AddBoilerplateModalProps> = ({
  isOpen, onClose, onAddBoilerplate
}) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Simple validation
    if (!githubUrl.includes('github.com/')) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }
    
    setIsLoading(true);
    try {
      await onAddBoilerplate(githubUrl, notes);
      onClose();
      // Reset form
      setGithubUrl('');
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add boilerplate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Boilerplate">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Repository URL
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <FaGithub className="text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="https://github.com/username/repository"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="pl-10 w-full"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter the full URL to the GitHub repository
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            placeholder="Add custom notes or override the description"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm py-2">{error}</div>
        )}
        
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            Add Boilerplate
          </Button>
        </div>
      </form>
    </Modal>
  );
};
```

### 2. Updated Boilerplates Page with Tag Selection Changes

```typescript
// client/src/pages/Boilerplates.tsx (partial, showing tag filtering changes)

// Modified tag selection logic to allow combining tags (OR logic)
const filteredBoilerplates = boilerplateData.filter(boilerplate => {
  const matchesSearch = 
    boilerplate.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    boilerplate.description.toLowerCase().includes(searchTerm.toLowerCase());
  
  // Allow any selected tag to match (OR logic) instead of requiring all (AND logic)
  const matchesTags = 
    selectedTags.length === 0 || 
    selectedTags.some(tag => boilerplate.tags.includes(tag));
  
  return matchesSearch && matchesTags;
});
```

### 3. Add Boilerplate Button

```tsx
// In Boilerplates.tsx, top of page

// Add state for the modal
const [isAddModalOpen, setIsAddModalOpen] = useState(false);

// Add function to handle new boilerplate submission
const handleAddBoilerplate = async (githubUrl: string, notes?: string) => {
  try {
    const response = await fetch('/api/boilerplates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ githubUrl, notes }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add boilerplate');
    }
    
    // Refresh boilerplates list
    fetchBoilerplates();
  } catch (error) {
    console.error('Error adding boilerplate:', error);
    throw error;
  }
};

// Add button in the JSX, below the header
<div className="flex justify-between items-center mb-8">
  <h2 className="text-2xl font-semibold">Explore Boilerplates</h2>
  <Button onClick={() => setIsAddModalOpen(true)}>
    <FaPlus className="mr-2" /> Add Boilerplate
  </Button>
</div>

// Add modal component at the bottom of the JSX
<AddBoilerplateModal
  isOpen={isAddModalOpen}
  onClose={() => setIsAddModalOpen(false)}
  onAddBoilerplate={handleAddBoilerplate}
/>
```

## 🔧 Backend Implementation

### 1. Boilerplate Controller

```typescript
// server/flows/boilerplates/boilerplateController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Helper function to parse GitHub URL
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);
    if (!match) return null;
    
    return {
      owner: match[1],
      repo: match[2]
    };
  } catch (error) {
    return null;
  }
}

export const createBoilerplate = async (req: Request, res: Response) => {
  try {
    const { githubUrl, notes } = req.body;
    const userId = req.user?.id; // Assuming authenticated user
    
    // Parse GitHub URL
    const parsed = parseGitHubUrl(githubUrl);
    if (!parsed) {
      return res.status(400).json({ message: 'Invalid GitHub repository URL' });
    }
    
    const { owner, repo } = parsed;
    
    // Check if already exists
    const existing = await prisma.boilerplate.findFirst({
      where: {
        ownerLogin: owner,
        name: repo
      }
    });
    
    if (existing) {
      return res.status(409).json({ message: 'Boilerplate already exists in the system' });
    }
    
    // Fetch from GitHub API
    const githubResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        })
      }
    });
    
    const repoData = githubResponse.data;
    
    // Create new boilerplate
    const boilerplate = await prisma.boilerplate.create({
      data: {
        githubId: repoData.id,
        name: repoData.name,
        fullName: repoData.full_name,
        description: notes || repoData.description,
        htmlUrl: repoData.html_url,
        createdAt: new Date(repoData.created_at),
        updatedAt: new Date(repoData.updated_at),
        pushedAt: new Date(repoData.pushed_at),
        homepage: repoData.homepage,
        size: repoData.size,
        stargazersCount: repoData.stargazers_count,
        watchersCount: repoData.watchers_count,
        language: repoData.language,
        forksCount: repoData.forks_count,
        openIssuesCount: repoData.open_issues_count,
        topics: repoData.topics || [],
        licenseKey: repoData.license?.key,
        licenseName: repoData.license?.name,
        licenseUrl: repoData.license?.url,
        ownerLogin: repoData.owner.login,
        ownerAvatarUrl: repoData.owner.avatar_url,
        notes: notes || null,
        featured: false,
        addedBy: userId
      }
    });
    
    return res.status(201).json(boilerplate);
  } catch (error) {
    console.error('Error creating boilerplate:', error);
    return res.status(500).json({ message: 'Failed to add boilerplate' });
  }
};

export const getBoilerplates = async (req: Request, res: Response) => {
  try {
    const boilerplates = await prisma.boilerplate.findMany({
      orderBy: {
        stargazersCount: 'desc'
      }
    });
    
    return res.status(200).json(boilerplates);
  } catch (error) {
    console.error('Error fetching boilerplates:', error);
    return res.status(500).json({ message: 'Failed to fetch boilerplates' });
  }
};
```

### 2. Boilerplate Routes

```typescript
// server/flows/boilerplates/boilerplateRoutes.ts

import express from 'express';
import { createBoilerplate, getBoilerplates } from './boilerplateController';
import { authenticate } from '../../middleware/auth';

const router = express.Router();

// Get all boilerplates
router.get('/', getBoilerplates);

// Add a new boilerplate (requires authentication)
router.post('/', authenticate, createBoilerplate);

export default router;
```

### 3. Integrate with Main Server

```typescript
// server/index.ts (partial)

import boilerplateRoutes from './flows/boilerplates/boilerplateRoutes';

// ...

app.use('/api/boilerplates', boilerplateRoutes);
```

## 🚨 Error Handling

1. **GitHub API Rate Limiting**: Implement token-based authentication and exponential backoff
2. **Invalid Repository URLs**: Validate URLs before making API calls
3. **Repository Not Found**: Handle 404 responses from GitHub API
4. **Duplicate Entries**: Check for existing entries before adding new ones

## 🔄 Refresh Strategy

1. **Periodic Updates**: Schedule a cron job to update repository stats every 24 hours
2. **Manual Refresh**: Add a refresh button for admin users to trigger updates

## 🔐 Security Considerations

1. **GitHub Tokens**: Store as environment variables, never in code
2. **User Permissions**: Only authenticated users can add boilerplates
3. **Admin Controls**: Only admins can flag boilerplates as "featured"
4. **Input Validation**: Sanitize all user inputs to prevent XSS and injection attacks

## 🔍 Implementation Steps

1. Create Prisma schema for Boilerplate model
2. Implement backend API endpoints for adding and fetching boilerplates
3. Create frontend components for displaying boilerplates with GitHub data
4. Implement "Add Boilerplate" modal and form
5. Update tag filtering logic to support "OR" combinations
6. Add GitHub API integration with proper error handling
7. Implement periodic refresh of repository data

## 🎯 Future Enhancements

1. Allow users to rate and review boilerplates
2. Add a "Try in CodeSandbox" button for compatible repositories
3. Implement GitHub webhook integration for real-time updates
4. Add trending and popular categories based on recent stars and forks
5. Create a comparison tool for comparing multiple boilerplates 