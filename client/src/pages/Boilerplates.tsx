import React, { useState } from 'react';
import { FaGithub, FaStar, FaCodeBranch, FaSearch } from 'react-icons/fa';

interface Boilerplate {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  stars: number;
  forks: number;
  author: string;
  image?: string;
}

const boilerplateData: Boilerplate[] = [
  {
    id: '1',
    title: 'React TypeScript Starter',
    description: 'A modern React starter with TypeScript, Vite, TailwindCSS, and ESLint already configured.',
    tags: ['react', 'typescript', 'vite', 'tailwindcss'],
    githubUrl: 'https://github.com/example/react-typescript-starter',
    stars: 1250,
    forks: 325,
    author: 'TypeScript Team',
  },
  {
    id: '2',
    title: 'Express API Boilerplate',
    description: 'Production-ready Express.js API with authentication, validation, and PostgreSQL integration.',
    tags: ['node.js', 'express', 'api', 'postgresql'],
    githubUrl: 'https://github.com/example/express-api-boilerplate',
    stars: 980,
    forks: 210,
    author: 'API Masters',
  },
  {
    id: '3',
    title: 'Next.js Fullstack Template',
    description: 'Next.js template with server-side rendering, API routes, and database integration.',
    tags: ['next.js', 'react', 'fullstack', 'typescript'],
    githubUrl: 'https://github.com/example/nextjs-fullstack-template',
    stars: 2100,
    forks: 430,
    author: 'Vercel Team',
  },
  {
    id: '4',
    title: 'MERN Stack Boilerplate',
    description: 'MongoDB, Express, React, and Node.js stack with user authentication and CRUD examples.',
    tags: ['mongodb', 'express', 'react', 'node.js'],
    githubUrl: 'https://github.com/example/mern-stack-boilerplate',
    stars: 1750,
    forks: 390,
    author: 'Full Stack Labs',
  },
  {
    id: '5',
    title: 'Vue 3 Composition API Starter',
    description: 'Vue 3 starter template with TypeScript, Pinia, and Vue Router.',
    tags: ['vue', 'typescript', 'pinia', 'composition-api'],
    githubUrl: 'https://github.com/example/vue3-composition-starter',
    stars: 890,
    forks: 170,
    author: 'Vue Masters',
  },
  {
    id: '6',
    title: 'Django REST Boilerplate',
    description: 'Django REST Framework template with authentication, testing, and AWS deployment configurations.',
    tags: ['python', 'django', 'rest-api', 'postgresql'],
    githubUrl: 'https://github.com/example/django-rest-boilerplate',
    stars: 1230,
    forks: 280,
    author: 'Python Pros',
  },
  {
    id: '7',
    title: 'Flutter Starter Kit',
    description: 'Flutter boilerplate with state management, routing, and responsive UI components.',
    tags: ['flutter', 'dart', 'mobile', 'cross-platform'],
    githubUrl: 'https://github.com/example/flutter-starter-kit',
    stars: 1600,
    forks: 340,
    author: 'Flutter Devs',
  },
  {
    id: '8',
    title: 'Go Microservices Template',
    description: 'Go-based microservices template with gRPC, Docker, and Kubernetes configurations.',
    tags: ['go', 'microservices', 'docker', 'kubernetes'],
    githubUrl: 'https://github.com/example/go-microservices-template',
    stars: 1850,
    forks: 420,
    author: 'Go Team',
  },
];

const BoilerplatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Extract all unique tags from boilerplates
  const allTags = Array.from(
    new Set(boilerplateData.flatMap(boilerplate => boilerplate.tags))
  ).sort();
  
  // Filter boilerplates based on search term and selected tags
  const filteredBoilerplates = boilerplateData.filter(boilerplate => {
    const matchesSearch = 
      boilerplate.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      boilerplate.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.every(tag => boilerplate.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-brand font-bold mb-4 text-b3">Developer Boilerplates</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          Jump-start your next project with these community-vetted boilerplates and templates.
          All with GitHub repositories for easy forking and customization.
        </p>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search boilerplates..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-b3 focus:border-b3 focus:outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {/* Tags filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Filter by technology:</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-b3 text-white hover:bg-b4'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Boilerplates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBoilerplates.map(boilerplate => (
          <div 
            key={boilerplate.id}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group animate-grid-cascade"
            style={{ "--animation-delay": `${parseInt(boilerplate.id) * 100}ms` } as React.CSSProperties}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-b3 transition">
                {boilerplate.title}
              </h3>
              <p className="text-gray-600 mb-4">{boilerplate.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {boilerplate.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>{boilerplate.stars.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <FaCodeBranch className="mr-1" />
                  <span>{boilerplate.forks.toLocaleString()}</span>
                </div>
                <div>By {boilerplate.author}</div>
              </div>
              
              <a 
                href={boilerplate.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition"
              >
                <FaGithub size={18} />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {filteredBoilerplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No boilerplates match your filters. Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BoilerplatesPage; 