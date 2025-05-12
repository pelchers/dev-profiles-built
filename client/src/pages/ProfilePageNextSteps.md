# Updating ProfilePage to Use the Real API and Types

The ProfilePage component is currently using mock data, but we've now set up all the necessary backend and frontend infrastructure to use real data. Here are the key changes needed:

## 1. Import Changes

```typescript
import { useAuth } from '../context/AuthContext';
import { User, UserType } from '../types/user';
```

## 2. Replace Mock Data with Auth Context

```typescript
// This:
const [user, setUser] = useState<User | null>(null);
const [isEditing, setIsEditing] = useState(false);
const isOwner = true; // For demo, assume user is owner

// Should become:
const { user, updateUserProfile, loading } = useAuth();
const [isEditing, setIsEditing] = useState(false);
const isOwner = true; // Will eventually check currentUser.id === user.id

// And remove this useEffect that sets mock data:
useEffect(() => {
  // fetchProfile().then(setUser);
  // For demo, use mock data:
  setUser({...});
}, []);
```

## 3. Update Edit Data Handling

```typescript
// This:
const [editData, setEditData] = useState<User | null>(null);

useEffect(() => {
  if (isEditing && user) setEditData({ ...user });
}, [isEditing, user]);

const handleFieldChange = (key: string, value: any) => {
  if (!editData) return;
  setEditData({ ...editData, [key]: value });
};

const handleSave = async () => {
  // await updateProfile(editData);
  setUser(editData);
  setIsEditing(false);
};

// Should become:
const [editData, setEditData] = useState<Partial<User> | null>(null);

useEffect(() => {
  if (isEditing && user) setEditData({ ...user });
}, [isEditing, user]);

const handleFieldChange = (key: string, value: any) => {
  if (!editData) return;
  setEditData({ ...editData, [key]: value });
};

const handleSave = async () => {
  if (!editData) return;
  
  try {
    await updateUserProfile(editData);
    setIsEditing(false);
  } catch (error) {
    console.error('Failed to update profile:', error);
    // Show error message to user
  }
};
```

## 4. GitHub Profile Sync

Add a button to manually sync GitHub profile when needed:

```typescript
import { syncGitHubProfile } from '../api/profile';

// Add to component:
const [syncingGitHub, setSyncingGitHub] = useState(false);

const handleSyncGitHub = async () => {
  if (!user?.githubUsername) return;
  
  try {
    setSyncingGitHub(true);
    await syncGitHubProfile(user.githubUsername);
    // Refresh user data after sync
    // No need if using context - it will update automatically
  } catch (error) {
    console.error('Failed to sync GitHub profile:', error);
  } finally {
    setSyncingGitHub(false);
  }
};

// Add button in GitHub section:
{user?.githubUsername && (
  <button 
    onClick={handleSyncGitHub}
    disabled={syncingGitHub}
    className="text-sm bg-gray-100 px-2 py-1 rounded"
  >
    {syncingGitHub ? 'Syncing...' : 'Sync GitHub Data'}
  </button>
)}
```

## 5. Loading State Handling

```typescript
// Add to component:
if (loading) return <div className="p-8 text-center">Loading profile...</div>;
if (!user) return <div className="p-8 text-center">User not found</div>;
```

## 6. Type Consistency

Ensure all uses of user data consider the proper types from our schema. For example:

```typescript
// Determine which image to use
const profileImageUrl = user.profileImage || user.githubAvatarUrl || '';

// User fields have correct types
<div className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-1">
  {user.userType === UserType.COMPANY ? 'COMPANY' : 'DEVELOPER'}
</div>
```

## 7. Handle openRoles and teamLinks

These fields are stored as JSON strings, so when displaying or editing:

```typescript
// Parse JSON strings for display
const getOpenRoles = (data: any) => {
  if (!data?.openRoles) return [];
  if (typeof data.openRoles === 'string') {
    try {
      return JSON.parse(data.openRoles);
    } catch {
      return [];
    }
  }
  return data.openRoles;
};

// Same for teamLinks
const getTeamLinks = (data: any) => {
  if (!data?.teamLinks) return [];
  if (typeof data.teamLinks === 'string') {
    try {
      return JSON.parse(data.teamLinks);
    } catch {
      return [];
    }
  }
  return data.teamLinks;
};
```

## 8. Handle Enum Fields

Fields like `devFocus` will need to be handled as enum values:

```typescript
import { DevFocus } from '../types/user';

// When rendering or updating enum arrays:
{user.devFocus?.map(focus => (
  <span key={focus} className="badge">
    {focus}
  </span>
))}

// When adding a new value:
const handleAddDevFocus = (focus: DevFocus) => {
  if (!editData) return;
  setEditData({
    ...editData,
    devFocus: [...(editData.devFocus || []), focus]
  });
};
```

## Next Steps

Once these changes are implemented, the ProfilePage will be fully integrated with our API and database. Some additional enhancements to consider:

1. Add error handling for API calls
2. Improve loading states with skeletons
3. Add validation for form inputs
4. Implement GitHub button that triggers OAuth flow
5. Add image upload for profile pictures

These changes ensure the ProfilePage will work with our real data backend and properly sync with GitHub profiles. 