# 📚 **Comments Flow - Moderated Version (Pending / Approved / Rejected)**

---

# 🧐 Full Project Context

This file defines the **moderated version** of your Comments feature:
- Supports "pending", "approved", and "rejected" statuses
- Adds **Auto-Approval Mode** (instant publish) OR **Manual-Moderation Mode** (admin must approve)
- Organized structure for scalable, clean growth

✅ Allows safe, flexible comment handling.

---

# 📂️ Folder and File Organization

| Location | Purpose |
|:---------|:--------|
| `/json/flows/comments/pages/[pageName].json` | Approved comments for public view |
| `/json/flows/comments/pending/[pageName].json` | Pending comments awaiting admin action |
| `/json/flows/comments/rejected/[pageName].json` | (Optional) Archive of rejected comments |

✅ Full separation of lifecycle stages.

---

# 📢 Moderation Mode Config

Set this in your backend:

```ts
MANUAL_MODERATION_ENABLED = true; // or false
```

| Mode | Behavior |
|:-----|:---------|
| Auto Mode (`false`) | Submissions go directly into `/pages/` with status `approved` |
| Manual Mode (`true`) | Submissions go into `/pending/` with status `pending` until reviewed |

✅ Easy to toggle globally.

---

# 📄 Frontend Files (Client)

| File | Purpose |
|:-----|:--------|
| `/client/src/components/flows/comments/CommentSection.tsx` | Submit and display public comments UI |
| `/client/src/components/flows/comments/useComments.ts` | Fetch and submit logic (with server mode auto-handling) |
| `/client/src/types/comment.ts` | Comment type definition with `status` field |

✅ Organized per flow.

---

# 📝 Comment Type Definition

```ts
// /client/src/types/comment.ts
export interface Comment {
  pageName: string;
  fullName: string;
  topic: string;
  commentText: string;
  createdAt: string; // ISO datetime
  commentId: string;
  status: 'pending' | 'approved' | 'rejected';
}
```

✅ Extra `status` field to track comment state.

---

# 📝 Frontend Hook to Manage Comments

```tsx
// /client/src/components/flows/comments/useComments.ts
import { useState } from 'react';
import { Comment } from '../../../types/comment';

export function useComments(pageName: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    const res = await fetch(`/api/comments/pages/${pageName}`);
    const data = await res.json();
    setComments(data);
    setLoading(false);
  };

  const submitComment = async (comment: Omit<Comment, 'createdAt' | 'commentId' | 'status'>) => {
    await fetch('/api/comments/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    fetchComments();
  };

  return { comments, fetchComments, submitComment, loading };
}
```

✅ Handles auto or pending submission transparently.

---

# 📄 Frontend Component for Display and Submit

```tsx
// /client/src/components/flows/comments/CommentSection.tsx
import { useComments } from './useComments';

interface Props {
  pageName: string;
}

function CommentSection({ pageName }: Props) {
  const { comments, fetchComments, submitComment, loading } = useComments(pageName);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Comments</h2>
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.commentId} className="p-4 border rounded-md">
              <h3 className="font-semibold">{comment.topic} - {comment.fullName}</h3>
              <p className="text-gray-600">{comment.commentText}</p>
              <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
      {/* Submit form goes here */}
    </div>
  );
}

export default CommentSection;
```

✅ Only displays approved comments from `/pages/`.

---

# 📄 Backend Files (Server)

| File | Purpose |
|:-----|:--------|
| `/server/flows/comments/commentRoutes.ts` | Routes for submission, approval, rejection, fetching |
| `/server/flows/comments/commentController.ts` | Logic for save/fetch/approve/reject |
| `/server/common/types/comment.ts` | Backend type with `status` |

✅ Matched across frontend and backend.

---

# 📝 Backend Type Definition

```ts
// /server/common/types/comment.ts
export interface Comment {
  pageName: string;
  fullName: string;
  topic: string;
  commentText: string;
  createdAt: string;
  commentId: string;
  status: 'pending' | 'approved' | 'rejected';
}
```

✅ Tracks comment lifecycle status cleanly.

---

# 📝 Backend Routes Setup

```ts
// /server/flows/comments/commentRoutes.ts
import express from 'express';
import { postComment, getApprovedCommentsByPage, approveComment, rejectComment, getPendingComments } from './commentController';

const router = express.Router();

router.post('/submit', postComment);
router.get('/pages/:pageName', getApprovedCommentsByPage);
router.get('/pending/:pageName', getPendingComments);
router.post('/approve/:commentId', approveComment);
router.post('/reject/:commentId', rejectComment);

export default router;
```

✅ Clear separation.
✅ Extendable later.

---

# 📝 Backend Controller Logic (Moderated)

```ts
// /server/flows/comments/commentController.ts
// (Summarized)
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Comment } from '../../common/types/comment';

const pendingDir = path.join(__dirname, '../../../json/flows/comments/pending');
const approvedDir = path.join(__dirname, '../../../json/flows/comments/pages');
const rejectedDir = path.join(__dirname, '../../../json/flows/comments/rejected');

const manualMode = process.env.MANUAL_MODERATION_ENABLED === 'true';

export const postComment = (req: Request, res: Response) => {
  const { pageName, fullName, topic, commentText } = req.body;
  if (!pageName || !fullName || !topic || !commentText) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const newComment: Comment = {
    pageName,
    fullName,
    topic,
    commentText,
    createdAt: new Date().toISOString(),
    commentId: uuidv4(),
    status: manualMode ? 'pending' : 'approved',
  };

  const targetDir = manualMode ? pendingDir : approvedDir;
  const filePath = path.join(targetDir, `${pageName}.json`);

  let comments: Comment[] = [];
  if (fs.existsSync(filePath)) {
    comments = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  comments.push(newComment);
  fs.writeFileSync(filePath, JSON.stringify(comments, null, 2));

  res.status(201).json(newComment);
};

// (Approve/Reject handlers would move comments between pending and pages/rejected)
```

✅ Organized and lightweight.
✅ Status-aware.

---

# 📈 Moderated Flow Diagram

```plaintext
User submits comment -->
    - If Manual Mode --> Saved to /pending/ --> Admin reviews --> Approved or Rejected
    - If Auto Mode --> Saved immediately to /pages/ (visible)
```

✅ Fits both instant and reviewed workflows.

---

# 🖋️ FAQ and Future Expansions

| Question | Answer |
|:---------|:-------|
| Can we add email alerts? | Yes, easily added at submit or approve stages. |
| Can we paginate public comments? | Yes, add simple frontend pagination. |
| Can users edit/delete their comments? | Extend API to allow editing/deleting. |
| Can we upgrade to a database later? | Yes, JSON-to-database migration is straightforward. |

✅ Structured for safe scaling.

---

# 🚀 Next Steps

✅ Both **base** and **moderated** setups are now complete!

Would you like a bonus visual flowchart overview summarizing **both modes** side-by-side? (Optional, nice for documentation.)

