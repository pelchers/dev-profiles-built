# 🌈 Arcade Neon Style – Base Site Styling Conventions

---

# 📚 Overview

The **Arcade Neon Style** is designed to be:

* Clean and minimalist with arcade-inspired accents
* Focused on neon glow effects and satisfying interactions
* Highly readable with careful color contrast
* Perfect for developer profiles and portfolios

✅ Combines modern minimalism with playful arcade elements

---

# 🎨 Color System

| Purpose           | Color Code  | Usage                                           |
| ----------------- | ----------- | ----------------------------------------------- |
| Background Light  | `#FAFAFA`   | Card backgrounds, light mode base               |
| Background Dark   | `#0F0F0F`   | Dark mode base                                 |
| Arcade Green      | `#00FF5F`   | Primary buttons, borders, success states       |
| Arcade Blue       | `#00CFFF`   | Shadows, accents, interactive elements         |
| Neon Red          | `#FF4C4C`   | Error states, warning indicators               |
| Neon Orange       | `#FFA500`   | Secondary accents, special states              |
| Neon Yellow       | `#F9FF33`   | Highlights, special indicators                 |
| Text Primary      | `#000000`   | Main text on light backgrounds                 |
| Text Secondary    | `#FFFFFF`   | Text on dark or colored backgrounds            |

✅ Colors chosen for maximum readability with arcade flair

---

# 🔤 Typography

| Font Type    | Font Stack                                      | Usage                           |
| ------------ | ----------------------------------------------- | ------------------------------- |
| Brand Font   | `'Honk', 'Space Grotesk', 'Rajdhani', sans-serif` | Logo, headings                 |
| Body Font    | `'Inter', 'Rubik', sans-serif`                   | General text, UI elements      |
| Mono Font    | `'VT323', 'Orbitron', monospace`                 | Code blocks, technical text    |

✅ Font combinations balance arcade aesthetics with readability

---

# 🖼️ Component Styles

## Cards
```tsx
// Base Card Style
const cardStyles = `
  bg-[#FAFAFA] 
  border border-arcade-green 
  rounded-lg 
  shadow-[0_0_8px_#fff] 
  hover:shadow-[0_0_16px_2px_#fff] 
  transition-shadow duration-200 
  p-6
`;
```

## Buttons
```tsx
// Base Button Style
const buttonStyles = `
  bg-arcade-green text-black
  py-2 px-6
  rounded-full
  font-bold
  transition-all duration-150
  shadow-[0_4px_0_0_#00CFFF]
  hover:shadow-[0_6px_0_0_#00CFFF] hover:translate-y-[-2px]
  active:shadow-[0_2px_0_0_#00CFFF] active:translate-y-[2px]
  focus:outline-none focus:ring-2 focus:ring-arcade-blue focus:ring-opacity-50
`;
```

## Tags
```tsx
// Base Tag Style
const tagStyles = `
  px-3 py-1
  rounded-full
  text-sm font-medium
  transition-transform duration-150
  hover:animate-tag-grow
`;
```

---

# 🎯 Interactive Elements

## Shadows & Effects
| Effect Type      | CSS Class                                          | Usage                    |
| --------------- | -------------------------------------------------- | ------------------------ |
| Card Shadow     | `shadow-[0_0_8px_#fff]`                            | Default card state       |
| Hover Glow      | `hover:shadow-[0_0_16px_2px_#fff]`                | Card hover state         |
| Button Shadow   | `shadow-[0_4px_0_0_#00CFFF]`                      | Button depth effect      |
| Button Hover    | `shadow-[0_6px_0_0_#00CFFF] translate-y-[-2px]`   | Button hover state       |
| Button Active   | `shadow-[0_2px_0_0_#00CFFF] translate-y-[2px]`    | Button press state       |

## Animations
```css
@keyframes growShrink {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes tag-grow {
  50% { transform: scale(1.1); }
}
```

---

# 📐 Layout Conventions

| Element         | Base Classes                                               |
| -------------- | --------------------------------------------------------- |
| Page Container | `max-w-screen-xl mx-auto px-4 md:px-8`                    |
| Section        | `py-8 md:py-12`                                           |
| Card Grid      | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`   |
| Button Group   | `flex flex-wrap gap-4`                                    |

---

# 🎮 Component Naming Convention

| Component Type | Prefix    | Example               |
| ------------- | --------- | --------------------- |
| Layout        | None      | `Navbar.tsx`          |
| Common UI     | None      | `Button.tsx`          |
| Feature       | None      | `ProfileCard.tsx`     |
| Page          | None      | `HomePage.tsx`        |

✅ Keep it simple and descriptive without unnecessary prefixes

---

# 💫 Responsive Design

| Breakpoint | Screen Size | Major Changes                                |
| ---------- | ----------- | -------------------------------------------- |
| Default    | Mobile      | Single column, stacked navigation            |
| md         | 768px+      | Multi-column grids, horizontal navigation    |
| lg         | 1024px+     | Larger text, more spacing                    |

Always design mobile-first, then enhance for larger screens.

---

# ✅ Implementation Guidelines

1. Use white glow effects for cards instead of colored shadows for a cleaner look
2. Maintain consistent button interaction with push/depth effect
3. Apply animations sparingly - primarily for brand elements and user feedback
4. Keep text highly readable with appropriate contrast
5. Use arcade green for primary actions and arcade blue for depth/shadows
6. Implement hover states that enhance rather than change the base design
7. Ensure all interactive elements have clear focus states for accessibility

These guidelines create a cohesive arcade-inspired interface while maintaining professional usability.