# 🧠 Cursor IDE – Initial Chat Instructions

Welcome Cursor. Before any completions, please read and interpret the following instructions and project references so we’re aligned in how we’re going to develop this project.

---

## ✅ Primary Task

You are expected to assist with developing a **full-stack single-server social networking platform for developers and companies** using:

* **Node.js + Express** backend
* **Vite + React + TypeScript + TailwindCSS** frontend
* **PostgreSQL via Prisma ORM**, but optional JSON data mode for dev/local/fallback
* All code structured in a **flows-based modular pattern**, across both `/client` and `/server`
* All conventions governed by AI reference files inside `/ai-docs` and `/app-docs`

Your job is to:

1. Read all reference files listed below
2. Comply with Cursor Composer conventions during all code generation
3. Maintain structure and naming standards outlined in our style and schema guides
4. Confirm you are fully prepared before scaffolding anything

---

## 📁 Reference Files to Read Before Responding

### 🔹 **Source of Truth (Start Here)**

* `/ai-docs/master-project-guide.md`
* `/ai-docs/master-guide-clarification-notes.md`

> These define the **full stack architecture**, API logic, frontend-backend interaction, database schema, fetch flow, and modular code organization.

### 🔹 **Styling & Layout Conventions**

* `/ai-docs/base-pages-components-guide.md`
* `/ai-docs/site-styles-guide-poppy-roygb.md`

> These establish TailwindCSS-based styling, responsive layout rules, color/font systems (including 60/30/10 rule), and component organization by feature flows.

### 🔹 **Cursor-Specific Behavior**

* `/ai-docs/composer-conventions.md`
* `/ai-docs/cursor-rules.md`

> These dictate how Cursor behaves: file creation format, expected autocomplete, code tracing inside flows, and where to place logic.

### 🔹 **Platform Purpose & Audience**

* `/ai-docs/project-scope.md`

> Describes the platform’s target audience (developers and companies), business goals, purpose (GitHub integration, profile customization, social actions), and end-user flow.

### 🔹 **Schema & Data Modeling**

* `/ai-docs/prisma-schema-guide.md`
* `/ai-docs/prisma-schema-template.md`

> These define the data shape, field behavior, optionality conventions, and relational logic. Refer to them when modeling or updating Prisma schemas.

---

## 🧭 Required Understanding Before Proceeding

Once you have read the above files:

You must understand our expected:

* **Monorepo structure** (with clear `/client`, `/server`, `/prisma` split)
* **API conventions** (REST endpoints per flow, controller/route separation)
* **Typescript type sharing** between frontend and backend (`/types` folder usage)
* **Tailwind utility-first styling** with color-driven interactions
* **Component grouping by domain feature** (e.g., `profiles/`, `posts/`, `projects/`, etc.)
* **Optional features** (GitHub API, color-coded tag system, message inbox, JSON fallback mode)

You must also know how to:

* Use `fetch()` inside custom React hooks
* Write modular route/controller/service files
* Use Prisma OR a local JSON fallback layer
* Follow Cursor Composer code flow and structure rules

Once confirmed, respond only with:

```txt
✅ All reference files loaded. I understand the conventions, style, structure, and purpose. Ready to scaffold the boilerplate structure.
```

Do **not** scaffold or create any files until this line is shown.

---

# ✅ End of Cursor IDE Initialization Instructions
