import React, { useState, useEffect } from 'react';
// Import your auth context and API utilities as needed
// import { useAuth } from '../context/AuthContext';
// import { updateProfile, fetchProfile } from '../api/profile';

type User = {
  id: string;
  displayName?: string;
  profileImage?: string;
  bio?: string;
  githubUrl?: string;
  githubUsername?: string;
  githubAvatarUrl?: string;
  githubHtmlUrl?: string;
  githubBio?: string;
  githubCompany?: string;
  githubBlog?: string;
  githubTwitter?: string;
  githubFollowers?: number;
  githubFollowing?: number;
  githubPublicRepos?: number;
  githubPublicGists?: number;
  githubCreatedAt?: string;
  githubUpdatedAt?: string;
  location?: string;
  website?: string;
  title?: string;
  devFocus?: string[];
  languages?: string[];
  frameworks?: string[];
  tools?: string[];
  specialties?: string[];
  yearsExp?: number;
  openToRoles?: string[];
  tags?: string[];
  interests?: string[];
  githubId?: number;
  githubStats?: string;
  githubProfile?: string;
  username?: string;
  email?: string;
  userType?: string;
  // ...add all other fields from your schema
  [key: string]: any;
};

type ProfileFieldConfig = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'tags' | 'readonly' | 'url';
  isGithubField?: boolean;
};

const profileFields: ProfileFieldConfig[] = [
  { key: 'displayName', label: 'Display Name', type: 'text' },
  { key: 'bio', label: 'Bio', type: 'textarea' },
  { key: 'githubUrl', label: 'GitHub URL', type: 'url' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'website', label: 'Website', type: 'url' },
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'devFocus', label: 'Dev Focus', type: 'tags' },
  { key: 'languages', label: 'Languages', type: 'tags' },
  { key: 'frameworks', label: 'Frameworks', type: 'tags' },
  { key: 'tools', label: 'Tools', type: 'tags' },
  { key: 'specialties', label: 'Specialties', type: 'tags' },
  { key: 'yearsExp', label: 'Years Experience', type: 'number' },
  { key: 'openToRoles', label: 'Open to Roles', type: 'tags' },
  { key: 'tags', label: 'Tags', type: 'tags' },
  { key: 'interests', label: 'Interests', type: 'tags' },
  // GitHub fields (readonly, always from backend)
  { key: 'githubUsername', label: 'GitHub Username', type: 'readonly', isGithubField: true },
  { key: 'githubAvatarUrl', label: 'GitHub Avatar', type: 'readonly', isGithubField: true },
  { key: 'githubHtmlUrl', label: 'GitHub Profile Link', type: 'readonly', isGithubField: true },
  { key: 'githubBio', label: 'GitHub Bio', type: 'readonly', isGithubField: true },
  { key: 'githubCompany', label: 'GitHub Company', type: 'readonly', isGithubField: true },
  { key: 'githubBlog', label: 'GitHub Blog', type: 'readonly', isGithubField: true },
  { key: 'githubTwitter', label: 'GitHub Twitter', type: 'readonly', isGithubField: true },
  { key: 'githubFollowers', label: 'GitHub Followers', type: 'readonly', isGithubField: true },
  { key: 'githubFollowing', label: 'GitHub Following', type: 'readonly', isGithubField: true },
  { key: 'githubPublicRepos', label: 'GitHub Public Repos', type: 'readonly', isGithubField: true },
  { key: 'githubPublicGists', label: 'GitHub Public Gists', type: 'readonly', isGithubField: true },
  { key: 'githubCreatedAt', label: 'GitHub Created At', type: 'readonly', isGithubField: true },
  { key: 'githubUpdatedAt', label: 'GitHub Updated At', type: 'readonly', isGithubField: true },
];

// Add missing GitHub fields from schema.prisma to profileFields if not present
const githubFieldDefs: ProfileFieldConfig[] = [
  { key: 'githubId', label: 'GitHub ID', type: 'readonly', isGithubField: true },
  { key: 'githubAvatarUrl', label: 'GitHub Avatar', type: 'readonly', isGithubField: true },
  { key: 'githubHtmlUrl', label: 'GitHub Profile Link', type: 'readonly', isGithubField: true },
  { key: 'githubBio', label: 'GitHub Bio', type: 'readonly', isGithubField: true },
  { key: 'githubCompany', label: 'GitHub Company', type: 'readonly', isGithubField: true },
  { key: 'githubBlog', label: 'GitHub Blog', type: 'readonly', isGithubField: true },
  { key: 'githubTwitter', label: 'GitHub Twitter', type: 'readonly', isGithubField: true },
  { key: 'githubFollowers', label: 'GitHub Followers', type: 'readonly', isGithubField: true },
  { key: 'githubFollowing', label: 'GitHub Following', type: 'readonly', isGithubField: true },
  { key: 'githubPublicRepos', label: 'GitHub Public Repos', type: 'readonly', isGithubField: true },
  { key: 'githubPublicGists', label: 'GitHub Public Gists', type: 'readonly', isGithubField: true },
  { key: 'githubCreatedAt', label: 'GitHub Created At', type: 'readonly', isGithubField: true },
  { key: 'githubUpdatedAt', label: 'GitHub Updated At', type: 'readonly', isGithubField: true },
  { key: 'githubStats', label: 'GitHub Stats (JSON)', type: 'readonly', isGithubField: true },
];

// Add missing Company Info fields to profileFields if not present
const companyFieldDefs: ProfileFieldConfig[] = [
  { key: 'companyName', label: 'Company Name', type: 'text' },
  { key: 'companySize', label: 'Company Size', type: 'text' },
  { key: 'industry', label: 'Industry', type: 'text' },
  { key: 'hiring', label: 'Hiring', type: 'readonly' },
  { key: 'openRoles', label: 'Open Roles', type: 'readonly' },
  { key: 'foundingYear', label: 'Founding Year', type: 'number' },
  { key: 'teamLinks', label: 'Team Links', type: 'readonly' },
  { key: 'orgDescription', label: 'Org Description', type: 'textarea' },
];

companyFieldDefs.forEach(def => {
  if (!profileFields.some(f => f.key === def.key)) {
    profileFields.push(def);
  }
});

githubFieldDefs.forEach(def => {
  if (!profileFields.some(f => f.key === def.key)) {
    profileFields.push(def);
  }
});

// Section definitions based on schema
const SECTION_DEFS = [
  {
    title: 'Basic Info',
    fields: [
      'displayName', 'profileImage', 'bio', 'userType', 'title', 'location', 'website', 'email', 'username',
    ],
  },
  {
    title: 'Focus & Skills',
    fields: [
      'devFocus', 'languages', 'frameworks', 'tools', 'specialties', 'yearsExp', 'openToRoles', 'tags', 'interests',
    ],
  },
  {
    title: 'Social & Links',
    fields: [
      'githubUrl', 'githubUsername', 'githubHtmlUrl', 'githubAvatarUrl', 'githubBio', 'githubCompany', 'githubBlog', 'githubTwitter', 'socialLinks',
    ],
  },
  {
    title: 'Experience & Education',
    fields: [
      'experience', 'education', 'techStacks', 'accolades', 'roles',
    ],
  },
  {
    title: 'Company Info',
    fields: [
      'companyName', 'companySize', 'industry', 'hiring', 'openRoles', 'foundingYear', 'teamLinks', 'orgDescription',
    ],
    onlyIf: (user) => user.userType === 'COMPANY',
  },
  {
    title: 'GitHub Stats',
    fields: githubFieldDefs.map(f => f.key),
    readonly: true,
  },
];

function PillTags({
  value = [],
  editable,
  onChange,
}: {
  value?: string[];
  editable: boolean;
  onChange?: (tags: string[]) => void;
}) {
  const [input, setInput] = useState('');
  const handleAdd = () => {
    if (input.trim() && !value.includes(input.trim())) {
      onChange?.([...value, input.trim()]);
      setInput('');
    }
  };
  const handleRemove = (tag: string) => {
    onChange?.(value.filter(t => t !== tag));
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(tag => (
          <span key={tag} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {tag}
            {editable && (
              <button
                type="button"
                className="ml-2 text-blue-500 hover:text-red-500"
                onClick={() => handleRemove(tag)}
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>
      {editable && (
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            className="border px-2 py-1 rounded"
            placeholder="Add tag"
          />
          <button type="button" onClick={handleAdd} className="bg-blue-500 text-white px-3 py-1 rounded">
            Add
          </button>
        </div>
      )}
    </div>
  );
}

function ProfileField({
  field,
  value,
  editable,
  onChange,
}: {
  field: ProfileFieldConfig;
  value: any;
  editable: boolean;
  onChange?: (val: any) => void;
}) {
  // Pretty-print JSON for githubStats only
  if (field.key === 'githubStats' && field.type === 'readonly') {
    let pretty: React.ReactNode = <span className="text-gray-400">Not set</span>;
    if (value) {
      try {
        const obj = typeof value === 'string' ? JSON.parse(value) : value;
        pretty = <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto whitespace-pre-wrap">{JSON.stringify(obj, null, 2)}</pre>;
      } catch {
        pretty = <span className="text-gray-400">Invalid JSON</span>;
      }
    }
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">{field.label}</label>
        {pretty}
      </div>
    );
  }
  // Render openRoles as a list
  if (field.key === 'openRoles' && field.type === 'readonly') {
    let roles: any[] = [];
    if (value) {
      try {
        roles = typeof value === 'string' ? JSON.parse(value) : value;
      } catch {}
    }
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">{field.label}</label>
        {roles.length === 0 ? (
          <span className="text-gray-400">Not set</span>
        ) : (
          <ul className="space-y-2">
            {roles.map((role, idx) => (
              <li key={idx} className="bg-gray-50 rounded p-3 border border-gray-200">
                <div className="font-semibold text-base text-blue-800 mb-1">{role.title}</div>
                {role.location && (
                  <div className="text-xs text-gray-500 mb-1">Location: {role.location}</div>
                )}
                {role.salary && (
                  <div className="text-xs text-gray-500 mb-1">Salary: {role.salary}</div>
                )}
                {role.description && (
                  <div className="text-sm text-gray-700 mb-1">{role.description}</div>
                )}
                {role.requirements && Array.isArray(role.requirements) && role.requirements.length > 0 && (
                  <div className="mt-1">
                    <div className="text-xs font-medium text-gray-600 mb-0.5">Requirements:</div>
                    <ul className="list-disc list-inside text-xs text-gray-600">
                      {role.requirements.map((req: string, i: number) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {role.benefits && Array.isArray(role.benefits) && role.benefits.length > 0 && (
                  <div className="mt-1">
                    <div className="text-xs font-medium text-gray-600 mb-0.5">Benefits:</div>
                    <ul className="list-disc list-inside text-xs text-gray-600">
                      {role.benefits.map((ben: string, i: number) => (
                        <li key={i}>{ben}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {role.type && (
                  <div className="text-xs text-gray-500 mt-1">Type: {role.type}</div>
                )}
                {role.url && (
                  <div className="mt-1">
                    <a href={role.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Apply / More Info</a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  // Render teamLinks as a list of links
  if (field.key === 'teamLinks' && field.type === 'readonly') {
    let links: any[] = [];
    if (value) {
      try {
        links = typeof value === 'string' ? JSON.parse(value) : value;
      } catch {}
    }
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">{field.label}</label>
        {links.length === 0 ? (
          <span className="text-gray-400">Not set</span>
        ) : (
          <ul className="space-y-1">
            {links.map((link, idx) => (
              <li key={idx}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {link.name || link.url}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  if (field.type === 'tags') {
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">{field.label}</label>
        <PillTags value={value || []} editable={editable} onChange={onChange} />
      </div>
    );
  }
  if (field.type === 'textarea') {
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">{field.label}</label>
        {editable ? (
          <textarea
            className="border rounded w-full p-2"
            value={value || ''}
            onChange={e => onChange?.(e.target.value)}
            placeholder={field.label}
          />
        ) : (
          <div className="p-2">{value || <span className="text-gray-400">Not set</span>}</div>
        )}
      </div>
    );
  }
  if (field.type === 'readonly') {
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">{field.label}</label>
        <div className="p-2 bg-gray-50 rounded">{value || <span className="text-gray-400">Not set</span>}</div>
      </div>
    );
  }
  if (field.type === 'url') {
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">{field.label}</label>
        {editable ? (
          <input
            type="url"
            className="border rounded w-full p-2"
            value={value || ''}
            onChange={e => onChange?.(e.target.value)}
            placeholder={field.label}
          />
        ) : value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {value}
          </a>
        ) : (
          <span className="text-gray-400">Not set</span>
        )}
      </div>
    );
  }
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">{field.label}</label>
      {editable ? (
        <input
          type={field.type}
          className="border rounded w-full p-2"
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
          placeholder={field.label}
        />
      ) : (
        <div className="p-2">{value || <span className="text-gray-400">Not set</span>}</div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  // Replace with your actual user fetching/auth logic
  // const { user: currentUser } = useAuth();
  // const [user, setUser] = useState<User | null>(null);
  // const isOwner = currentUser?.id === user?.id;
  // For demo, assume user is owner:
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const isOwner = true;

  useEffect(() => {
    // fetchProfile().then(setUser);
    // For demo, use mock data:
    setUser({
      id: '1',
      username: 'janedev',
      email: 'jane@example.com',
      userType: 'COMPANY',
      displayName: 'Jane Dev',
      bio: 'Fullstack developer',
      githubUrl: 'https://github.com/octocat',
      githubUsername: 'octocat',
      githubId: 583231,
      githubAvatarUrl: 'https://github.com/images/error/octocat_happy.gif',
      githubHtmlUrl: 'https://github.com/octocat',
      githubBio: 'There once was...',
      githubCompany: 'GitHub',
      githubBlog: 'https://github.com/blog',
      githubTwitter: 'monatheoctocat',
      githubFollowers: 20,
      githubFollowing: 0,
      githubPublicRepos: 2,
      githubPublicGists: 1,
      githubCreatedAt: '2008-01-14T04:33:35Z',
      githubUpdatedAt: '2024-05-20T12:00:00Z',
      githubStats: JSON.stringify({ stars: 42, forks: 10, issues: 5 }),
      location: 'San Francisco',
      website: 'https://janedev.com',
      title: 'Lead Engineer',
      devFocus: ['FULLSTACK', 'API'],
      languages: ['TypeScript', 'Python'],
      frameworks: ['React', 'Next.js'],
      tools: ['Docker', 'Figma'],
      specialties: ['UI/UX', 'Testing'],
      yearsExp: 7,
      openToRoles: ['Mentor', 'Freelance'],
      tags: ['Open Source', 'Remote'],
      interests: ['AI', 'Startups'],
      companyName: 'Acme Corp',
      companySize: '51-200',
      industry: 'Software',
      hiring: true,
      openRoles: JSON.stringify([
        {
          title: 'Frontend Engineer',
          description: 'React/TypeScript',
          requirements: ['3+ years experience'],
          benefits: ['Remote work', 'Health insurance'],
          type: 'Full-time',
          url: 'https://acme.com/jobs/frontend',
          location: 'Remote',
          salary: '$120k - $140k',
        },
        {
          title: 'Backend Engineer',
          description: 'Node/Prisma',
          requirements: ['5+ years experience'],
          benefits: ['Stock options', 'Flexible hours'],
          type: 'Contract',
          url: 'https://acme.com/jobs/backend',
          location: 'San Francisco, CA',
          salary: '$100/hr',
        }
      ]),
      foundingYear: 2010,
      teamLinks: JSON.stringify([
        { name: 'LinkedIn', url: 'https://linkedin.com/company/acme' },
        { name: 'Website', url: 'https://acme.com/team' }
      ]),
      orgDescription: 'We build awesome developer tools for modern teams.',
    });
  }, []);

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

  if (!user) return <div>Loading...</div>;

  // Determine which image to use
  const profileImageUrl = user.profileImage || user.githubAvatarUrl || '';

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        {isOwner && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsEditing(e => !e)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        )}
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSave();
        }}
        className=""
      >
        {/* Basic Info Section with custom layout for image, username, email, userType */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Info</h2>
          <div className="flex flex-col items-center mb-6">
            {profileImageUrl && (
              <img
                src={profileImageUrl}
                alt={user.displayName || user.username || 'Profile'}
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 mb-3"
              />
            )}
            {user.username && (
              <div className="text-lg font-semibold text-gray-800">{user.username}</div>
            )}
            {user.email && (
              <div className="text-sm text-gray-500">{user.email}</div>
            )}
            {user.userType && (
              <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-1">{user.userType}</div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileFields.filter(f =>
              SECTION_DEFS[0].fields.includes(f.key) &&
              !['profileImage', 'username', 'email', 'userType'].includes(f.key)
            ).map(field => (
              <ProfileField
                key={field.key}
                field={field}
                value={isEditing ? editData?.[field.key] : user[field.key]}
                editable={isEditing && !field.isGithubField && isOwner && !SECTION_DEFS[0].readonly}
                onChange={val => handleFieldChange(field.key, val)}
              />
            ))}
          </div>
        </div>
        {/* Render the rest of the sections as before */}
        {SECTION_DEFS.slice(1).map(section => {
          if (section.title === 'Company Info' && user.userType !== 'COMPANY') return null;
          if (section.onlyIf && !section.onlyIf(user)) return null;
          const sectionFields = profileFields.filter(f => section.fields.includes(f.key));
          if (sectionFields.length === 0) return null;
          return (
            <div key={section.title} className="mb-8 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sectionFields.map(field => (
                  <ProfileField
                    key={field.key}
                    field={field}
                    value={isEditing ? editData?.[field.key] : user[field.key]}
                    editable={isEditing && !field.isGithubField && isOwner && !section.readonly}
                    onChange={val => handleFieldChange(field.key, val)}
                  />
                ))}
              </div>
            </div>
          );
        })}
        {isEditing && (
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded mt-4"
          >
            Save
          </button>
        )}
      </form>
    </div>
  );
}
