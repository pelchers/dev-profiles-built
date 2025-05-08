# 📚 **Comment Organization - Moderated Version**

---

# 🧐 Full Project Context

You are building a **moderated comment system** for a Vite + React + Tailwind + Express project. Comments:
- Are **saved to JSON files** (instead of a database)
- Have a **moderation status**: `pending`, `approved`, or `rejected`
- Can be **Auto-Approved** (published instantly) or **Manual-Moderated** (admin must approve first)

✅ Moderation flow fits cleanly into your project's existing folder and flow structure.

---

# 📂️ Folder and File Organization

| Location | Purpose |
|:---------|:--------|
| `/json/flows/comments/pages/[pageName].json` | **Approved comments** (publicly visible) |
| `/json/flows/comments/pending/[pageName].json` | **Pending comments** (awaiting admin approval) |
| `/json/flows/comments/rejected/[pageName].json` | **Rejected comments** (optional archive) |

✅ **Clear separation** of comment status at the file system level.

---

# 🛋️ Auto vs Manual Moderation Mode

You must set a configuration flag:

```ts
MANUAL_MODERATION_ENABLED = true; // or false
```

| Mode | Behavior |
|:-----|:---------|
| Auto Mode (`false`) | Comments go straight to `approved` and saved into `/pages/`. |
| Manual Mode (`true`) | Comments saved into `/pending/` until admin approves or rejects. |

✅ **Flexible deployment** — change moderation behavior without changing frontend logic.

---

# 📝 Comment Object Structure (Moderated)

```json
{
  "commentId": "uuid-123",
  "pageName": "services",
  "fullName": "John Doe",
  "userId": "optional-user-uuid",
  "topic": "Feedback",
  "commentText": "Loved your services!",
  "createdAt": "2025-04-28T20:00:00Z",
  "status": "pending" // "pending", "approved", or "rejected"
}
```

✅ Always include a `status` field, even inside `/pages/` files.
✅ Status field allows you to add future features like "needs review" or "flagged."

---

# 📚 Submission Flow Based on Mode

| Phase | Auto Mode (Instant Approve) | Manual Mode (Needs Approval) |
|:------|:----------------------------|:-----------------------------|
| 1. User submits form | Comment created with status `approved` | Comment created with status `pending` |
| 2. Server decides file destination | `/pages/` directly | `/pending/` until reviewed |
| 3. Admin involvement | None | Admin must approve/reject manually |

✅ Frontend code does **not** need to change between modes.

---

# 🛠️ Backend Routing Adjustments

| Route | Purpose |
|:------|:--------|
| `POST /api/comments/submit` | Submit comment (server decides `pending` vs `approved`) |
| `GET /api/comments/pages/:pageName` | Fetch approved comments only |
| `GET /api/comments/pending/:pageName` | Fetch pending comments (admin only) |
| `POST /api/comments/approve/:commentId` | Approve a pending comment |
| `POST /api/comments/reject/:commentId` | Reject/delete a pending comment |

✅ API is clean and supports both Auto and Manual flows.

---

# 🔄 JSON File Storage Details

| Folder | Behavior |
|:-------|:---------|
| `/pages/` | Only approved comments |
| `/pending/` | Awaiting admin approval |
| `/rejected/` (optional) | Archive rejected comments |

- When a comment is **approved**, it is **moved** from `/pending/` to `/pages/`.
- When a comment is **rejected**, it can either be **deleted** or **moved** to `/rejected/`.

✅ Very lightweight, clean file handling.

---

# 👨‍💻 Admin Interface Needs

| Feature | Purpose |
|:--------|:--------|
| View Pending Comments | Admin sees all unapproved comments. |
| Approve | Move comment to `/pages/`, update `status: approved`. |
| Reject | Delete or move comment to `/rejected/`. |

✅ Separate frontend AdminModerationPage.tsx will handle this (covered in admin flow file).

---

# 📈 Summary Table

| Area | Auto Mode | Manual Mode |
|:-----|:----------|:------------|
| Approval Required? | No | Yes |
| File Path on Submit | `/pages/` | `/pending/` |
| Status Set On Submit | `approved` | `pending` |
| Admin Action Needed | No | Yes (approve/reject) |

✅ Supports both fast-flow and safe-moderation environments.

---

# 🖋️ Final Notes

- Moderation is fully built into **file organization**, **object structure**, and **API routing**.
- Can be expanded later with pagination, moderation logs, email notifications, etc.
- No database required. Super fast. Human-readable JSON structure.

✅ Full context, clean setup, maximum scalability.

---

# 📢 Next Up

I will now prepare the second new file:
- **admin-comments-flow-moderated.md** (fully detailed, full context).

(Posting shortly! 🚀)

