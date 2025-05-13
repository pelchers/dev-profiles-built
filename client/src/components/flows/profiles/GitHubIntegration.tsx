import React from 'react';
import { User } from '../../../types/user';
import { profileApi } from '../../../api/profile';

interface GitHubIntegrationProps {
  user: User;
  onSyncComplete?: (updatedUser: User) => void;
  isLoading?: boolean;
}

export const GitHubIntegration: React.FC<GitHubIntegrationProps> = ({ 
  user, 
  onSyncComplete,
  isLoading = false
}) => {
  const hasGitHubData = user.githubUsername || user.githubUrl;
  const isConnected = Boolean(user.githubUsername && user.githubId);
  
  const handleSync = async () => {
    try {
      const updatedUser = await profileApi.syncGitHub();
      if (onSyncComplete) {
        onSyncComplete(updatedUser);
      }
    } catch (error) {
      console.error('Failed to sync GitHub profile:', error);
    }
  };
  
  return (
    <div className="github-integration">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">GitHub Integration</h3>
          <p className="text-sm text-gray-600">
            {isConnected 
              ? `Connected to ${user.githubUsername}'s GitHub profile` 
              : hasGitHubData 
                ? 'Sync to load your GitHub profile data'
                : 'Connect your GitHub profile to show your stats and repositories'}
          </p>
        </div>
        
        {hasGitHubData && (
          <button
            onClick={handleSync}
            disabled={isLoading}
            className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-3 py-1 rounded flex items-center"
            aria-label="Sync GitHub Data"
          >
            {isLoading ? (
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
        )}
      </div>
      
      {isConnected && user.githubStats && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded text-center">
            <span className="block text-lg font-semibold">{user.githubPublicRepos}</span>
            <span className="text-xs text-gray-600">Repositories</span>
          </div>
          <div className="bg-gray-50 p-3 rounded text-center">
            <span className="block text-lg font-semibold">{user.githubFollowers}</span>
            <span className="text-xs text-gray-600">Followers</span>
          </div>
          <div className="bg-gray-50 p-3 rounded text-center">
            <span className="block text-lg font-semibold">{user.githubFollowing}</span>
            <span className="text-xs text-gray-600">Following</span>
          </div>
        </div>
      )}
      
      {isConnected && user.githubAvatarUrl && (
        <div className="flex items-center mb-4">
          <img 
            src={user.githubAvatarUrl} 
            alt={`${user.githubUsername}'s avatar`}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div className="overflow-hidden">
            <a 
              href={user.githubHtmlUrl || `https://github.com/${user.githubUsername}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium truncate block"
              title={user.githubHtmlUrl || `https://github.com/${user.githubUsername}`}
            >
              {user.githubUsername}
            </a>
            {user.githubBio && (
              <p className="text-sm text-gray-600 line-clamp-2">{user.githubBio}</p>
            )}
          </div>
        </div>
      )}
      
      {!isConnected && !isLoading && (
        <div className="p-4 bg-gray-50 rounded mb-4">
          <p className="text-center text-gray-600">
            {hasGitHubData 
              ? 'Click "Sync GitHub Data" to load your GitHub profile information'
              : 'Add your GitHub username or URL in the profile settings to connect'}
          </p>
        </div>
      )}
    </div>
  );
}; 