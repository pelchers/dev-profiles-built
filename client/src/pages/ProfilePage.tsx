import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, UserType, DevFocus } from '../types/user';
import { RoleModal } from '../components/flows/profiles/RoleModal';
import { profileApi } from '../api/profile';

interface ProfileFieldConfig {
  key: string;
  label: string;
  type: 'number' | 'tags' | 'readonly' | 'textarea' | 'text' | 'url' | 'json';
  isGithubField?: boolean;
}

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

// Update the section definitions
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
    span: 'full',
    onlyIf: (user: User) => user?.userType === UserType.DEVELOPER,
  },
  {
    title: 'Company Info',
    fields: [
      'companyName', 'companySize', 'industry', 'hiring', 'openRoles', 'foundingYear', 'teamLinks', 'orgDescription',
    ],
    onlyIf: (user: User) => user?.userType === UserType.COMPANY,
  },
  {
    title: 'GitHub Stats',
    fields: githubFieldDefs.map(f => f.key),
    readonly: true,
  },
];

// Helper functions for JSON handling
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

function PillTags({
  value = [],
  editable,
  onChange,
  label,
}: {
  value?: string[];
  editable: boolean;
  onChange?: (tags: string[]) => void;
  label: string;
}) {
  const [input, setInput] = useState('');
  const inputId = React.useId();

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
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>
      {editable && (
        <div className="flex gap-2">
          <label htmlFor={inputId} className="sr-only">{label}</label>
          <input
            id={inputId}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            className="border px-2 py-1 rounded"
            placeholder={`Add ${label.toLowerCase()}`}
            aria-label={`Add ${label.toLowerCase()}`}
          />
          <button 
            type="button" 
            onClick={handleAdd} 
            className="bg-blue-500 text-white px-3 py-1 rounded"
            aria-label={`Add ${label.toLowerCase()}`}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

// TeamLinksInput component for editing teamLinks as pills
function TeamLinksInput({ 
  value = [], 
  onChange,
  label = 'Team Link'
}: { 
  value?: { name: string; url: string }[]; 
  onChange: (links: { name: string; url: string }[]) => void;
  label?: string;
}) {
  const [input, setInput] = useState({ name: '', url: '' });
  const nameInputId = React.useId();
  const urlInputId = React.useId();

  const handleAdd = () => {
    if (!input.name.trim() && !input.url.trim()) return;
    onChange([...(value || []), { name: input.name.trim(), url: input.url.trim() }]);
    setInput({ name: '', url: '' });
  };

  const handleRemove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((link, idx) => (
          <span key={idx} className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline mr-2">{link.name || link.url}</a>
            <button
              type="button"
              className="ml-1 text-green-500 hover:text-red-500"
              onClick={() => handleRemove(idx)}
              aria-label={`Remove ${link.name || 'team link'}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <div>
          <label htmlFor={nameInputId} className="sr-only">{label} Name</label>
          <input
            id={nameInputId}
            type="text"
            value={input.name}
            onChange={e => setInput({ ...input, name: e.target.value })}
            className="border px-2 py-1 rounded"
            placeholder={`${label} Name (optional)`}
            aria-label={`${label} Name`}
          />
        </div>
        <div>
          <label htmlFor={urlInputId} className="sr-only">{label} URL</label>
          <input
            id={urlInputId}
            type="url"
            value={input.url}
            onChange={e => setInput({ ...input, url: e.target.value })}
            className="border px-2 py-1 rounded"
            placeholder={`${label} URL`}
            aria-label={`${label} URL`}
            required
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="bg-green-500 text-white px-3 py-1 rounded"
          aria-label={`Add ${label.toLowerCase()}`}
        >
          Add
        </button>
      </div>
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
  // Parse JSON fields if they're strings
  const parseJsonField = (val: any) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    }
    return val || [];
  };

  // Handle JSON fields
  if (field.type === 'json') {
    const parsedValue = parseJsonField(value);
    console.log('Rendering JSON field:', field.key, parsedValue);
    
    // Render experience as a timeline
    if (field.key === 'experience') {
      return (
        <div className="mb-4 col-span-2">
          <label className="block font-medium mb-2">{field.label}</label>
          {editable ? (
            <ExperienceEditor 
              experiences={parsedValue} 
              onChange={(newExperiences) => onChange?.(newExperiences)} 
            />
          ) : parsedValue && parsedValue.length > 0 ? (
            <div className="space-y-4">
              {parsedValue.map((exp: any, idx: number) => (
                <div key={idx} className="border-l-2 border-blue-500 pl-4 pb-2">
                  <div className="font-semibold text-lg">{exp.title}</div>
                  <div className="text-gray-700">{exp.company} • {exp.location}</div>
                  <div className="text-gray-500 text-sm">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                  {exp.description && (
                    <div className="mt-1 text-gray-600">{exp.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">No experience added yet</span>
          )}
        </div>
      );
    }
    
    // Render education as cards
    if (field.key === 'education') {
      return (
        <div className="mb-4 col-span-2">
          <label className="block font-medium mb-2">{field.label}</label>
          {editable ? (
            <EducationEditor 
              education={parsedValue} 
              onChange={(newEducation) => onChange?.(newEducation)} 
            />
          ) : parsedValue && parsedValue.length > 0 ? (
            <div className="space-y-4">
              {parsedValue.map((edu: any, idx: number) => (
                <div key={idx} className="bg-gray-50 border rounded p-3">
                  <div className="font-semibold">{edu.school}</div>
                  <div>{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</div>
                  <div className="text-gray-500 text-sm">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </div>
                  {edu.description && (
                    <div className="mt-1 text-gray-600 text-sm">{edu.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">No education added yet</span>
          )}
        </div>
      );
    }
  }
  
  // Render tech stacks as cards with tags
  if (field.key === 'techStacks') {
    let stacks = value || [];
    if (typeof stacks === 'string') {
      try {
        stacks = JSON.parse(stacks);
      } catch {
        stacks = [];
      }
    }
    
    return (
      <div className="mb-4 col-span-2">
        <label className="block font-medium mb-2">{field.label}</label>
        {editable ? (
          <TechStackEditor 
            stacks={stacks} 
            onChange={(newStacks) => onChange?.(newStacks)} 
          />
        ) : stacks.length === 0 ? (
          <span className="text-gray-400">No tech stacks added yet</span>
        ) : (
          <div className="space-y-4">
            {stacks.map((stack: any, idx: number) => (
              <div key={idx} className="border rounded-md p-3">
                <div className="font-semibold mb-2">{stack.name}</div>
                <div className="flex flex-wrap gap-2">
                  {stack.technologies.map((tech: string, techIdx: number) => (
                    <span key={techIdx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Render accolades as a list
  if (field.key === 'accolades') {
    let accolades = value || [];
    if (typeof accolades === 'string') {
      try {
        accolades = JSON.parse(accolades);
      } catch {
        accolades = [];
      }
    }
    
    return (
      <div className="mb-4 col-span-2">
        <label className="block font-medium mb-2">{field.label}</label>
        {accolades.length === 0 ? (
          <span className="text-gray-400">No accolades added yet</span>
        ) : (
          <ul className="space-y-2 list-disc pl-5">
            {accolades.map((accolade: any, idx: number) => (
              <li key={idx}>
                <span className="font-medium">{accolade.title}</span>
                {accolade.date && <span className="text-gray-500 ml-2">({accolade.date})</span>}
                {accolade.description && (
                  <div className="text-gray-600 text-sm">{accolade.description}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  
  // Render openRoles as a list
  if (field.key === 'openRoles' && field.type === 'readonly') {
    let roles = getOpenRoles(value);
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">{field.label}</label>
        {roles.length === 0 ? (
          <span className="text-gray-400">Not set</span>
        ) : (
          <ul className="space-y-2">
            {roles.map((role: any, idx: number) => (
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
  // Render teamLinks as a list of links or editable pills
  if (field.key === 'teamLinks' && field.type === 'readonly') {
    let links = getTeamLinks(value);
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">{field.label}</label>
        {editable ? (
          <TeamLinksInput
            value={links}
            onChange={links => onChange?.(links)}
          />
        ) : links.length === 0 ? (
          <span className="text-gray-400">Not set</span>
        ) : (
          <ul className="space-y-1">
            {links.map((link: any, idx: number) => (
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
        <PillTags value={value || []} editable={editable} onChange={onChange} label={field.label} />
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

// Convert string arrays to enum arrays for devFocus if needed
const convertDevFocus = (data: any): DevFocus[] | undefined => {
  if (!data?.devFocus) return undefined;
  
  // If it's already an array of DevFocus enums, return it
  if (Array.isArray(data.devFocus) && 
      data.devFocus.every((focus: any) => Object.values(DevFocus).includes(focus))) {
    return data.devFocus;
  }
  
  // Otherwise convert string values to enum
  if (Array.isArray(data.devFocus)) {
    return data.devFocus
      .filter((focus: string) => Object.values(DevFocus).includes(focus as DevFocus))
      .map((focus: string) => focus as DevFocus);
  }
  
  return undefined;
};

// ExperienceEditor component for editing experience entries
function ExperienceEditor({ 
  experiences = [],
  onChange 
}: { 
  experiences: any[] | undefined; 
  onChange: (experiences: any[]) => void 
}) {
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState({
    company: '',
    title: '',
    start: '',
    end: '',
    description: ''
  });

  const companyInputId = React.useId();
  const titleInputId = React.useId();
  const startInputId = React.useId();
  const endInputId = React.useId();
  const descInputId = React.useId();

  const handleAdd = () => {
    setEditing(null);
    setDraft({
      company: '',
      title: '',
      start: '',
      end: '',
      description: ''
    });
  };

  const handleEdit = (idx: number) => {
    setEditing(idx);
    setDraft(experiences[idx]);
  };

  const handleDelete = (idx: number) => {
    onChange(experiences.filter((_, i) => i !== idx));
    if (editing === idx) {
      setEditing(null);
      setDraft({
        company: '',
        title: '',
        start: '',
        end: '',
        description: ''
      });
    }
  };

  const handleSave = () => {
    if (editing !== null) {
      onChange(experiences.map((exp, i) => i === editing ? draft : exp));
    } else {
      onChange([...experiences, draft]);
    }
    setEditing(null);
    setDraft({
      company: '',
      title: '',
      start: '',
      end: '',
      description: ''
    });
  };

  const handleChange = (field: string, value: string) => {
    setDraft({ ...draft, [field]: value });
  };

  return (
    <div>
      {/* List of experiences */}
      <div className="space-y-4 mb-4">
        {experiences.map((exp, idx) => (
          <div key={idx} className="bg-gray-50 p-4 rounded relative">
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => handleEdit(idx)}
                className="text-blue-500 hover:text-blue-700"
                aria-label={`Edit ${exp.title} at ${exp.company}`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(idx)}
                className="text-red-500 hover:text-red-700"
                aria-label={`Delete ${exp.title} at ${exp.company}`}
              >
                Delete
              </button>
            </div>
            <div className="font-semibold">{exp.title}</div>
            <div>{exp.company}</div>
            <div className="text-sm text-gray-600">
              {exp.start} - {exp.end || 'Present'}
            </div>
            <div className="mt-2">{exp.description}</div>
          </div>
        ))}
      </div>

      {/* Add/Edit form */}
      {(editing !== null || experiences.length === 0) && (
        <div className="bg-white p-4 rounded border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={companyInputId} className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                id={companyInputId}
                type="text"
                value={draft.company}
                onChange={e => handleChange('company', e.target.value)}
                className="border rounded px-3 py-2 w-full"
                placeholder="Company name"
                required
              />
            </div>
            <div>
              <label htmlFor={titleInputId} className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id={titleInputId}
                type="text"
                value={draft.title}
                onChange={e => handleChange('title', e.target.value)}
                className="border rounded px-3 py-2 w-full"
                placeholder="Job title"
                required
              />
            </div>
            <div>
              <label htmlFor={startInputId} className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                id={startInputId}
                type="date"
                value={draft.start}
                onChange={e => handleChange('start', e.target.value)}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label htmlFor={endInputId} className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                id={endInputId}
                type="date"
                value={draft.end}
                onChange={e => handleChange('end', e.target.value)}
                className="border rounded px-3 py-2 w-full"
                placeholder="Leave blank if current"
              />
            </div>
            <div className="col-span-2">
              <label htmlFor={descInputId} className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id={descInputId}
                value={draft.description}
                onChange={e => handleChange('description', e.target.value)}
                className="border rounded px-3 py-2 w-full"
                rows={4}
                placeholder="Describe your role and achievements"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!draft.company || !draft.title || !draft.start}
            >
              {editing !== null ? 'Save Changes' : 'Add Experience'}
            </button>
          </div>
        </div>
      )}

      {/* Add button */}
      {editing === null && experiences.length > 0 && (
        <button
          type="button"
          onClick={handleAdd}
          className="text-blue-500 hover:text-blue-700"
        >
          + Add Experience
        </button>
      )}
    </div>
  );
}

// EducationEditor component for editing education entries
function EducationEditor({ 
  education = [],
  onChange 
}: { 
  education: any[] | undefined; 
  onChange: (education: any[]) => void 
}) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const emptyEducation = {
    school: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: ''
  };
  const [draft, setDraft] = useState(emptyEducation);
  
  // Generate unique IDs for form controls
  const schoolInputId = React.useId();
  const degreeInputId = React.useId();
  const fieldOfStudyInputId = React.useId();
  const startDateInputId = React.useId();
  const endDateInputId = React.useId();
  const descriptionInputId = React.useId();
  
  const handleAdd = () => {
    setEditIndex(null);
    setDraft(emptyEducation);
  };
  
  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    setDraft(education[idx]);
  };
  
  const handleDelete = (idx: number) => {
    const updated = [...education];
    updated.splice(idx, 1);
    onChange(updated);
    if (editIndex === idx) {
      setEditIndex(null);
      setDraft(emptyEducation);
    }
  };
  
  const handleSave = () => {
    let updated;
    if (editIndex !== null) {
      updated = [...education];
      updated[editIndex] = draft;
    } else {
      updated = [...education, draft];
    }
    onChange(updated);
    setEditIndex(null);
    setDraft(emptyEducation);
  };
  
  const handleChange = (field: string, value: any) => {
    setDraft({...draft, [field]: value});
  };
  
  return (
    <div className="space-y-4">
      {/* List existing education */}
      {education.map((edu, idx) => (
        <div key={idx} className="relative border rounded p-4 bg-gray-50">
          <div className="absolute top-2 right-2 flex space-x-2">
            <button 
              type="button" 
              onClick={() => handleEdit(idx)}
              className="text-blue-600 text-xs hover:text-blue-800"
              aria-label={`Edit ${edu.school}`}
            >
              Edit
            </button>
            <button 
              type="button" 
              onClick={() => handleDelete(idx)}
              className="text-red-600 text-xs hover:text-red-800"
              aria-label={`Delete ${edu.school}`}
            >
              Delete
            </button>
          </div>
          <div className="font-semibold">{edu.school}</div>
          <div>{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</div>
          <div className="text-sm text-gray-600">
            {edu.startDate} - {edu.endDate || 'Present'}
          </div>
          {edu.description && <div className="mt-1 text-sm">{edu.description}</div>}
        </div>
      ))}
      
      {/* Form for adding/editing */}
      {editIndex !== null || (
        <button 
          type="button"
          onClick={handleAdd}
          className="flex items-center text-blue-600 hover:text-blue-800"
          aria-label="Add new education"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Education
        </button>
      )}
      
      {(editIndex !== null || draft !== emptyEducation) && (
        <div className="border rounded p-4 bg-white">
          <h4 className="font-medium mb-3">{editIndex !== null ? 'Edit Education' : 'Add Education'}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div>
              <label htmlFor={schoolInputId} className="block text-sm font-medium mb-1">School</label>
              <input 
                id={schoolInputId}
                type="text" 
                value={draft.school} 
                onChange={(e) => handleChange('school', e.target.value)}
                className="w-full border rounded p-2 text-sm"
                placeholder="Enter school name"
                aria-label="School name"
              />
            </div>
            <div>
              <label htmlFor={degreeInputId} className="block text-sm font-medium mb-1">Degree</label>
              <input 
                id={degreeInputId}
                type="text" 
                value={draft.degree} 
                onChange={(e) => handleChange('degree', e.target.value)}
                className="w-full border rounded p-2 text-sm"
                placeholder="Enter degree"
                aria-label="Degree"
              />
            </div>
            <div>
              <label htmlFor={fieldOfStudyInputId} className="block text-sm font-medium mb-1">Field of Study</label>
              <input 
                id={fieldOfStudyInputId}
                type="text" 
                value={draft.fieldOfStudy} 
                onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
                className="w-full border rounded p-2 text-sm"
                placeholder="Enter field of study"
                aria-label="Field of study"
              />
            </div>
            <div>
              <label htmlFor={startDateInputId} className="block text-sm font-medium mb-1">Start Date</label>
              <input 
                id={startDateInputId}
                type="text" 
                placeholder="YYYY-MM" 
                value={draft.startDate} 
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full border rounded p-2 text-sm"
                aria-label="Start date"
              />
            </div>
            <div>
              <label htmlFor={endDateInputId} className="block text-sm font-medium mb-1">End Date (or leave blank if current)</label>
              <input 
                id={endDateInputId}
                type="text" 
                placeholder="YYYY-MM" 
                value={draft.endDate} 
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full border rounded p-2 text-sm"
                aria-label="End date"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor={descriptionInputId} className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              id={descriptionInputId}
              value={draft.description} 
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full border rounded p-2 text-sm"
              rows={3}
              placeholder="Enter description of your education"
              aria-label="Description"
            />
          </div>
          <div className="flex space-x-3">
            <button 
              type="button" 
              onClick={handleSave}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              disabled={!draft.school || !draft.degree || !draft.startDate}
              aria-label="Save education"
            >
              Save
            </button>
            <button 
              type="button" 
              onClick={() => {
                setEditIndex(null);
                setDraft(emptyEducation);
              }}
              className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100"
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// TechStackEditor component for editing tech stack entries
function TechStackEditor({ 
  stacks = [],
  onChange 
}: { 
  stacks: any[] | undefined; 
  onChange: (stacks: any[]) => void 
}) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const emptyStack = {
    name: '',
    technologies: [] as string[]
  };
  const [draft, setDraft] = useState(emptyStack);
  const [techInput, setTechInput] = useState('');
  
  const handleAdd = () => {
    setEditIndex(null);
    setDraft(emptyStack);
  };
  
  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    setDraft(stacks[idx]);
  };
  
  const handleDelete = (idx: number) => {
    const updated = [...stacks];
    updated.splice(idx, 1);
    onChange(updated);
    if (editIndex === idx) {
      setEditIndex(null);
      setDraft(emptyStack);
    }
  };
  
  const handleSave = () => {
    let updated;
    if (editIndex !== null) {
      updated = [...stacks];
      updated[editIndex] = draft;
    } else {
      updated = [...stacks, draft];
    }
    onChange(updated);
    setEditIndex(null);
    setDraft(emptyStack);
  };
  
  const handleChange = (field: string, value: any) => {
    setDraft({...draft, [field]: value});
  };
  
  const handleAddTech = () => {
    if (!techInput.trim()) return;
    setDraft({
      ...draft,
      technologies: [...(draft.technologies || []), techInput.trim()]
    });
    setTechInput('');
  };
  
  const handleRemoveTech = (idx: number) => {
    const updatedTech = [...(draft.technologies || [])];
    updatedTech.splice(idx, 1);
    setDraft({...draft, technologies: updatedTech});
  };
  
  return (
    <div className="space-y-4">
      {/* List existing stacks */}
      {stacks.map((stack, idx) => (
        <div key={idx} className="relative border rounded p-4 bg-gray-50">
          <div className="absolute top-2 right-2 flex space-x-2">
            <button 
              type="button" 
              onClick={() => handleEdit(idx)}
              className="text-blue-600 text-xs hover:text-blue-800"
            >
              Edit
            </button>
            <button 
              type="button" 
              onClick={() => handleDelete(idx)}
              className="text-red-600 text-xs hover:text-red-800"
            >
              Delete
            </button>
          </div>
          <div className="font-semibold mb-2">{stack.name}</div>
          <div className="flex flex-wrap gap-2">
            {stack.technologies.map((tech: string, techIdx: number) => (
              <span key={techIdx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
      
      {/* Form for adding/editing */}
      {editIndex !== null || (
        <button 
          type="button"
          onClick={handleAdd}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Tech Stack
        </button>
      )}
      
      {(editIndex !== null || draft !== emptyStack) && (
        <div className="border rounded p-4 bg-white">
          <h4 className="font-medium mb-3">{editIndex !== null ? 'Edit Tech Stack' : 'Add Tech Stack'}</h4>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Stack Name</label>
            <input 
              type="text" 
              value={draft.name} 
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full border rounded p-2 text-sm"
              placeholder="e.g., Front-end Stack, DevOps Tools, etc."
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Technologies</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {draft.technologies.map((tech: string, idx: number) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                  {tech}
                  <button
                    type="button"
                    className="ml-1 text-blue-500 hover:text-red-500"
                    onClick={() => handleRemoveTech(idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                className="border flex-1 rounded-l px-2 py-1 text-sm"
                placeholder="Add a technology"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="bg-blue-600 text-white px-2 py-1 rounded-r text-sm"
              >
                Add
              </button>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              type="button" 
              onClick={handleSave}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              disabled={!draft.name || draft.technologies.length === 0}
            >
              Save
            </button>
            <button 
              type="button" 
              onClick={() => {
                setEditIndex(null);
                setDraft(emptyStack);
              }}
              className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user: authUser, token, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showTypeChangeWarning, setShowTypeChangeWarning] = useState(false);

  // Determine if the current user is the profile owner
  const isOwner = authUser?.id === profileData?.id;

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // User is already loaded from AuthContext
        if (authUser) {
          setProfileData(authUser);
        } else {
          // Try fetching again if needed
          const response = await profileApi.getCurrentProfile();
          setProfileData(response);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [authUser]);

  // Clear messages after a timeout
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const handleFieldChange = (key: string, value: any) => {
    if (!profileData) return;
    
    setProfileData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: value
      };
    });
  };

  const handleSave = async () => {
    if (!profileData) return;

    try {
      setLoading(true);
      setError(null);
      const updatedProfile = await profileApi.updateProfile(profileData);
      setProfileData(updatedProfile);
      updateUser(updatedProfile); // Update auth context
      setEditMode(false);
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncGitHub = async () => {
    try {
      setLoading(true);
      setError(null);
      const updatedProfile = await profileApi.syncGitHub();
      setProfileData(updatedProfile);
      updateUser(updatedProfile); // Update auth context
      setSuccessMessage('GitHub profile synced successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync GitHub data');
      console.error('GitHub sync error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profileData || !authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-center">
          <p>No profile data available</p>
        </div>
      </div>
    );
  }

  // Determine which image to use
  const profileImageUrl = profileData.profileImage || profileData.githubAvatarUrl || '';

  // Add GitHub sync button
  const syncButton = authUser.githubUsername && !editMode && (
    <button
      onClick={handleSyncGitHub}
      disabled={loading}
      className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-3 py-1 rounded flex items-center ml-auto"
      aria-label="Sync GitHub Data"
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Syncing...
        </>
      ) : (
        <>Sync GitHub Data</>
      )}
    </button>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Show success/error messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Show type change warning */}
      {showTypeChangeWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-semibold mb-4">Change User Type?</h3>
            <p className="mb-4">
              Changing your user type will affect which fields are available and may result in data loss.
              Are you sure you want to continue?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowTypeChangeWarning(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  setShowTypeChangeWarning(false);
                  // Continue with type change
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the existing JSX */}
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          {isOwner && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setEditMode(e => !e)}
            >
              {editMode ? 'Cancel' : 'Edit'}
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
                  alt={authUser?.displayName || authUser?.username || 'Profile'}
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 mb-3"
                />
              )}
              {authUser?.username && (
                <div className="text-lg font-semibold text-gray-800">{authUser.username}</div>
              )}
              {authUser?.email && (
                <div className="text-sm text-gray-500">{authUser.email}</div>
              )}
              {editMode ? (
                <div className="mt-3 w-full max-w-xs">
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                  <select 
                    value={profileData?.userType || UserType.DEVELOPER}
                    onChange={(e) => handleFieldChange('userType', e.target.value)}
                    className="block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    aria-label="Select user type"
                  >
                    <option value={UserType.DEVELOPER}>Developer</option>
                    <option value={UserType.COMPANY}>Company</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Changing user type will show/hide specific sections of your profile
                  </p>
                  {showTypeChangeWarning && (
                    <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">
                      <p className="font-medium">Warning:</p>
                      <p>Changing user type will show/hide different profile sections. Some data might not be visible after changing, but it will be preserved if you switch back.</p>
                      <button 
                        type="button"
                        className="mt-1 text-yellow-800 underline"
                        onClick={() => setShowTypeChangeWarning(false)}
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                authUser.userType && (
                  <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-1">{authUser.userType}</div>
                )
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
                  value={editMode ? profileData?.[field.key] : authUser[field.key]}
                  editable={editMode && !field.isGithubField && isOwner && !SECTION_DEFS[0].readonly}
                  onChange={val => handleFieldChange(field.key, val)}
                />
              ))}
            </div>
          </div>
          {/* Render the rest of the sections */}
          {SECTION_DEFS.slice(1).map(section => {
            // When editing, use editData's userType for section visibility
            const currentUserType = editMode && profileData ? profileData.userType : authUser?.userType;
            
            // Debug log to check user type and section visibility
            console.log('Section:', section.title);
            console.log('Current user type:', currentUserType);
            console.log('Section onlyIf condition:', section.onlyIf ? 'exists' : 'none');
            
            // Check section visibility conditions
            const shouldShow = !section.onlyIf || (authUser && section.onlyIf({ ...authUser, userType: currentUserType || UserType.DEVELOPER }));
            console.log('Should show section:', shouldShow);
            
            if (!shouldShow) {
              return null;
            }
            
            // Get fields for this section
            const sectionFields = section.fields.map(fieldKey => {
              const field = profileFields.find(f => f.key === fieldKey);
              if (!field) {
                // For special fields like experience, education, etc.
                return {
                  key: fieldKey,
                  label: fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1),
                  type: 'json',
                  isGithubField: false
                } as ProfileFieldConfig;
              }
              return field;
            }).filter(Boolean); // Filter out any undefined fields

            // Only add sync button to GitHub section
            const showSyncButton = section.title === 'Social & Links' && authUser?.githubUsername && !editMode;
            
            return (
              <div key={section.title} className="mb-8 bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  {showSyncButton && syncButton}
                </div>
                <div className={`grid grid-cols-1 ${section.span === 'full' ? '' : 'md:grid-cols-2'} gap-6`}>
                  {sectionFields.map(field => {
                    // Debug log for field values
                    console.log('Field:', field.key, 'Value:', editMode ? profileData?.[field.key] : authUser?.[field.key]);
                    
                    return (
                      <ProfileField
                        key={field.key}
                        field={field}
                        value={editMode ? profileData?.[field.key] : authUser?.[field.key]}
                        editable={editMode && !field.isGithubField && isOwner && !section.readonly}
                        onChange={val => handleFieldChange(field.key, val)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
          {editMode && (
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded font-semibold mt-4"
            >
              Save Changes
            </button>
          )}
        </form>
      </div>
    </div>
  );
}


