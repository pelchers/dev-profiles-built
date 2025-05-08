# 🚀 Dev Profiles - Quick Setup Commands

This document provides all the essential commands needed to set up the Dev Profiles project from scratch and get a working application.

## 1️⃣ Initialize Project and Install Dependencies

```bash
# Initialize Vite with React TypeScript template
npm create vite@latest . -- --template react-ts
npm install

# Install Frontend Dependencies
npm install react-router-dom @types/react-router-dom
npm install framer-motion @types/framer-motion
npm install -D tailwindcss postcss autoprefixer

# Install Backend Dependencies
npm install express cors dotenv
npm install -D @types/express @types/cors nodemon concurrently

# Initialize Tailwind
npx tailwindcss init -p
```

## 2️⃣ Create Base Folder Structure

```bash
# Create Client Directories
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

# Create Server Directories
mkdir -p server/flows/users
mkdir -p server/flows/projects
mkdir -p server/flows/posts
mkdir -p server/flows/messages
mkdir -p server/flows/tags
mkdir -p server/common/types

# Create Supporting Directories
mkdir -p prisma
mkdir -p json/flows
mkdir -p media/images
mkdir -p media/videos
mkdir -p media/documents
```

## 3️⃣ Move Vite Files to Client Directory

```bash
# Move default Vite files to client folder
mv src client/ 2>$null
mv public client/ 2>$null
mv index.html client/ 2>$null
```

## 4️⃣ Create Configuration Files

```bash
# Create .env file
echo 'PORT=3000
VITE_API_URL=http://localhost:3000
USE_JSON_DB=false' > .env

# Create Express server
echo 'const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../dist")));

// Future API routes go here

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});' > server/server.js

# Update package.json scripts
npx json -I -f package.json -e 'this.scripts = { 
  "dev:frontend": "vite", 
  "dev:backend": "nodemon server/server.js", 
  "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"", 
  "build": "tsc && vite build", 
  "preview": "vite preview",
  "start": "npm run build && node server/server.js"
}'
```

## 5️⃣ Create Essential Frontend Files

```bash
# Create Tailwind CSS entry point
echo '@tailwind base;
@tailwind components;
@tailwind utilities;' > client/src/index.css

# Create tailwind.config.ts
echo 'import type { Config } from "tailwindcss";

export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;' > tailwind.config.ts

# Create vite.config.ts
echo 'import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "./client",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
});' > vite.config.ts
```

## 6️⃣ Create Basic Components and Pages

```bash
# Create App.tsx
echo 'import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;' > client/src/App.tsx

# Create main.tsx
echo 'import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);' > client/src/main.tsx

# Create Home.tsx
echo 'import React from "react";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-indigo-600">Welcome to Dev Profiles</h1>
      <p className="mt-4 text-xl text-gray-600">A platform for developers and companies to connect</p>
    </div>
  );
};

export default Home;' > client/src/pages/Home.tsx

# Create Navbar.tsx
echo 'import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">DevProfiles</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-indigo-200">Home</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;' > client/src/components/Navbar.tsx

# Create Footer.tsx
echo 'import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-6">
      <div className="container mx-auto">
        <p className="text-center">© {new Date().getFullYear()} Dev Profiles. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;' > client/src/components/Footer.tsx
```

## 7️⃣ Start Development Server

```bash
# Start development server (both frontend and backend)
npm run dev
```

## 🔄 GitHub Repository Setup

```bash
# Initialize git repository
git init

# Add remote and set up main branch
git remote add origin https://github.com/pelchers/dev-profiles-built.git
git checkout -b main

# Add files and make initial commit
git add .
git commit -m "Initial project setup"

# Push to GitHub
git push -u origin main
```
