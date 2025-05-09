# 📚 Base Pages and Components Setup – Dev Profiles Platform

---

# 📝 Overview

This guide outlines:

* Minimalist base setup with arcade-inspired interactive elements
* Clean, responsive layouts with subtle neon accents
* Modern React + TypeScript + Tailwind implementation
* Consistent use of white glow effects and arcade green/blue accents
* Component organization focused on reusability and maintainability

✅ Professional foundation with playful arcade touches

---

# 📁 Pages Structure

| Page            | Purpose                                            | Key Style Elements                           |
| --------------- | -------------------------------------------------- | ------------------------------------------- |
| Home.tsx        | Landing page with centered content                 | Subtle grow/shrink animation (1.08 scale)    |
| Profile.tsx     | Developer profile view                             | Cards with white glow effects                |
| EditProfile.tsx | Profile editor                                     | Form elements with arcade-style feedback     |
| Project.tsx     | Project showcase                                   | Grid layout with hover animations            |
| Explore.tsx     | Discovery and search                               | Interactive cards with glow effects          |
| Messages.tsx    | Direct messaging                                   | Clean chat UI with arcade accents           |

✅ Each page maintains minimalist design with subtle arcade elements

---

# 📁 Core Components

## Common UI Components

```tsx
// Button.tsx - Primary interactive component
const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyles = `
    py-2 px-6
    rounded-full
    font-bold
    transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-arcade-blue focus:ring-opacity-50
  `;
  
  const variants = {
    primary: `
      bg-arcade-green text-black
      shadow-[0_4px_0_0_#00CFFF]
      hover:shadow-[0_6px_0_0_#00CFFF] hover:translate-y-[-2px]
      active:shadow-[0_2px_0_0_#00CFFF] active:translate-y-[2px]
    `,
    secondary: `
      bg-white text-black
      border-2 border-arcade-green
      shadow-[0_4px_0_0_#00CFFF]
      hover:shadow-[0_6px_0_0_#00CFFF] hover:translate-y-[-2px]
      active:shadow-[0_2px_0_0_#00CFFF] active:translate-y-[2px]
    `
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

// Card.tsx - Base card component with glow effect
const Card = ({ children, className = '', ...props }) => {
  const baseStyles = `
    bg-[#FAFAFA] 
    border border-arcade-green 
    rounded-lg 
    shadow-[0_0_8px_#fff] 
    hover:shadow-[0_0_16px_2px_#fff] 
    transition-shadow duration-200 
    p-6
  `;
  
  return (
    <div className={`${baseStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Tag.tsx - Interactive tag component
const Tag = ({ children, className = '', ...props }) => {
  const baseStyles = `
    px-3 py-1
    rounded-full
    text-sm font-medium
    transition-transform duration-150
    hover:animate-tag-grow
  `;
  
  return (
    <span className={`${baseStyles} ${className}`} {...props}>
      {children}
    </span>
  );
};

// Section.tsx - Page section wrapper
const Section = ({ children, className = '', ...props }) => {
  const baseStyles = `
    py-8 md:py-12
    w-full
  `;
  
  return (
    <section className={`${baseStyles} ${className}`} {...props}>
      {children}
    </section>
  );
};
```

## Layout Components

```tsx
// MainLayout.tsx - Base layout wrapper
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

// Navbar.tsx - Site navigation
const Navbar = () => {
  return (
    <nav className="sticky top-0 w-full bg-white border-b border-arcade-green">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden">
            {/* Hamburger menu */}
          </button>
          <Button variant="primary">Bounties</Button>
        </div>
        
        <h1 className="font-brand text-2xl">Dev Profiles</h1>
        
        <div className="flex items-center gap-4">
          <Button variant="primary">Explore</Button>
          <button className="w-8 h-8 rounded-full bg-arcade-green">
            {/* Profile icon */}
          </button>
        </div>
      </div>
    </nav>
  );
};
```

---

# 🎨 Base Styling Principles

## Colors and Effects

```tsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        arcade: {
          green: '#00FF5F',
          blue: '#00CFFF',
        },
      },
      keyframes: {
        growShrink: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        'tag-grow': {
          '50%': { transform: 'scale(1.1)' },
        },
      },
      animation: {
        growShrink: 'growShrink 2.2s infinite',
        'tag-grow': 'tag-grow 0.15s ease-in-out',
      },
    },
  },
};
```

## Typography

```css
/* Base text styles */
.text-brand {
  @apply font-brand text-3xl md:text-4xl;
}

.text-body {
  @apply font-body text-base text-black;
}

.text-mono {
  @apply font-mono text-sm;
}
```

---

# 📱 Example Page Implementation

## Home Page
```tsx
function HomePage() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center">
        <h1 className="font-brand text-4xl md:text-5xl mb-8 animate-growShrink">
          Welcome to Dev Profiles
        </h1>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="primary">
            Get Started
          </Button>
          <Button variant="secondary">
            Learn More
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
```

## Profile Page
```tsx
function ProfilePage() {
  return (
    <MainLayout>
      <Section>
        <h1 className="text-brand mb-8">
          Developer Profile
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            {/* Profile info */}
          </Card>
          
          <Card>
            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              <Tag>React</Tag>
              <Tag>TypeScript</Tag>
              <Tag>Node.js</Tag>
            </div>
          </Card>
          
          <Card>
            {/* Projects */}
          </Card>
        </div>
      </Section>
    </MainLayout>
  );
}
```

---

# ✅ Implementation Checklist

1. [ ] Set up MainLayout with Navbar
2. [ ] Implement core UI components (Button, Card, Tag, Section)
3. [ ] Configure Tailwind with custom colors and animations
4. [ ] Create responsive page layouts
5. [ ] Add interactive elements with proper hover/focus states
6. [ ] Test across all breakpoints
7. [ ] Ensure accessibility standards are met

These base components and layouts provide a clean, professional foundation while maintaining subtle arcade-inspired elements throughout the interface.
