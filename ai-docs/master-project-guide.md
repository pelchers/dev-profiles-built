# 🛠️ FULL PROJECT GUIDE: Dev Profiles + Company Connect Platform

*Maximum explanation, maximum structure, maximum clarity – written as if this is your first time building it, integrating all updated specs and architecture.*

---

## ✅ 0. Project Overview and Goals

### 0.1 Summary

You are building a **developer-focused social platform** with optional company accounts, where users:

* Create comprehensive dev or company profiles
* Link GitHub for contribution insights
* Post projects and posts
* Follow/watch/like other users or content
* Connect through DMs and shared interests

### 0.2 Tech Stack

| Layer    | Technology                | Notes                               |
| -------- | ------------------------- | ----------------------------------- |
| Frontend | Vite + React + TypeScript | SPA, Tailwind styling               |
| Backend  | Express + TypeScript      | API + business logic                |
| ORM      | Prisma                    | PostgreSQL integration              |
| Database | PostgreSQL                | Relational, scalable schema         |
| Hosting  | Render                    | Single server or monorepo supported |

### 0.3 Dev Philosophy

* Flat, optional schema (no required fields except IDs)
* Scalable types using JSON and string arrays
* Color-coded tags and keyword matching
* Relational querying support for everything (likes, watches, messages)

---

## ✅ 1. Full Folder Structure

```
dev-profiles-app/
├── client/             # Vite React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── profiles/
│   │   │   ├── projects/
│   │   │   ├── posts/
│   │   │   ├── messages/
│   │   │   └── common/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── App.tsx
│   └── index.html
│
├── server/             # Express API backend
│   ├── flows/
│   │   ├── users/
│   │   ├── posts/
│   │   ├── projects/
│   │   ├── messages/
│   │   └── tags/
│   ├── prismaClient.ts
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── media/
├── .env
├── package.json
└── tailwind.config.ts
```

> **Explanation:**
> Component-level modularity by feature flow. All schema logic handled in `schema.prisma`. Communication is API-driven via REST endpoints.

---

## ✅ 2. Database Schema Summary (Prisma)

**Key Models:** `User`, `Project`, `Post`, `Message`, `Like`, `Watch`, `TagColor`

* All models support full relational querying.
* All fields optional unless relationally required.
* Uses `String[]`, `Json`, and `@relation` for flexibility.

**Supports:**

* My Projects, My Likes, Watched Projects, Tagged Posts, Followers, etc.
* Conditional fields per user type (developer vs. company)
* GitHub integration optional

> **See `schema.prisma` file for full schema.**

---

## ✅ 3. Color Coding System (Tag + Keyword Highlighting)

### Functionality

* Applies colored classes based on tags or detected words
* Purely frontend logic via `colorLookup.ts`
* No DB needed unless you opt into syncing with the `TagColor` model

### Use Cases

* Bio, tags, posts, and stack labels
* Works incrementally: add to any component when ready

### Sample Utility Call

```tsx
<span className={getTextColor(word)}>{word}</span>
<span className={`bg-${getTagColor(tag)}`}>{tag}</span>
```

> **See** `Color System Lightweight Guide` **for full implementation logic and component examples.**

---

## ✅ 4. API Flow Examples

### Submit a Post

```ts
POST /api/posts
Body: { userId, title, description, tags, mediaUrl, taggedUsers }
```

### Get User’s Likes

```ts
GET /api/users/:id/likes
Returns list of posts liked by user.
```

### Watch a Project

```ts
POST /api/watch
Body: { userId, projectId }
```

### Send Message

```ts
POST /api/messages
Body: { senderId, recipientId, content }
```

> All flows handled in Express route → controller → Prisma query pattern.

---

## ✅ 5. Feature-by-Feature Summary

| Feature      | Enabled By                               |
| ------------ | ---------------------------------------- |
| Profile CRUD | User model + frontend edit page          |
| Projects     | Project model w/ stack, tags, timeline   |
| Posts        | Post model w/ likes, tags, users         |
| Likes        | Like model w/ deduplication constraint   |
| Messages     | Message model w/ read state              |
| Watches      | Watch model w/ user ↔ project connection |
| Tag Styling  | Utility function or TagColor table       |

---

## ✅ 6. Local Dev Setup

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Runs both frontend and backend.
Set `VITE_API_URL=http://localhost:3001`

---

## ✅ 7. Render Deployment (Suggested Setup)

* Deploy client + server separately or in a monorepo
* Use Render PostgreSQL add-on
* Add `.env` with `DATABASE_URL`
* Use build/start commands: `npm run build && npm start`

---

## ✅ 8. Recommended Next Steps

* Create reusable UI components for tag badges, colored words, and profile cards
* Add admin UI for editing TagColor mappings
* Expand Watch/Like features into explore filters
* Sync GitHub stats with API proxy (optional)

---

Your project is now fully structured, scalable, and deploy-ready with:

* Detailed schema
* Component-first UI architecture
* API routes for every core feature
* Optional color styling and GitHub integration

**Next:** You can build layout scaffolds and explore/leaderboard views as a layer on top of this foundation.
