# 📚 Base Pages and Components Setup – Dev Profiles Platform

---

# 📝 Overview

This guide outlines:

* Base setup for **pages** and **components**
* Fully mobile-first, responsive layout structure
* Clean, scalable Vite + React + Tailwind implementation
* Design conventions using the **60/30/10 visual rule**
* Component grouping by feature: profiles, posts, projects, messages

✅ Modular, scalable foundation for any full-stack social dev app.

---

# 📁 Pages Included

| Page            | Purpose                                            |
| --------------- | -------------------------------------------------- |
| Home.tsx        | Landing and onboarding page                        |
| Profile.tsx     | View user profile (dev or company)                 |
| EditProfile.tsx | Full editable profile form                         |
| Project.tsx     | Display user project(s)                            |
| Explore.tsx     | Tag-based, stack-based or interest-based discovery |
| Company.tsx     | View company profiles                              |
| PostDetail.tsx  | View a post and interactions                       |
| Messages.tsx    | Direct message inbox                               |

✅ Structured to support both social exploration and individual presentation.

---

# 📁 Components Included

| Component Folder | Subcomponents                   | Purpose                        |
| ---------------- | ------------------------------- | ------------------------------ |
| `/profiles`      | DevProfileCard, EditForm        | View and update profile        |
| `/projects`      | ProjectCard, ProjectForm        | View/create/edit user projects |
| `/posts`         | PostCard, PostForm, LikeButton  | Feed-style posts with likes    |
| `/messages`      | MessageList, MessageForm        | Conversation UI                |
| `/common`        | Navbar, Footer, Button, Section | Shared layout and UI helpers   |

✅ Reusable and styled with Tailwind CSS utility-first patterns.

---

# 🔄 Mobile-Responsive Layout Rules

| Property      | Rule                                               |
| ------------- | -------------------------------------------------- |
| Content Width | Full width with `max-w-screen-lg` center alignment |
| Padding       | `p-4` on mobile, `p-8`+ on md/lg                   |
| Typography    | Responsive `text-lg`, `text-xl`, `text-4xl`, etc.  |
| Grid System   | `grid-cols-1` on mobile, 2–3 cols on md/lg screens |

✅ Clean, content-forward layout at all breakpoints.

---

# 🎨 Base Styling – 60/30/10 Design Rules

## 1. Color Palette

| %   | Color Type                       | Example                                    |
| --- | -------------------------------- | ------------------------------------------ |
| 60% | Neutrals (white/black/gray)      | `#F9FAFB`, `#111827`, Tailwind slate/gray  |
| 30% | Primary Brand Colors (3 max)     | Indigo, Cyan, Emerald (e.g., `indigo-600`) |
| 10% | Secondary Accent (alert/special) | Rose, Yellow, Lime, Red (e.g., `rose-500`) |

✅ Balanced color use across background, elements, accents.

---

## 2. Font Families

| %   | Font Type           | Purpose                                      |
| --- | ------------------- | -------------------------------------------- |
| 60% | System/Legible Font | Body text – e.g., `Inter`, `Sans`, `UI`      |
| 30% | Display/Brand Font  | Headings – e.g., `Poppins`, `Oswald`         |
| 10% | Decorative          | Accent/hero areas – e.g., `Lora`, `Playfair` |

✅ Visual hierarchy + personality, without clutter.

---

## 3. Other Style Considerations

| %   | Style Rule             | Example                                            |
| --- | ---------------------- | -------------------------------------------------- |
| 60% | Minimal elevation      | Border, shadow-sm, no heavy glow                   |
| 30% | Accent action emphasis | Buttons, interactive hover highlights              |
| 10% | Transitional dynamics  | Hover animations, responsive flex/grid transitions |

✅ Soft modern polish, ideal for professional UX.

---

# 💌 Page Layout Example – `Profile.tsx`

```tsx
function Profile({ user }) {
  return (
    <div className="max-w-screen-lg mx-auto w-full p-4 md:p-8">
      <section className="space-y-6">
        <h1 className="text-3xl md:text-5xl font-brand">{user.displayName}</h1>
        <p className="text-gray-600 text-lg md:text-xl font-body">{user.bio}</p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Project or Tag Cards */}
      </section>
    </div>
  );
}
```

✅ Responsive, mobile-first, readable layout.

---

# 💌 Navbar Example – `Navbar.tsx`

```tsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center p-4 md:p-6 bg-white shadow-sm">
      <div className="font-brand text-2xl">DevProfiles</div>
      <div className="space-x-4 text-sm md:text-base">
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/messages">Messages</Link>
      </div>
    </nav>
  );
}

export default Navbar;
```

✅ Standard top nav with mobile scaling.

---

# 💌 Footer Example – `Footer.tsx`

```tsx
function Footer() {
  return (
    <footer className="w-full text-center py-6 text-gray-400 text-xs">
      © 2024 DevProfiles. All rights reserved.
    </footer>
  );
}

export default Footer;
```

✅ Clean, accessible site footer.

---

# ✨ Conclusion

| Area        | Setup                                                  |
| ----------- | ------------------------------------------------------ |
| Layout      | Responsive padding, grid, mobile-first                 |
| Style Rules | 60/30/10 for color, fonts, and layout                  |
| Components  | Grouped by feature flow (profile, post, project, etc.) |
| Routing     | Managed via React Router for page-based views          |
| Base UI     | Navbar, Footer, Section, Card, Button reused app-wide  |

✅ Foundation supports all key UI paths, ready to scale.

---

# 💬 What's Next?

Would you like full example layouts for Explore, Project, or Post pages next?
