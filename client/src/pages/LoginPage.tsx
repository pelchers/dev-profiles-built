import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserType, DevFocus, Role, User } from '../types/user';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<'developer' | 'company'>('developer');
  const navigate = useNavigate();
  const { login } = useAuth();

  // For demo purposes - mock login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // In a real app, this would make a fetch call to your backend
      // const response = await fetch('/api/auth/login', ...);
      
      // For demo, we'll use mock data
      if (email === 'demo@example.com' && password === 'password') {
        // Mock successful login
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwicm9sZSI6IlVTRVIiLCJleHAiOjE3MTY5MzkxOTZ9.mock-signature';
        
        // Create developer or company user based on selection
        const mockUser = userRole === 'developer' 
          ? {
              id: '1',
              username: 'demouser',
              email: 'demo@example.com',
              displayName: 'Demo Developer',
              userType: UserType.DEVELOPER,
              profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
              bio: 'Full stack developer with 5 years of experience creating web applications.',
              githubUrl: 'https://github.com/demo-dev',
              githubUsername: 'demo-dev',
              location: 'San Francisco, CA',
              website: 'https://demo-dev.com',
              title: 'Senior Full Stack Developer',
              devFocus: [DevFocus.FULLSTACK, DevFocus.FRONTEND],
              languages: ['JavaScript', 'TypeScript', 'Python', 'Go'],
              frameworks: ['React', 'Node.js', 'Express', 'Next.js'],
              tools: ['Docker', 'Git', 'AWS', 'Firebase'],
              specialties: ['Web Development', 'API Design', 'UI/UX'],
              yearsExp: 5,
              openToRoles: ['Remote', 'Full-time', 'Contract'],
              tags: ['TypeScript', 'React', 'Node.js'],
              interests: ['Open Source', 'AI', 'Blockchain'],
              experience: [
                {
                  title: 'Senior Developer',
                  company: 'TechCorp',
                  location: 'San Francisco, CA',
                  startDate: '2020-01',
                  endDate: null,
                  current: true,
                  description: 'Leading the development of web applications using React and Node.js'
                },
                {
                  title: 'Full Stack Developer',
                  company: 'StartupInc',
                  location: 'Remote',
                  startDate: '2018-03',
                  endDate: '2019-12',
                  current: false,
                  description: 'Built RESTful APIs and front-end interfaces for various client projects'
                }
              ],
              education: [
                {
                  school: 'Tech University',
                  degree: 'BS in Computer Science',
                  fieldOfStudy: 'Computer Science',
                  startDate: '2014-09',
                  endDate: '2018-05',
                  description: 'Focused on web technologies and software engineering'
                }
              ],
              techStacks: [
                {
                  name: 'Modern Web Stack',
                  technologies: ['React', 'Node.js', 'MongoDB', 'TypeScript']
                },
                {
                  name: 'DevOps Pipeline',
                  technologies: ['Docker', 'GitHub Actions', 'AWS', 'Terraform']
                }
              ],
              accolades: [
                {
                  title: 'Hackathon Winner',
                  date: '2022-06',
                  description: 'Won first place at TechFest 2022'
                }
              ],
              roles: ['Developer', 'Team Lead', 'Mentor'],
              emailVerified: true,
              role: Role.USER,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z'
            } as User
          : {
              id: '2',
              username: 'democompany',
              email: 'company@example.com',
              displayName: 'Demo Company Inc.',
              userType: UserType.COMPANY,
              profileImage: 'https://randomuser.me/api/portraits/lego/5.jpg',
              bio: 'Innovative tech company building the future of web applications.',
              location: 'Austin, TX',
              website: 'https://democompany.com',
              companyName: 'Demo Company Inc.',
              companySize: '10-50',
              industry: 'Software Development',
              hiring: true,
              openRoles: [
                {
                  title: 'Senior React Developer',
                  description: 'Join our team building cutting-edge web applications.',
                  requirements: ['5+ years React experience', 'TypeScript knowledge', 'Team leadership'],
                  benefits: ['Remote work', 'Flexible hours', 'Health insurance', 'Stock options'],
                  type: 'Full-time',
                  url: 'https://democompany.com/careers/senior-react',
                  location: 'Remote',
                  salary: '$120k - $150k'
                },
                {
                  title: 'Backend Engineer',
                  description: 'Design and implement scalable APIs and services.',
                  requirements: ['Node.js expertise', 'Database design', 'API development'],
                  benefits: ['Competitive salary', '4-day work weeks', 'Learning budget'],
                  type: 'Full-time',
                  url: 'https://democompany.com/careers/backend',
                  location: 'Austin, TX',
                  salary: '$110k - $140k'
                }
              ],
              foundingYear: 2018,
              teamLinks: [
                { name: 'GitHub', url: 'https://github.com/democompany' },
                { name: 'LinkedIn', url: 'https://linkedin.com/company/democompany' }
              ],
              orgDescription: 'Founded in 2018, Demo Company focuses on creating intuitive, powerful web applications for businesses of all sizes. Our team brings decades of combined experience in software development, design, and product management.',
              emailVerified: true,
              role: Role.USER,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z'
            } as User;
        
        // Call the login function from auth context
        console.log('Logging in with mock user:', mockUser);
        login(mockToken, mockUser);
        navigate('/profile');
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">User Type</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="userRole"
                value="developer"
                checked={userRole === 'developer'}
                onChange={() => setUserRole('developer')}
              />
              <span className="ml-2">Developer</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="userRole"
                value="company"
                checked={userRole === 'company'}
                onChange={() => setUserRole('company')}
              />
              <span className="ml-2">Company</span>
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      
      <div className="text-center text-gray-500 text-sm mt-4">
        <p>For demo purposes, use:</p>
        <p>Email: demo@example.com</p>
        <p>Password: password</p>
        <p className="mt-2">Select user type to test different profile views</p>
      </div>
    </div>
  );
};

export default LoginPage; 