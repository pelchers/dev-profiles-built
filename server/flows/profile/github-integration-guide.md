# GitHub Integration Guide

## Overview

This document explains how the GitHub integration works in the Dev Profiles application, including the sync process, data flow, and common troubleshooting steps.

## How GitHub Integration Works

The GitHub integration allows users to connect their GitHub profiles to their Dev Profiles account, syncing data such as repositories, followers, and other profile information to enrich their developer profile.

### Integration Flow

```
┌───────────┐    ┌───────────────┐    ┌────────────┐    ┌───────────┐
│ ProfileUI │───▶│ API Endpoints │───▶│ Controller │───▶│ GitHub API│
└───────────┘    └───────────────┘    └────────────┘    └───────────┘
      │                 │                  │                  │
      │                 │                  │                  │
      └─────────────────┴──────────────────┴──────────────────┘
                               │
                               ▼
                         ┌──────────┐
                         │ Database │
                         └──────────┘
```

### Key Components

1. **GitHub Controller**: Located in `server/flows/github/github.controller.cjs`
   - Manages GitHub data fetching and syncing
   - Handles transformation between GitHub API data and our database model

2. **Profile Component**: Located in `client/src/pages/ProfilePage.tsx`
   - Provides UI for GitHub sync button and displays GitHub data
   - Triggers the sync process via API calls

3. **API Integration**: Located in `client/src/api/profile.ts`
   - Provides methods to communicate with backend endpoints
   - Handles the API responses and errors

## Data Mapping

The GitHub integration maps the following fields:

| GitHub API Field | User Model Field | Description |
|-----------------|------------------|-------------|
| `login` | `githubUsername` | GitHub username |
| `id` | `githubId` | Unique GitHub ID |
| `avatar_url` | `githubAvatarUrl` | Profile picture URL |
| `html_url` | `githubHtmlUrl` | GitHub profile URL |
| `bio` | `githubBio` | GitHub bio |
| `company` | `githubCompany` | Company listed on GitHub |
| `blog` | `githubBlog` | Website/blog URL |
| `location` | `location` | User location |
| `twitter_username` | `githubTwitter` | Twitter handle |
| `followers` | `githubFollowers` | Number of followers |
| `following` | `githubFollowing` | Number of people following |
| `public_repos` | `githubPublicRepos` | Number of public repositories |
| `public_gists` | `githubPublicGists` | Number of public gists |
| `created_at` | `githubCreatedAt` | GitHub account creation date |
| `updated_at` | `githubUpdatedAt` | Last GitHub profile update |

Additionally, a composite `githubStats` JSON field is created with simplified stats for quick access:
```javascript
githubStats: {
  stars: data.public_repos * 2, // Placeholder calculation 
  followers: data.followers,
  following: data.following,
  repos: data.public_repos,
  gists: data.public_gists,
  lastUpdated: new Date().toISOString()
}
```

## Configuration Requirements

For GitHub integration to work properly:

1. **Environment Variables**: 
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_API_URL=https://api.github.com
   ```

2. **GitHub Token Scopes**:
   - `user:read` - To read user profile information
   - `repo:read` - To access repository data

3. **Rate Limiting Considerations**:
   - Without a token: 60 requests/hour
   - With a token: 5,000 requests/hour

## Recent Fixes and Updates

### Schema Misalignment Fix

We recently fixed a field mismatch issue in the GitHub controller:

**Problem**: The controller was trying to update a non-existent field called `githubLocation`.

**Solution**: Updated the controller to use the standard `location` field instead:

```javascript
// BEFORE: Caused Prisma error
data: {
  // ...other fields
  githubLocation: githubData.location, // Field doesn't exist in schema
}

// AFTER: Fixed to use existing field
data: {
  // ...other fields
  location: githubData.location || user.location, // Use existing location field
}
```

### JSON Rendering Fix

**Problem**: The frontend was trying to directly render the `githubStats` JSON object, causing React errors.

**Solution**: Added special handling for the `githubStats` field in the ProfileField component:

```javascript
// Added special handling for githubStats
if (field.key === 'githubStats') {
  // Parse it if it's a string
  let stats = value;
  if (typeof stats === 'string') {
    try {
      stats = JSON.parse(stats);
    } catch {
      stats = {};
    }
  }
  
  // If it's an object, format it for display
  if (stats && typeof stats === 'object') {
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">{field.label}</label>
        <div className="p-2 bg-gray-50 rounded">
          {Object.keys(stats).length > 0 ? (
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(stats, null, 2)}
            </pre>
          ) : (
            <span className="text-gray-400">No stats available</span>
          )}
        </div>
      </div>
    );
  }
}
```

## Troubleshooting Common Issues

### 1. "Failed to sync GitHub profile" Error

Possible causes:
- Invalid GitHub username or URL
- GitHub API rate limit exceeded
- Missing or invalid GitHub token
- Database schema mismatch

Solutions:
- Verify the GitHub username is correct
- Check if your token has appropriate permissions
- Ensure rate limits haven't been exceeded
- Verify all mapped fields exist in the Prisma schema

### 2. GitHub Data Not Displaying

Possible causes:
- Data wasn't properly synced
- JSON rendering errors in the frontend
- Field mismatch between API response and React component

Solutions:
- Check the database to confirm data was saved
- Add proper JSON object handling in the ProfilePage component
- Verify that the field names in the UI match the database schema

### 3. GitHub API Rate Limiting

Symptoms:
- Sync fails with a 403 or 429 status code
- Error message mentions rate limits

Solutions:
- Add a GITHUB_TOKEN environment variable
- Implement caching to reduce API calls
- Add exponential backoff for retries

## Best Practices

1. **Use an App Token**: Always use a GitHub token with the necessary scopes for increased rate limits.

2. **Cache GitHub Data**: The profile stores a complete copy of GitHub data to reduce API calls.

3. **Graceful Degradation**: The UI shows useful information even if GitHub sync fails.

4. **Manual Override**: Users can manually update their GitHub URL or username if needed.

## Future Enhancements

1. **Webhook Integration**: Subscribe to GitHub webhooks to automatically update when the user's GitHub profile changes.

2. **Repository Detail Sync**: Fetch and display detailed information about the user's top repositories.

3. **Contribution Graph**: Add a GitHub-style contribution graph to show the user's activity.

4. **Organization Support**: Support syncing information about organizations the user belongs to.

## Conclusion

The GitHub integration provides valuable additional information about developers, enhancing their profiles with verified activity data from GitHub. The recent fixes ensure reliable operation and proper display of GitHub data.

For more technical details, refer to the environment and deployment guides in the auth flow folder. 