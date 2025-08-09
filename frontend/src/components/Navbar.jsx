import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const profileImageUrl = user?.profileImage 
    ? `http://localhost:3000/uploads/profiles/${user.profileImage}`
    : 'https://via.placeholder.com/32x32?text=User';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 premium-card backdrop-blur-xl bg-opacity-95" style={{
      background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.95) 100%)',
      borderRadius: '0',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Premium Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="premium-dashboard-icon" style={{width: '2.5rem', height: '2.5rem'}}>
              <span className="text-lg font-black text-white">SN</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gradient group-hover:scale-105 transition-transform">
                Elite Student Network
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Premium Edition</p>
            </div>
          </Link>
          
          {/* Center Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition-colors font-medium hover:text-gradient"
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className="text-gray-300 hover:text-white transition-colors font-medium hover:text-gradient"
            >
              Explore
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/education" 
                  className="text-gray-300 hover:text-white transition-colors font-medium hover:text-gradient"
                >
                  Education
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link 
                    to="/admin" 
                    className="text-gray-300 hover:text-white transition-colors font-medium hover:text-gradient"
                  >
                    <span className="premium-badge success text-xs mr-2">Admin</span>
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-800 transition-colors group"
                >
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-lg object-cover border-2 border-gray-700 group-hover:border-purple-500 transition-colors"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/32x32?text=User';
                    }}
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white group-hover:text-gradient">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-400">Premium Member</p>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      showDropdown ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 enhanced-card p-2 animate-scaleIn">
                    <div className="p-3 border-b border-gray-700 mb-2">
                      <p className="font-bold text-white">{user?.name}</p>
                      <p className="text-sm text-gray-400">{user?.bio || 'Elite Network Member'}</p>
                      <div className="premium-badge success text-xs mt-2">Premium Account</div>
                    </div>
                    
                    <Link 
                      to="/profile" 
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors group w-full"
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-300 group-hover:text-white font-medium">My Profile</span>
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-900 transition-colors group w-full"
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-gray-300 group-hover:text-red-400 font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="btn-secondary px-6 py-2 text-sm hover-lift"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn-premium px-6 py-2 text-sm hover-lift font-bold"
                >
                  Join Elite
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
