# 📘 Prisma Schema Guide: Dev Profiles Platform

This guide explains the design and capabilities of the Prisma schema used in the `Dev Profiles` application.
It follows a philosophy of being **comprehensive yet compact**, offering powerful relational queries while keeping each model minimal and optional to support flexibility and deployability.

---

## 🔧 General Principles

### ✅ Optional Fields

All fields (except IDs and relation keys) are marked as optional (`?`). This ensures:

* Smooth deployments and migrations
* Minimal frontend validation errors
* Flexibility for users to fill out their profile over time

### ✅ Flat + Relational Design

* JSON is used for nested content (e.g., social links, tech stacks)
* Relational tables support advanced filtering (e.g., posts, likes, messages)
* No unnecessary junction tables unless required for querying or deduplication

---

## 👤 User Model

Represents both **developers** and **companies**.

* `type`: determines conditional fields (e.g., dev-only: `techStacks`; company-only: `openRoles`)
* `socialLinks`, `tags`, `preferences`, `roles`, `githubStats`: JSON/array-based for extensibility
* Relationships:

  * `projects`, `posts`: created by the user
  * `messagesSent` / `messagesReceived`: 1-on-1 chat system
  * `likes`: for post likes
  * `watches`: for following projects

---

## 📁 Project Model

A versatile structure used by both individuals and organizations to:

* Showcase work (`coverImage`, `description`, `livePreviewUrl`)
* Track development status (`status`, `featureStatus`, `infraDetails`)
* Group or tag content (`tags`, `stack`, `contributors`)
* Be followed (`Watch` relation)

Supports filters like:

* All public projects
* My own projects
* Watched (followed) projects

---

## 🧩 Post Model

Each user can post structured profile content:

* `title`, `description`, `mediaUrl`, `linkUrl`, `subtext`
* Tagged users (`taggedUsers`) or tech (`tags`)
* Supports likes via the `Like` model

---

## ❤️ Like Model

Tracks likes between users and posts.

* Enables "My Likes" pages
* Prevents duplicates with `@@unique([userId, postId])`
* Used for filtering: "posts I liked", "users who liked this post"

---

## 🔔 Watch Model

Tracks which users follow which projects.

* Enables "Watched Projects" pages
* Lightweight with user-project pair
* Optionally used to trigger notifications

---

## 💬 Message Model

1-on-1 messaging between users.

* Tracks `sender`, `recipient`, `content`, and read status
* Can support notifications, reply threading (future), or chat-style UIs

---

## 🎨 TagColor Model

Supports visual classification for tag/category coloring.

* Tags like `React`, `PostgreSQL`, `Docker` can be styled differently based on this table
* Used with frontend utilities to render color-coded tech stacks, posts, or profile text

---

## 🔄 Querying Highlights

### My Projects

```ts
await prisma.project.findMany({ where: { userId: currentUserId } });
```

### My Liked Posts

```ts
await prisma.like.findMany({
  where: { userId: currentUserId },
  include: { post: true },
});
```

### Posts Tagged with React

```ts
await prisma.post.findMany({
  where: {
    tags: { has: "React" },
  },
});
```

### Projects I'm Watching

```ts
await prisma.watch.findMany({
  where: { userId: currentUserId },
  include: { project: true },
});
```

---

This schema enables the platform to scale across:

* Developer portfolios
* Social content interactions
* Organization-managed projects
* Efficient likes, follows, and message delivery

All while remaining small enough to migrate, seed, and query rapidly in development or production.
