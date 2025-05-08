# 🏗️ Project Scope – Developer Profiles + Company Connect App

---

## 🔖 Project Identity

| Element           | Description                                            |
| ----------------- | ------------------------------------------------------ |
| **Project Name**  | Dev Profiles + Company Connect                         |
| **Industry**      | Web Development, Developer Tools, Networking Platforms |
| **Business Type** | B2B + B2C SaaS                                         |
| **Scope**         | Multi-user networking platform for devs + orgs         |

---

## 🧭 Platform Purpose

| Purpose Category                | Details                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------- |
| **Primary Purpose**             | Help developers create, showcase, and connect through in-depth profiles and project work    |
| **Secondary Purpose**           | Provide a place for companies to connect with devs and discover talent or collaborators     |
| **Content Focus**               | Developer experience, GitHub data, tech stacks, projects, and social connection features    |
| **Expected Actions from Users** | Sign up, edit profile, post projects, follow others, like posts, explore devs and companies |

---

## 🎯 Business Goals

| Goal                                                      | Target Outcome |
| --------------------------------------------------------- | -------------- |
| Build a centralized space for developers to showcase work |                |
| Enable connections between devs and companies             |                |
| Support discoverability via tags, tech stacks, and posts  |                |
| Keep the platform deploy-safe, flat, and scalable         |                |

---

## 🧩 Application Requirements

| Area                 | Requirement                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| **Frontend**         | Vite + React + TypeScript + Tailwind CSS + React Router                                        |
| **Backend**          | Express + Prisma + PostgreSQL                                                                  |
| **Pages**            | Home, Profile (dev & company), Project, Explore, Edit Profile                                  |
| **API Flows**        | Profile CRUD, Project CRUD, Like, Watch, Messaging, Tag Color, GitHub pull                     |
| **Schema Structure** | Flat, relational schema with JSON arrays where appropriate; all fields optional where possible |
| **Search/Explore**   | Users can explore by tag, role, stack, company, or interest                                    |
| **Hosting**          | Deploy to Render as separate client/server or monorepo                                         |

---

## 👤 Target Audience

| Attribute                  | Description                                                                     |
| -------------------------- | ------------------------------------------------------------------------------- |
| **User Types**             | Developers, Companies                                                           |
| **Developer Focus**        | Full stack, frontend, backend, AI, testing, infra, database, etc.               |
| **Company Focus**          | Startups, hiring orgs, software teams                                           |
| **Behavioral Expectation** | Contribute profile, link GitHub, explore others, use lightweight social actions |

---

## 🔄 Platform Features & Behaviors

| Area             | Details                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| **Profiles**     | Fully editable profiles, conditional fields per type (dev or company), image upload, GitHub     |
| **Projects**     | Tags, contributors, type, stack, timeline, deployment info, company context                     |
| **Posts**        | Text, link, image, tagged users, tags, likes (with Like table)                                  |
| **Connections**  | Users can follow others (store user IDs in flat array)                                          |
| **Messaging**    | Simple direct messages between users with read status                                           |
| **Watches**      | Users can watch (follow) projects                                                               |
| **Color System** | Optional keyword and tag highlighting powered by a flat utility and optional DB sync (TagColor) |

---

## 🧠 Behavioral Design Notes

| Feature                     | Trigger / Reasoning                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------- |
| Tag-based explore           | Encourages discovery through skills, interest, and community-wide taxonomies        |
| Profile-first design        | All users are profile-centric to ensure identity and contribution clarity           |
| Flat + optional schema      | Simplifies seeding, querying, and updating via Prisma without constraint collisions |
| GitHub integration optional | Allows full functionality even without a GitHub-linked profile                      |
| Like/Watch separation       | Enables both micro and macro engagement (e.g., 'like a post' vs 'watch a project')  |

---

## 🧱 Optional Add-ons (Future Growth)

| Feature              | Use Case                                                 |
| -------------------- | -------------------------------------------------------- |
| Activity Feed        | Show recent likes, follows, posts, or project activity   |
| Role-based filtering | View only frontend devs, backend AI engineers, etc.      |
| Public explore map   | Visualization of developers and companies across regions |
| Admin color editor   | Set tag color mappings from dashboard instead of file    |

---

## ✅ Summary Checklist for Dev Profiles Platform

✅ Pages: Home, Profile, Edit Profile, Project, Explore
✅ Flows: Profile, Project, Messaging, Follow, Like, Watch
✅ Schema: Optional fields, relational core, flat structure, JSON usage where scalable
✅ GitHub integration & color coding system supported (optional per page)
✅ Architecture: Vite + React frontend, Express + Prisma backend, PostgreSQL database
✅ Mobile-first and incrementally deployable
✅ Color system can be applied optionally to any section (bio, tags, posts) without setup overhead
