# 🌈 Poppy ROYGB Neon Style – Full Site Styling Conventions

---

# 📚 Overview

The **Poppy ROYGB Neon Style** is designed to be:

* Visually exciting, playful, and modern
* Tag-highlight friendly for both **light and dark modes**
* Neon-inspired and developer-friendly
* Ideal for platforms involving tagging, creativity, community

✅ Perfect for sites with interactive content, creative portfolios, or vibrant dev profiles.

---

# 🎨 Color System

| Purpose           | Color Example                        | Notes                                           |
| ----------------- | ------------------------------------ | ----------------------------------------------- |
| Background        | `#0F0F0F` (dark) / `#FFFFFF` (light) | Core contrast base                              |
| Red               | `#FF4C4C`                            | Used for errors, urgent tags, highlights        |
| Orange            | `#FFA500`                            | Alerts, warm CTAs, hover states                 |
| Yellow            | `#F9FF33`                            | Light-burst highlights, attention-grab CTAs     |
| Green             | `#00FF94`                            | Success states, clean success-oriented features |
| Blue              | `#00CFFF`                            | System/UI accent, cooler tone for balance       |
| Indigo/Purple     | `#C54FFF`                            | Expressive personality, tag backgrounds         |
| White Neon        | `#E0E0E0`                            | Borders, muted text, hover transitions          |
| Blacklight Accent | `#0F0F0F` + glow border              | Deep contrast framing                           |

✅ Easily supports dark/light mode toggles and tag highlight features.

---

# 🔤 Fonts

| Font Type    | Font Example                    | Usage                           |
| ------------ | ------------------------------- | ------------------------------- |
| Body Font    | `"Inter"`, `"Rubik"`            | Friendly, round, readable       |
| Heading Font | `"Space Grotesk"`, `"Rajdhani"` | Futuristic, bold headings       |
| Accent Font  | `"VT323"`, `"Orbitron"`         | Creative, digital-style accents |

✅ Pairs well with tech-inspired, youth-forward, developer themes.

---

# 📐 Layout and Spacing

| Element         | Convention                                                  |
| --------------- | ----------------------------------------------------------- |
| Section Padding | `px-2 md:px-4 lg:px-8` (minimal to allow edge-to-edge feel) |
| Content Width   | `max-w-6xl mx-auto`                                         |
| Grid Gaps       | `gap-8`, `gap-12`                                           |
| Border Radius   | `rounded-full` for buttons/tags, `rounded-lg` for cards     |
| Shadow          | `shadow-md`, `shadow-neon`                                  |

✅ Layouts feel lively, open, responsive — with tight screen usage for modern flair.

---

# 🖼️ Buttons

| Property      | Convention                                              |
| ------------- | ------------------------------------------------------- |
| Background    | Any ROYGB neon w/ gradient support                      |
| Text Color    | Black on light, White on dark                           |
| Hover Effect  | Slight grow + soft push-in (scale-105, translate-y-0.5) |
| Click Effect  | Full push-in (scale-95, translate-y-1)                  |
| Border Radius | `rounded-full`                                          |
| Size          | `py-2 px-6`, `text-sm md:text-base`                     |

Example:

```tsx
<button className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-400 text-black py-2 px-6 rounded-full hover:scale-105 hover:translate-y-0.5 active:scale-95 active:translate-y-1 transition-all duration-200">
  Tag It
</button>
```

✅ Interactive, expressive, with satisfying hover/click feedback and full-rounded shape.

---

# 💫 Cards and Tag Blocks

* **Card BG**: `bg-black/90` on dark mode, `bg-white/95` on light
* **Border**: `border-blue-400` or `border-gradient-neon`
* **Shadow**: `shadow-lg hover:shadow-neon`
* **Rounded Corners**: `rounded-lg`
* **Tag Style**: `inline-block px-3 py-1 text-sm font-medium rounded-full bg-indigo-400 text-white`
* **Hover**: Slight brightness increase, `hover:brightness-110`

Example:

```tsx
<span className="bg-green-400 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
  DevOps
</span>
```

✅ Adds playfulness while maintaining clarity and compactness.

---

# 🔄 Animations & Interactions

| Element     | Interaction                               |
| ----------- | ----------------------------------------- |
| Hover/Focus | Shadow pulse, color shift                 |
| Page Load   | Fade-in from `opacity-0`, `translate-y-4` |
| Buttons     | Grow on hover, push-in on click           |
| Tags        | Light background pulse or color flicker   |

Example:

```tsx
motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
```

✅ Adds a sense of **delight and responsiveness**.

---

# 🏷️ Tag Color Utility Rules

| Tag Type   | Suggested Color |
| ---------- | --------------- |
| `frontend` | `bg-indigo-400` |
| `backend`  | `bg-blue-400`   |
| `database` | `bg-green-400`  |
| `devops`   | `bg-yellow-300` |
| `testing`  | `bg-pink-400`   |
| `design`   | `bg-red-400`    |

✅ Pill-style, rounded full tags with solid backgrounds.

---

# ✍️ Style Composition – 60/30/10 Visual Rule

| Ratio | What It Applies To                       | Example                   |
| ----- | ---------------------------------------- | ------------------------- |
| 60%   | Base contrast & neutral surfaces         | Backgrounds, containers   |
| 30%   | Primary color pops (neon hues)           | Tags, buttons, headlines  |
| 10%   | Unique character (glow, animation, text) | Tag outlines, hover glows |

✅ Consistent color and accent discipline across the site.

---

# 📋 Component Naming Convention

| Component       | Example               |
| --------------- | --------------------- |
| Tag Badge       | `NeonTag.tsx`         |
| Section Wrapper | `NeonSection.tsx`     |
| Post Card       | `NeonPostCard.tsx`    |
| Profile Block   | `NeonProfileCard.tsx` |

✅ Keeps styling encapsulated, themed, and easy to evolve.

---

# ✅ Finished: Poppy ROYGB Neon Site Style Guide

Use this system to inject vibrant personality and tactile delight into your tagging, post-driven, or creative developer platform — optimized for both light and dark mode, and enriched with interactive button feedback, pill-shaped tag visuals, and minimal-padded edge-to-edge grid layouts.
