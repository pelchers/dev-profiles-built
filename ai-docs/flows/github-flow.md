# 🔁 GitHub Flow: Fetch & Display GitHub Stats for User Profiles

This flow file defines how GitHub profile data is fetched and used across the platform — including on the user profile page, profile card, and profile image hover state. GitHub data is retrieved via the [GitHub REST API `GET /users/:username`](https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-a-user).

---

## 📦 GitHub Flow Folder Structure

```
server/
  flows/
    github/
      github.controller.ts
      github.routes.ts

client/
  src/
    components/
      flows/
        profiles/
          GitHubCard.tsx
          GitHubHoverTooltip.tsx
          GitHubProfileFull.tsx
          githubApi.ts
    pages/
      ProfilePage.tsx
```

```
server/
  flows/
    github/
      github.controller.ts
      github.routes.ts

client/
  src/
    components/
      flows/
        profiles/
          GitHubCard.tsx
          GitHubHoverTooltip.tsx
          GitHubProfileFull.tsx
    pages/
      ProfilePage.tsx
    utils/
      githubApi.ts
```

---

## 🌐 Backend Route: `/api/github/:username`

### github.controller.ts
```ts
import axios from 'axios';

export const fetchGitHubProfile = async (username: string) => {
  const response = await axios.get(`https://api.github.com/users/${username}`);
  return response.data;
};
```

### github.routes.ts
```ts
import express from 'express';
import { fetchGitHubProfile } from './github.controller';

const router = express.Router();

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const data = await fetchGitHubProfile(username);
    res.status(200).json(data);
  } catch (err: any) {
    res.status(404).json({ error: 'GitHub user not found' });
  }
});

export default router;
```

### Mount in server/index.ts
```ts
import githubRoutes from './flows/github/github.routes';
app.use('/api/github', githubRoutes);
```

---

## ⚙️ Frontend: API Utility

### githubApi.ts
```ts
export const getGitHubStats = async (username: string) => {
  const res = await fetch(`/api/github/${username}`);
  if (!res.ok) throw new Error('GitHub fetch failed');
  return res.json();
};
```

---

## 🖼️ GitHubCard.tsx (Profile Page)
```tsx
import { useEffect, useState } from 'react';
import { getGitHubStats } from '@/utils/githubApi';

export function GitHubCard({ username }: { username: string }) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (username) getGitHubStats(username).then(setProfile);
  }, [username]);

  if (!profile) return null;

  return (
    <div className="p-4 border rounded-xl shadow bg-white">
      <img src={profile.avatar_url} className="w-16 h-16 rounded-full" />
      <h2 className="text-lg font-bold">{profile.name || profile.login}</h2>
      <p className="text-sm text-gray-600">{profile.bio}</p>
      <div className="mt-2 text-sm text-gray-500">
        <span>Repos: {profile.public_repos}</span> • <span>Followers: {profile.followers}</span>
      </div>
    </div>
  );
}
```

---

## 🪄 GitHubHoverTooltip.tsx (Icon Hover)
```tsx
import { useEffect, useState } from 'react';
import { getGitHubStats } from '@/utils/githubApi';

export function GitHubHoverTooltip({ username }: { username: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (username) getGitHubStats(username).then(setData);
  }, [username]);

  if (!data) return null;

  return (
    <div className="absolute z-10 p-2 bg-white shadow-lg border rounded">
      <img src={data.avatar_url} className="w-12 h-12 rounded-full" />
      <div className="text-sm font-semibold">{data.name || data.login}</div>
      <div className="text-xs text-gray-500">{data.bio}</div>
      <div className="text-xs">Repos: {data.public_repos} • Followers: {data.followers}</div>
    </div>
  );
}
```

---

## 🧠 Usage Locations

| Page / Component        | GitHub Feature Used                                                                 |
|------------------------|------------------------------------------------------------------------------------|
| ProfilePage.tsx        | `<GitHubProfileFull username={user.githubUsername} />` displays all GitHub API stats |
| ProfileCard.tsx        | `<GitHubCard />` shows avatar, username, bio, followers, public_repos               |
| Avatar hover (anywhere)| `<GitHubHoverTooltip />` shows compact profile card                                |

| Page / Component        | GitHub Feature Used                                                      |
|------------------------|---------------------------------------------------------------------------|
| ProfilePage.tsx        | Full GitHub stats view (all available from GitHub API)                    |
| ProfileCard.tsx        | `<GitHubCard />` shows avatar, username, bio, followers, public_repos     |
| Avatar hover (anywhere)| `<GitHubHoverTooltip />` displays compact hover view of profile details  |

| Page / Component        | GitHub Feature Used                  |
|------------------------|--------------------------------------|
| ProfilePage.tsx        | `<GitHubCard username={user.githubUsername} />`        |
| ProfileCard.tsx        | Optional stats preview (repos, etc.) |
| Avatar hover (anywhere)| `<GitHubHoverTooltip />` on hover    |

---

## 🧼 Caching (optional)
To reduce API requests:
- Cache GitHub data in local state or IndexedDB
- Optionally store it in your DB on profile update
- Consider adding a manual "Refresh GitHub Info" button per user

---

✅ GitHub stats are now dynamically returned to your user pages, cards, and profile hover UIs.
