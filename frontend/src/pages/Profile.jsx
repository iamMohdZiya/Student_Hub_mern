import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    profileImage: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        profileImage: null
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileData(prev => ({
      ...prev,
      profileImage: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateUserProfile(profileData);
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        // Reset file input
        const fileInput = document.getElementById('profile-image-input');
        if (fileInput) {
          fileInput.value = '';
        }
        setProfileData(prev => ({ ...prev, profileImage: null }));
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    // Reset form data
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        profileImage: null
      });
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="content-wrapper animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <div className="premium-card hover-lift">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                My Profile
              </h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-linkedin px-6 py-3 hover-lift"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>

            {error && (
              <div className="notification notification-error mb-6 animate-slideIn">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="notification notification-success mb-6 animate-slideIn">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {success}
              </div>
            )}

            {/* Profile Image */}
            <div className="flex items-center space-x-8 mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {user.profileImage ? (
                    <img
                      src={`http://localhost:3000/uploads/profiles/${user.profileImage}`}
                      alt="Profile"
                      className="w-32 h-32 rounded-3xl object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                <p className="text-slate-300 text-lg font-medium mb-4">{user.email}</p>
                <div className="flex items-center space-x-3">
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                    user.status === 'approved' ? 'bg-green-500/10 text-green-300 border border-green-500/20' :
                    user.status === 'pending' ? 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20' :
                    'bg-red-500/10 text-red-300 border border-red-500/20'
                  }`}>
                    {user.status === 'approved' ? '✅ Verified' : user.status === 'pending' ? '⏳ Pending' : '❌ Rejected'}
                  </span>
                  {user.role === 'ADMIN' && (
                    <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      👑 Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isEditing ? (
              // Edit Form
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-field-group">
                  <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="input-premium focus-premium"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label className="block text-sm font-bold text-slate-300 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="input-premium focus-premium h-32 resize-none"
                    placeholder="Tell us about yourself, your interests, goals, and achievements..."
                  />
                </div>

                <div className="form-field-group">
                  <label className="block text-sm font-bold text-slate-300 mb-2">Profile Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      id="profile-image-input"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-slate-300 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-slate-200 hover:file:bg-white/20 file:transition-all file:duration-300 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-linkedin px-8 py-3 hover-lift ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary px-8 py-3 hover-lift"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // Display Mode
              <div className="space-y-8">
                {/* About Section */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">About</h3>
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {user.bio || (
                      <span className="text-slate-400 italic">
                        No bio added yet. Click 'Edit Profile' to add information about yourself.
                      </span>
                    )}
                  </p>
                </div>

                {/* Account Details Section */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Account Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-bold text-slate-300 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        Email Address
                      </p>
                      <p className="text-slate-200 font-medium">{user.email}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-bold text-slate-300 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-6 4v10a2 2 0 002 2h8a2 2 0 002-2V11a2 2 0 00-2-2H8a2 2 0 00-2 2z" />
                        </svg>
                        Member Since
                      </p>
                      <p className="text-slate-200 font-medium">{new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
