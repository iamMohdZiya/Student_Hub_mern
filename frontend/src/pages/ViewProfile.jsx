import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PostCard from '../components/PostCard';

export default function ViewProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const [profileResponse, postsResponse] = await Promise.all([
        apiService.getProfile(id),
        apiService.getPostsByUser(id)
      ]);
      
      setProfileUser(profileResponse.data.user);
      setUserPosts(postsResponse.data.posts || []);
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadProfileData();
    }
  }, [id, loadProfileData]);


  const handlePostDeleted = (postId) => {
    setUserPosts(userPosts.filter(post => post._id !== postId));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !profileUser) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h1>
            <p className="text-gray-600">{error || 'The requested profile could not be found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser._id === profileUser._id;
  const canViewProfile = profileUser.status === 'approved' || isOwnProfile || currentUser?.role === 'ADMIN';

  if (!canViewProfile) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Available</h1>
            <p className="text-gray-600">This profile is not yet approved for public viewing.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
              {profileUser.profileImage ? (
                <img
                  src={`http://localhost:3000/uploads/profiles/${profileUser.profileImage}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                profileUser.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{profileUser.name}</h1>
              <p className="text-gray-600">{profileUser.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  profileUser.status === 'approved' ? 'bg-green-100 text-green-800' :
                  profileUser.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {profileUser.status}
                </span>
                {profileUser.role === 'ADMIN' && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Member since {new Date(profileUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">About</h2>
            <p className="text-gray-600">
              {profileUser.bio || 'No bio available.'}
            </p>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {isOwnProfile ? 'My Posts' : `${profileUser.name}'s Posts`} ({userPosts.length})
          </h2>
          
          <div className="space-y-6">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onPostDeleted={handlePostDeleted}
                />
              ))
            ) : (
              <div className="bg-white shadow-md rounded-lg p-8 text-center border border-gray-200">
                <p className="text-gray-600">
                  {isOwnProfile ? 'You haven\'t posted anything yet.' : 'No posts to display.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
