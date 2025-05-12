import React, { useState } from 'react';

interface Role {
  title: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  type?: string;
  url?: string;
  location?: string;
  salary?: string;
}

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Role[];
  onChange: (roles: Role[]) => void;
}

const emptyRole: Role = {
  title: '',
  description: '',
  requirements: [],
  benefits: [],
  type: '',
  url: '',
  location: '',
  salary: '',
};

export const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, roles, onChange }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftRole, setDraftRole] = useState<Role>(emptyRole);
  const [localRoles, setLocalRoles] = useState<Role[]>(roles);

  React.useEffect(() => {
    setLocalRoles(roles);
  }, [roles]);

  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setDraftRole(localRoles[idx]);
  };

  const handleRemove = (idx: number) => {
    const updated = localRoles.filter((_, i) => i !== idx);
    setLocalRoles(updated);
    onChange(updated);
    if (editingIndex === idx) {
      setEditingIndex(null);
      setDraftRole(emptyRole);
    }
  };

  const handleSave = () => {
    let updated: Role[];
    if (editingIndex !== null) {
      updated = localRoles.map((role, i) => (i === editingIndex ? draftRole : role));
    } else {
      updated = [...localRoles, draftRole];
    }
    setLocalRoles(updated);
    onChange(updated);
    setEditingIndex(null);
    setDraftRole(emptyRole);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setDraftRole(emptyRole);
  };

  const handleFieldChange = (field: keyof Role, value: string) => {
    setDraftRole({ ...draftRole, [field]: value });
  };

  // Pill tag logic for requirements/benefits
  const handleTagAdd = (field: 'requirements' | 'benefits', value: string) => {
    if (!value.trim()) return;
    setDraftRole({
      ...draftRole,
      [field]: [...(draftRole[field] || []), value.trim()],
    });
  };
  const handleTagRemove = (field: 'requirements' | 'benefits', idx: number) => {
    setDraftRole({
      ...draftRole,
      [field]: (draftRole[field] || []).filter((_, i) => i !== idx),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Manage Open Roles</h2>
        {/* List of roles */}
        <div className="space-y-4 mb-6">
          {localRoles.length === 0 && <div className="text-gray-500">No roles added yet.</div>}
          {localRoles.map((role, idx) => (
            <div key={idx} className="relative bg-gray-50 rounded-lg p-4 border">
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded px-2 py-1 text-xs font-semibold"
                  onClick={() => handleEdit(idx)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-100 hover:bg-red-200 text-red-700 rounded px-2 py-1 text-xs font-semibold"
                  onClick={() => handleRemove(idx)}
                >
                  ×
                </button>
              </div>
              <div className="font-semibold text-lg">{role.title}</div>
              <div className="text-gray-600 mb-1">{role.type} {role.location && `· ${role.location}`}</div>
              <div className="mb-1">{role.description}</div>
              {role.requirements && role.requirements.length > 0 && (
                <div className="mb-1">
                  <span className="font-medium">Requirements:</span>
                  <ul className="list-disc list-inside ml-4">
                    {role.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              {role.benefits && role.benefits.length > 0 && (
                <div className="mb-1">
                  <span className="font-medium">Benefits:</span>
                  <ul className="list-disc list-inside ml-4">
                    {role.benefits.map((ben, i) => (
                      <li key={i}>{ben}</li>
                    ))}
                  </ul>
                </div>
              )}
              {role.salary && (
                <div className="text-sm text-gray-700">Salary: {role.salary}</div>
              )}
              {role.url && (
                <div className="text-sm">
                  <a href={role.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Apply / More Info
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Add/Edit Role Form */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">{editingIndex !== null ? 'Edit Role' : 'Add New Role'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border rounded px-3 py-2"
              placeholder="Title"
              value={draftRole.title}
              onChange={e => handleFieldChange('title', e.target.value)}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Type (e.g. Full-time)"
              value={draftRole.type}
              onChange={e => handleFieldChange('type', e.target.value)}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Location"
              value={draftRole.location}
              onChange={e => handleFieldChange('location', e.target.value)}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Salary"
              value={draftRole.salary}
              onChange={e => handleFieldChange('salary', e.target.value)}
            />
            <input
              className="border rounded px-3 py-2 col-span-2"
              placeholder="URL (apply link)"
              value={draftRole.url}
              onChange={e => handleFieldChange('url', e.target.value)}
            />
            <textarea
              className="border rounded px-3 py-2 col-span-2"
              placeholder="Description"
              value={draftRole.description}
              onChange={e => handleFieldChange('description', e.target.value)}
            />
          </div>
          {/* Requirements pill tags */}
          <div className="mt-2">
            <label className="block text-sm font-medium">Requirements</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {draftRole.requirements.map((req, i) => (
                <span key={i} className="bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                  {req}
                  <button
                    type="button"
                    className="ml-1 text-gray-500 hover:text-red-500"
                    onClick={e => { e.preventDefault(); e.stopPropagation(); handleTagRemove('requirements', i); }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <TagInput
              onAdd={val => handleTagAdd('requirements', val)}
              placeholder="Add requirement and press Enter"
            />
          </div>
          {/* Benefits pill tags */}
          <div className="mt-2">
            <label className="block text-sm font-medium">Benefits</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {draftRole.benefits && draftRole.benefits.map((ben, i) => (
                <span key={i} className="bg-green-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                  {ben}
                  <button
                    type="button"
                    className="ml-1 text-gray-500 hover:text-red-500"
                    onClick={e => { e.preventDefault(); e.stopPropagation(); handleTagRemove('benefits', i); }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <TagInput
              onAdd={val => handleTagAdd('benefits', val)}
              placeholder="Add benefit and press Enter"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleSave}
              disabled={!draftRole.title || !draftRole.description}
            >
              {editingIndex !== null ? 'Save Changes' : 'Add Role'}
            </button>
            {editingIndex !== null && (
              <button
                className="border px-4 py-2 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple tag input for requirements/benefits
const TagInput: React.FC<{ onAdd: (val: string) => void; placeholder?: string }> = ({ onAdd, placeholder }) => {
  const [input, setInput] = useState('');
  return (
    <input
      className="border rounded px-2 py-1 text-sm"
      placeholder={placeholder}
      value={input}
      onChange={e => setInput(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter' && input.trim()) {
          onAdd(input);
          setInput('');
        }
      }}
    />
  );
};

export default RoleModal; 