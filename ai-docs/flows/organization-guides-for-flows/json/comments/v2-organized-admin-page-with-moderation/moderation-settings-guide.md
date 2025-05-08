# 📚 Moderation Settings Guide (Auto vs Manual Comment Approval)

---

# 🧠 Purpose

This file defines **how to configure and manage moderation settings** for your comment system:
- Enable or disable **manual approval mode** easily.
- Show the correct **frontend user messages** based on mode.
- Ensure the server and client stay in sync.

✅ Centralized.
✅ Easy to change later.
✅ Consistent behavior across backend and frontend.

---

# 📑 Backend Moderation Mode Setup

## 1. `.env` File

Add this environment variable:

```plaintext
MANUAL_MODERATION_ENABLED=true
```

| Value | Meaning |
|:------|:--------|
| `true` | Manual review required (comments start as `pending`) |
| `false` | Auto-approve (comments saved immediately as `approved`) |

✅ Change without touching code — just update `.env`.

---

## 2. Backend Usage

Where needed (e.g., in `commentController.ts`):

```ts
const manualMode = process.env.MANUAL_MODERATION_ENABLED === 'true';

const status = manualMode ? 'pending' : 'approved';
```

✅ Dynamically assigns the correct `status` field to each new comment.

---

# 📑 Frontend Moderation Awareness

## 1. Define Moderation Mode Frontend Variable

Example `src/constants/moderation.ts`:

```ts
export const MANUAL_MODERATION_ENABLED = true; // <-- Mirror backend setting manually for now
```

| Option | Behavior |
|:-------|:---------|
| `true` | Frontend shows "Your comment will be visible after review." |
| `false` | Frontend shows "Your comment has been published!" |

✅ User sees correct feedback immediately.

---

## 2. Using the Frontend Constant

Example in `CommentSection.tsx` after submitting a comment:

```tsx
import { MANUAL_MODERATION_ENABLED } from '../../../constants/moderation';

const handleSubmit = async () => {
  await submitComment(formData);
  alert(
    MANUAL_MODERATION_ENABLED
      ? 'Thanks! Your comment will be visible after admin approval.'
      : 'Thanks! Your comment has been published.'
  );
};
```

✅ Clear user communication.
✅ Different wording depending on mode.

---

# 📈 Flow Summary

| Area | Manual Mode (`true`) | Auto Mode (`false`) |
|:-----|:---------------------|:--------------------|
| Submission Destination | `/pending/` folder | `/pages/` folder |
| Initial Status | `pending` | `approved` |
| Admin Action Needed? | Yes (approve/reject) | No |
| Frontend Message | "Visible after review" | "Published immediately" |

✅ All behavior is predictable and mode-dependent.

---

# 🛠️ Future Improvements (Optional)

- **Automate sync** between backend `.env` and frontend `constants/moderation.ts` (small internal API call or injection at build time)
- **Moderation Mode Toggle UI** (for super admins)
- **Site-wide Notification Banner** if moderation is enabled

✅ Easily expand based on project needs.

---

# 🚀 Conclusion

✅ You now have a fully configurable moderation setting:
- Server and client handle mode cleanly.
- User feedback is dynamic.
- Switching between instant and reviewed comments takes seconds.

---

# 📢 Next Optional Step

Would you like me to write a small **`ModerationHandler.tsx` component** that automatically renders correct user alerts *inside* your comment form after submit?  
(Makes it even cleaner instead of calling `alert()` manually.) 🚀

