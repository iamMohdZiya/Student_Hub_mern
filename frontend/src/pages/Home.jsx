import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import apiService from '../services/api';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllPosts();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts, isAuthenticated]);

  const handlePostCreated = () => {
    loadPosts(); // Refresh posts when a new post is created
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading your premium experience...</p>
        </div>
      </div>
    );
  }

  const profileImageUrl = user?.profileImage 
    ? `http://localhost:3000/uploads/profiles/${user.profileImage}`
    : 'https://via.placeholder.com/64x64?text=User';

  return (
    <div className="content-wrapper animate-fadeIn">
      {/* Premium Hero Section for Non-authenticated Users */}
      {!isAuthenticated && (
        <div className="premium-hero-section mb-12 relative">
          <div className="premium-hero-overlay"></div>
          <div className="relative z-10 text-center">
            <div className="premium-dashboard-icon mx-auto mb-8" style={{width: '4rem', height: '4rem'}}>
              <span className="text-4xl font-black text-white">SN</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="text-gradient">Elite Student Network</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join the most exclusive platform for ambitious students. Connect with top performers, 
              share breakthrough achievements, and accelerate your professional journey.
            </p>
            
            {/* Premium Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="premium-stats-card text-center">
                <div className="premium-stat-value text-gradient">50K+</div>
                <p className="text-gray-300 font-semibold">Elite Students</p>
                <p className="text-sm text-gray-500">From top universities</p>
              </div>
              <div className="premium-stats-card text-center">
                <div className="premium-stat-value text-gradient-secondary">1M+</div>
                <p className="text-gray-300 font-semibold">Success Stories</p>
                <p className="text-sm text-gray-500">Shared achievements</p>
              </div>
              <div className="premium-stats-card text-center">
                <div className="premium-stat-value" style={{color: '#10b981'}}>95%</div>
                <p className="text-gray-300 font-semibold">Career Success</p>
                <p className="text-sm text-gray-500">Job placement rate</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="/register" className="btn-premium px-12 py-5 text-lg font-bold hover-lift">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Join Elite Network
              </a>
              <a href="/login" className="btn-secondary px-12 py-5 text-lg hover-lift glass-effect">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7c2 0 3 1 3 3v1" />
                </svg>
                Member Login
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Premium Features Section for Non-authenticated Users */}
      {!isAuthenticated && (
        <div className="max-w-6xl mx-auto space-y-16 mb-16">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="premium-feature-card hover-lift text-center">
              <div className="premium-feature-icon mx-auto" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <span className="text-white text-2xl">🎓</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Elite Education Hub</h3>
              <p className="text-gray-400 leading-relaxed">
                Connect with students from Harvard, MIT, Stanford and other top universities worldwide.
              </p>
            </div>
            
            <div className="premium-feature-card hover-lift text-center">
              <div className="premium-feature-icon mx-auto" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                <span className="text-white text-2xl">💼</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Career Acceleration</h3>
              <p className="text-gray-400 leading-relaxed">
                Access exclusive internships, job opportunities, and mentorship from industry leaders.
              </p>
            </div>
            
            <div className="premium-feature-card hover-lift text-center">
              <div className="premium-feature-icon mx-auto" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
                <span className="text-white text-2xl">🌟</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Success Stories</h3>
              <p className="text-gray-400 leading-relaxed">
                Share achievements, celebrate milestones, and inspire the next generation of leaders.
              </p>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="premium-testimonial">
              <p className="text-lg text-gray-300 mb-6 relative z-10">
                "This platform connected me with my dream internship at Google. The network here is incredible!"
              </p>
              <div className="flex items-center">
                <div className="premium-testimonial-avatar mr-4">S</div>
                <div>
                  <p className="font-bold text-white">Sarah Johnson</p>
                  <p className="text-sm text-gray-400">MIT Computer Science</p>
                </div>
              </div>
            </div>
            
            <div className="premium-testimonial">
              <p className="text-lg text-gray-300 mb-6 relative z-10">
                "From struggling student to startup founder. The connections I made here changed my life."
              </p>
              <div className="flex items-center">
                <div className="premium-testimonial-avatar mr-4">M</div>
                <div>
                  <p className="font-bold text-white">Marcus Chen</p>
                  <p className="text-sm text-gray-400">Stanford Business</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={isAuthenticated ? "sidebar-layout" : "max-w-6xl mx-auto space-y-8"}>
        {/* Left Sidebar - Profile */}
        {isAuthenticated && (
          <div className="space-y-6">
            {/* Enhanced Profile Card */}
            <div className="enhanced-card hover-lift">
              <div className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-2xl object-cover mx-auto border-4 border-gray-700"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/96x96?text=User';
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">✓</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gradient">{user?.name}</h3>
                <p className="text-gray-400 mb-4">{user?.bio || 'Elite Network Member'}</p>
                <div className="premium-badge mb-4">Premium Student</div>
                
                <div className="premium-divider"></div>
                
                <div className="grid grid-2 gap-4">
                  <div className="premium-stat">
                    <div className="text-2xl font-bold text-blue-400">342</div>
                    <div className="text-sm text-gray-400">Profile Views</div>
                  </div>
                  <div className="premium-stat">
                    <div className="text-2xl font-bold text-green-400">{posts.length}</div>
                    <div className="text-sm text-gray-400">Posts</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Quick Actions */}
            <div className="enhanced-card hover-lift">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="premium-dashboard-icon mr-3">
                    <span className="text-white">⚡</span>
                  </div>
                  <h4 className="text-xl font-bold text-white">Quick Actions</h4>
                </div>
                <div className="space-y-4">
                  <button className="w-full premium-feature-card hover-lift p-4">
                    <div className="flex items-center space-x-4">
                      <div className="premium-feature-icon">
                        <span className="text-white text-xl">📝</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-white">Update Status</p>
                        <p className="text-sm text-gray-400">Share your latest achievement</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                  
                  <button className="w-full premium-feature-card hover-lift p-4">
                    <div className="flex items-center space-x-4">
                      <div className="premium-feature-icon">
                        <span className="text-white text-xl">🎓</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-white">Education Hub</p>
                        <p className="text-sm text-gray-400">Manage your academic profile</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                  
                  <button className="w-full premium-feature-card hover-lift p-4">
                    <div className="flex items-center space-x-4">
                      <div className="premium-feature-icon">
                        <span className="text-white text-xl">🚀</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-white">Career Goals</p>
                        <p className="text-sm text-gray-400">Set and track objectives</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-4">
          {/* Welcome Banner for Non-authenticated Users */}
          {!isAuthenticated && (
            <div className="premium-card text-center animate-scaleIn">
              <div className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-3xl">S</span>
                </div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  Welcome to Student Network
                </h1>
                <p className="text-gray-400 text-lg font-medium mb-8 max-w-md mx-auto leading-relaxed">
                  Connect with students worldwide, share your achievements, and build your professional network
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/register" className="btn-linkedin px-8 py-4 text-base hover-lift">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Join Now
                  </a>
                  <a href="/login" className="btn-secondary px-8 py-4 text-base hover-lift">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7c2 0 3 1 3 3v1" />
                    </svg>
                    Sign In
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Post Form */}
          {isAuthenticated && <PostForm onPostCreated={handlePostCreated} />}

          {/* Error Message */}
          {error && (
            <div className="notification notification-error animate-slideIn">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {error}
            </div>
          )}

          {/* Posts Section */}
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onPostDeleted={handlePostDeleted}
                />
              ))
            ) : (
              <div className="premium-card text-center animate-scaleIn">
                <div className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
                    {error ? (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-50 mb-3">
                    {error ? 'Unable to load posts' : 'No posts yet'}
                  </h3>
                  <p className="text-gray-400 text-lg font-medium mb-6 max-w-md mx-auto">
                    {error 
                      ? 'There was an error loading the posts. Please try again.' 
                      : isAuthenticated 
                        ? 'Be the first to share something amazing with the community!' 
                        : 'Join Student Network to see posts from students around the world.'}
                  </p>
                  {!isAuthenticated && (
                    <a href="/register" className="btn-linkedin px-8 py-3 hover-lift">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Join Now
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Premium Right Sidebar - Trending & Suggestions */}
        {isAuthenticated && (
          <div className="lg:col-span-3 space-y-6">
            {/* Enhanced Trending Topics */}
            <div className="premium-card hover-lift group">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-pink-700 to-orange-700 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-50">Trending Now</h4>
                </div>
                <div className="space-y-4">
                  <div className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-900 hover:to-orange-900 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">💻</span>
                        <div>
                          <p className="font-bold text-gray-50 group-hover:text-pink-400">#TechEducation</p>
                          <p className="text-sm text-gray-400">2,847 posts today</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">1</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-900 hover:to-purple-900 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🎓</span>
                        <div>
                          <p className="font-bold text-gray-50 group-hover:text-indigo-400">#StudentLife</p>
                          <p className="text-sm text-gray-400">1,923 posts today</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">2</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-900 hover:to-teal-900 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🎯</span>
                        <div>
                          <p className="font-bold text-gray-50 group-hover:text-emerald-400">#CareerGoals</p>
                          <p className="text-sm text-gray-400">1,456 posts today</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced People You May Know */}
            <div className="premium-card hover-lift group">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-50">Connect & Grow</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Sarah Chen', role: 'AI/ML Student', avatar: 'from-purple-700 to-pink-700', mutual: 5 },
                    { name: 'Alex Rodriguez', role: 'Web Developer', avatar: 'from-blue-700 to-indigo-700', mutual: 12 },
                    { name: 'Maya Patel', role: 'Data Science', avatar: 'from-green-700 to-teal-700', mutual: 8 }
                  ].map((person, index) => (
                    <div key={index} className="flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-900 hover:to-purple-900 transition-all duration-300 group">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${person.avatar} flex items-center justify-center text-white font-bold text-lg mr-3 group-hover:scale-110 transition-transform`}>
                        {person.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-50 group-hover:text-indigo-400">{person.name}</p>
                        <p className="text-sm text-gray-400">{person.role}</p>
                        <p className="text-xs text-gray-600">{person.mutual} mutual connections</p>
                      </div>
                      <button className="btn-secondary text-sm px-4 py-2 hover-lift group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:text-gray-900 group-hover:border-transparent">
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-center text-sm font-medium text-indigo-400 hover:text-indigo-300 py-2 rounded-xl hover:bg-indigo-900 transition-colors">
                  View all suggestions
                </button>
              </div>
            </div>

            {/* Premium Footer */}
            <div className="premium-card">
              <div className="p-6 text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-2xl bg-gradient-to-r from-indigo-700 to-purple-700 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <h5 className="font-bold text-gray-50 mb-2">StudentHub Premium</h5>
                <div className="text-xs text-gray-400 space-y-2">
                  <p>© 2024 All rights reserved</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <a href="#" className="link-linkedin text-xs hover:text-indigo-400 transition-colors">About</a>
                    <a href="#" className="link-linkedin text-xs hover:text-indigo-400 transition-colors">Privacy</a>
                    <a href="#" className="link-linkedin text-xs hover:text-indigo-400 transition-colors">Terms</a>
                    <a href="#" className="link-linkedin text-xs hover:text-indigo-400 transition-colors">Help</a>
                  </div>
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-xs bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-medium">
                      Empowering Student Success
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}