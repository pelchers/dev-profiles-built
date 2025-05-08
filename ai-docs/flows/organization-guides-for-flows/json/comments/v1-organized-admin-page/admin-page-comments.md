# 📚 **Admin Comments Page: Sort, Filter, Search Flow**

---

# 📅 Overview: Admin Page Purpose

The Admin Comments Page is designed to:
- Fetch **all comments**.
- Allow admins to **sort**, **filter**, and **search** through comments.
- Display comments in a **clean table** or **list UI**.
- Future-expandable to add **moderation** controls (approve/reject).

---

# 📜 Folder and File Structure for Admin Comments Flow

| Location | Purpose |
|:---------|:--------|
| `/client/src/components/flows/comments/AdminCommentTable.tsx` | Main component showing admin comment list/table |
| `/client/src/components/flows/comments/useAdminComments.ts` | Hook for fetching and managing sorting/filtering/searching |
| `/client/src/components/flows/comments/AdminControls.tsx` | Optional: Controls UI (filters, search bar, sort dropdown) |

---

# 📝 Frontend Files Details

## 📄 `/client/src/components/flows/comments/useAdminComments.ts`

```tsx
import { useState, useEffect } from 'react';
import { Comment } from '../../../types/comment';

export function useAdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPage, setFilterPage] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [sortField, setSortField] = useState<'createdAt' | 'fullName' | 'topic'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    const res = await fetch('/api/comments/all');
    const data = await res.json();
    setComments(data);
    setLoading(false);
  };

  const filteredComments = comments.filter((c) => {
    const matchesPage = filterPage ? c.pageName === filterPage : true;
    const matchesTopic = filterTopic ? c.topic === filterTopic : true;
    const matchesSearch = searchTerm
      ? (c.fullName + c.topic + c.commentText).toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesPage && matchesTopic && matchesSearch;
  });

  const sortedComments = filteredComments.sort((a, b) => {
    if (sortField === 'createdAt') {
      return sortDirection === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    const fieldA = a[sortField].toLowerCase();
    const fieldB = b[sortField].toLowerCase();
    return sortDirection === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
  });

  return {
    loading,
    sortedComments,
    setSearchTerm,
    setFilterPage,
    setFilterTopic,
    setSortField,
    setSortDirection,
  };
}
```

---

## 📄 `/client/src/components/flows/comments/AdminCommentTable.tsx`

```tsx
import { useAdminComments } from './useAdminComments';
import AdminControls from './AdminControls';

function AdminCommentTable() {
  const {
    loading,
    sortedComments,
    setSearchTerm,
    setFilterPage,
    setFilterTopic,
    setSortField,
    setSortDirection,
  } = useAdminComments();

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className="space-y-4">
      <AdminControls
        setSearchTerm={setSearchTerm}
        setFilterPage={setFilterPage}
        setFilterTopic={setFilterTopic}
        setSortField={setSortField}
        setSortDirection={setSortDirection}
      />
      <table className="w-full table-auto border">
        <thead>
          <tr>
            <th>Page</th>
            <th>Full Name</th>
            <th>Topic</th>
            <th>Comment</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {sortedComments.map((comment) => (
            <tr key={comment.commentId}>
              <td>{comment.pageName}</td>
              <td>{comment.fullName}</td>
              <td>{comment.topic}</td>
              <td>{comment.commentText}</td>
              <td>{new Date(comment.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCommentTable;
```

---

## 📄 `/client/src/components/flows/comments/AdminControls.tsx`

```tsx
interface Props {
  setSearchTerm: (value: string) => void;
  setFilterPage: (value: string) => void;
  setFilterTopic: (value: string) => void;
  setSortField: (value: 'createdAt' | 'fullName' | 'topic') => void;
  setSortDirection: (value: 'asc' | 'desc') => void;
}

function AdminControls({ setSearchTerm, setFilterPage, setFilterTopic, setSortField, setSortDirection }: Props) {
  return (
    <div className="space-y-2">
      <input placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} className="input" />
      <select onChange={(e) => setFilterPage(e.target.value)} className="select">
        <option value="">All Pages</option>
        <option value="home">Home</option>
        <option value="services">Services</option>
        <option value="gallery">Gallery</option>
        <option value="about">About</option>
        <option value="contact">Contact</option>
      </select>
      <select onChange={(e) => setFilterTopic(e.target.value)} className="select">
        <option value="">All Topics</option>
        <option value="Feedback">Feedback</option>
        <option value="Issue">Issue</option>
        <option value="Suggestion">Suggestion</option>
        <option value="Other">Other</option>
      </select>
      <select onChange={(e) => setSortField(e.target.value as any)} className="select">
        <option value="createdAt">Date</option>
        <option value="fullName">Name</option>
        <option value="topic">Topic</option>
      </select>
      <select onChange={(e) => setSortDirection(e.target.value as any)} className="select">
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>
    </div>
  );
}

export default AdminControls;
```

---

# 📊 Flow Summary (Frontend)

| Component | Purpose |
|:----------|:--------|
| `useAdminComments.ts` | Fetch, filter, search, sort comments in memory |
| `AdminCommentTable.tsx` | Displays comments in a sortable/filterable table |
| `AdminControls.tsx` | UI inputs for filter/sort/search options |

✅ Clean, modular, readable, scalable.

---

# 💬 FAQ & Tips Section

### 1. What happens if comments.json is corrupted?
- Add error handling in `fetchComments()` (try/catch). Display a friendly message if JSON cannot parse.

### 2. What if a comment is missing a field (e.g., no topic)?
- Defensive rendering: fallback to `"Unknown Topic"` or similar if field is missing.

### 3. How to handle very large comment files?
- Add pagination on frontend: load/display 10–20 comments at a time.

### 4. Should Admins be able to delete comments?
- Optional later addition: add a delete button next to each comment.

### 5. Can comments be edited?
- Not in this base version — but the flow can easily expand to allow editing in future.

---

# 🚀 Ready for Next

If you approve this file, next I will create:
- Comment Moderation Flow (Approve/Reject system).

(Waiting for your green light ✅!)

