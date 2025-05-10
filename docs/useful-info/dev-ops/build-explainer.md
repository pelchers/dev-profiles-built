# 🏗️ Build Explainer: Static Assets, Public Folders, and Monorepo Best Practices

## 🚀 Basic Build & Run Commands

### 1. Start Local Development (Hot Reload)
```bash
npm run dev
```
- Runs both client and server in development mode with hot reload (using `concurrently`).
- Access the frontend at [http://localhost:5173](http://localhost:5173) (default Vite port).
- Server runs on its configured port (see `.env`).

### 2. Build for Production
```bash
npm run build
```
- Builds the frontend (Vite) and backend (if configured) for production.
- Frontend output goes to `client/dist/`.
- Backend output (if built) goes to `server/dist/` or as configured.

### 3. Preview Production Build Locally
```bash
npm run preview
```
- Serves the built frontend locally for testing the production build.
- Useful for catching issues before deploying.

### 4. Clean Build Outputs
```bash
npm run clean
```
- Removes previous build outputs (e.g., `client/dist/`, `server/dist/`).
- Use before a fresh build if you encounter strange build issues.

---

## 📦 Why We Use `client/public` (Not Root `public`)

- **Vite (and most modern frontend tools) only serve static assets from the `public` folder inside the frontend app directory.**
- In our project, that's:
  ```plaintext
  /client/public/
  ```
- **Root-level `/public` is ignored** by Vite and will not be included in the build or served to the browser.

---

## 🚦 How Vite Serves Assets

- All files in `/client/public` are copied as-is to the build output and are available at the root URL of your deployed site.
- Example: `/client/public/fonts/MyFont.woff2` is available at `https://yourdomain.com/fonts/MyFont.woff2`.
- **Do not put JavaScript, TypeScript, or sensitive files in `public`**—only static assets.

---

## 🗂️ Monorepo Asset Management Best Practices

| Location              | Purpose                                      |
|----------------------|----------------------------------------------|
| `/client/public/`    | Static assets for the frontend (Vite/React)  |
| `/server/`           | Server code and assets (not served directly) |
| `/shared/` (optional)| Shared code/assets (not served directly)     |
| `/` (root)           | Config, scripts, docs—not static assets      |

- **Each app (client, server, etc.) should have its own `public` or `static` folder.**
- This keeps assets modular and avoids confusion about which assets belong to which part of your stack.

---

## 📝 Configuration Notes

- **Accessing Files:**
  - Any file in `client/public` is available at the root of your site after build/deploy.
  - Example: `/client/public/images/logo.png` → `https://yourdomain.com/images/logo.png`
- **No Root Public:**
  - The root of your monorepo is for shared config, scripts, and documentation—not for serving static assets to the browser.
- **Multiple Frontends:**
  - If you add another frontend app (e.g., admin dashboard), it should have its own `public` folder.

---

## 📋 Summary Table

| Folder                | Used For                | Served By Vite? | Notes                                 |
|-----------------------|------------------------|-----------------|---------------------------------------|
| `/client/public/`     | Frontend static assets | ✅ Yes          | Use for fonts, images, icons, etc.    |
| `/public/` (root)     | (Should be empty)      | ❌ No           | Ignored by Vite, not served           |
| `/server/`            | Backend code/assets    | ❌ No           | Not served to browser                 |
| `/shared/` (optional) | Shared code/assets     | ❌ No           | For code sharing, not static serving  |

---

## 🔍 References
- [Vite Docs: The Public Directory](https://vitejs.dev/guide/assets.html#the-public-directory)
- [Monorepo Best Practices](https://monorepo.tools/)

---

**In summary:**
- Always put static assets for the frontend in `/client/public`.
- The root `/public` folder is ignored by Vite and should not be used.
- Organize assets by type (fonts, images, videos, etc.) inside `client/public` for clarity and maintainability. 