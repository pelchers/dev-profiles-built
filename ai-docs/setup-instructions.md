# 🛠️ Dev Profiles Platform – Final Project Setup Guide

This is your full start-to-finish setup guide for the Dev Profiles platform. It covers everything from a blank root directory to a fully initialized monorepo layout with frontend, backend, Prisma schema support, and foundational pages.

---

## ✅ Project Stack

* Vite + React + TypeScript + TailwindCSS (frontend)
* Node.js + Express (backend)
* PostgreSQL + Prisma ORM (optional, toggled by env)
* Flows-based modular file structure (both client and server)
* Cursor IDE and AI reference–driven conventions

---

## 🧾 1. Initialize Project in Current Root Folder

```bash
npm create vite@latest . -- --template react-ts
npm install
```

---

## 📦 2. Install Dependencies

```bash
# Frontend
npm install react-router-dom @types/react-router-dom
npm install framer-motion @types/framer-motion
npm install -D tailwindcss postcss autoprefixer

# Backend
npm install express cors dotenv
npm install -D @types/express @types/cors nodemon concurrently
```

---

## 🎨 3. Initialize Tailwind

```bash
npx tailwindcss init -p
```

---

## 🗂️ 4. Create Full File Tree

```bash
# CLIENT SIDE
mkdir -p client/public
mkdir -p client/src/components/flows/profiles
mkdir -p client/src/components/flows/projects
mkdir -p client/src/components/flows/posts
mkdir -p client/src/components/flows/messages
mkdir -p client/src/components/common
mkdir -p client/src/components/layout
mkdir -p client/src/utils
mkdir -p client/src/pages
mkdir -p client/src/types

# SERVER SIDE
mkdir -p server/flows/users
mkdir -p server/flows/projects
mkdir -p server/flows/posts
mkdir -p server/flows/messages
mkdir -p server/flows/tags
mkdir -p server/common/types

# SHARED STRUCTURE
mkdir -p prisma
mkdir -p json/flows
mkdir -p media/images
mkdir -p media/videos
mkdir -p media/documents
mkdir -p app-docs/chats
```

---

## 🔄 5. Move and Clean Vite Files into `client`

```bash
mv src client/
mv public client/
mv index.html client/
```

---

## ⚙️ 6. Root Config Files

📄 `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

export default {
  content: [
    './client/index.html',
    './client/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
```

📄 `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: './client',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
    },
  },
});
```

📄 `package.json` updates

```json
{
  "scripts": {
    "dev:frontend": "vite",
    "dev:backend": "nodemon server/server.js",
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "build": "tsc && vite build",
    "start": "npm run build && node server/server.js"
  }
}
```

---

## 🌐 7. Base Express Server

📄 `server/server.js`

```js
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Future API routes will go here

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

---

## 📁 8. Environment Files

📄 `.env`

```env
PORT=3000
VITE_API_URL=http://localhost:3000
USE_JSON_DB=false
```

📄 `env-reference.md`

```md
# Environment Variables
- PORT: Express server port
- VITE_API_URL: Frontend fetch target
- USE_JSON_DB: If true, fallback to static JSON files instead of Postgres
```

---

## 🎨 9. Tailwind CSS Directives

📄 `client/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📄 10. Base Pages

📄 `client/src/pages/Home.tsx`

```tsx
const Home = () => (
  <section className="space-y-6">
    <h1 className="text-4xl font-bold text-indigo-500">Welcome to Dev Profiles</h1>
    <p className="text-lg text-gray-600">Build, share, and connect with developers and companies.</p>
  </section>
);

export default Home;
```

📄 `client/src/pages/About.tsx`

```tsx
const About = () => (
  <section className="space-y-6">
    <h1 className="text-4xl font-bold text-indigo-500">About Dev Profiles</h1>
    <p className="text-lg text-gray-600">Dev Profiles is a modular platform built for developers and companies to share, connect, and explore work and tech stacks.</p>
  </section>
);

export default About;
```

---

## 📄 11. Layout and Wrappers

📄 `client/src/components/layout/MainLayout.tsx`

```tsx
import React, { FC, ReactNode, useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import ScaleWrapper from './ScaleWrapper';
import { isFeatureEnabled } from '../../utils/featureToggles';
import { getComputedScale } from '../../utils/featureConfig';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <div style={{ height: `${100 / getComputedScale(screenWidth)}vh`, minHeight: '100vh' }}>
        <ScaleWrapper>
          {children}
        </ScaleWrapper>
      </div>
      {isFeatureEnabled('showTestPanel') && (
        <div className="fixed bottom-3 right-3 bg-white p-2 rounded shadow-lg border text-xs">
          <div>Scale: {getComputedScale(screenWidth).toFixed(2)}x</div>
          <div>Screen: {screenWidth}px</div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
```

📄 `client/src/components/layout/ScaleWrapper.tsx`

```tsx
import { FC, ReactNode, useEffect, useState } from 'react';
import { getScaledStyles } from '../../utils/featureConfig';

interface ScaleWrapperProps {
  children: ReactNode;
}

const ScaleWrapper: FC<ScaleWrapperProps> = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ ...getScaledStyles(screenWidth), minHeight: '100%', overflow: 'hidden' }}>
      {children}
    </div>
  );
};

export default ScaleWrapper;
```

📄 `client/src/utils/featureConfig.ts`

```ts
interface ScalingConfiguration {
  global: {
    enabled: boolean;
    scale: number;
  };
  mobile: {
    enabled: boolean;
    scale: number;
    breakpoint: number;
    scaleUpContent: boolean;
  };
}

export const scalingConfig: ScalingConfiguration = {
  global: { enabled: false, scale: 0.75 },
  mobile: { enabled: false, scale: 1, breakpoint: 768, scaleUpContent: false },
};

export const getComputedScale = (screenWidth: number): number => {
  const { global, mobile } = scalingConfig;
  if (global.enabled) return global.scale;
  if (mobile.enabled && screenWidth <= mobile.breakpoint) return mobile.scale;
  return 1;
};

export const getScaledStyles = (screenWidth: number) => {
  const scale = getComputedScale(screenWidth);
  return {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: `${100 / scale}%`,
    height: 'auto',
  };
};
```

---

📄 `client/src/App.tsx`

```tsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import About from './pages/About';

const App = () => (
  <MainLayout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </MainLayout>
);

export default App;
```

📄 `client/src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

---

✅ Your project is now initialized with:

* Express + Vite working together
* Tailwind and routing configured
* MainLayout with scaling wrapper and test panel toggle
* Ready to expand with flows, routes, and full-stack logic
