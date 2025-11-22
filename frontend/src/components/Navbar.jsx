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
    : 'https://via.placeholder.com/64x64?text=SN';

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-lg font-black text-white shadow-lg shadow-indigo-900/40">
            SN
          </div>
          <div className="hidden md:block">
            <p className="text-sm uppercase tracking-wide text-slate-400">Stravio</p>
            <p className="gradient-text text-lg font-semibold leading-5">Student Network</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <NavLink to="/" label="Home" />
          <NavLink to="/explore" label="Explore" />
          {isAuthenticated && (
            <>
              <NavLink to="/education" label="Education" />
              {user?.role === 'ADMIN' && <NavLink to="/admin" label="Admin" badge="Admin" />}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-2 py-1 text-left text-sm text-white shadow-lg shadow-black/30 transition hover:bg-white/10"
                aria-haspopup="true"
                aria-expanded={showDropdown}
              >
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="h-10 w-10 rounded-2xl object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/64x64?text=SN';
                  }}
                />
                <div className="hidden md:flex flex-col leading-tight">
                  <span className="font-semibold">{user?.name || 'Student'}</span>
                  <span className="text-xs text-slate-400">{user?.bio || 'Premium Member'}</span>
                </div>
                <svg
                  className={`h-4 w-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-white/10 bg-slate-900/90 p-4 text-sm text-slate-200 shadow-2xl shadow-black/30 backdrop-blur-xl">
                  <div className="border-b border-white/10 pb-3">
                    <p className="text-base font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white/5"
                  >
                    <span className="text-lg">👤</span>
                    <span>View profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                  >
                    <span className="text-lg">↩</span>
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link
                to="/login"
                className="rounded-2xl border border-white/10 px-5 py-2 text-slate-200 transition hover:bg-white/10"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 text-white shadow-lg shadow-indigo-900/40 transition hover:shadow-indigo-900/60"
              >
                Join now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, label, badge }) {
  return (
    <Link
      to={to}
      className="group relative flex items-center gap-2 text-slate-300 transition hover:text-white"
    >
      {badge && (
        <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-300">
          {badge}
        </span>
      )}
      <span>{label}</span>
      <span className="absolute inset-x-0 -bottom-2 h-0.5 origin-center scale-x-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition group-hover:scale-x-100" />
    </Link>
  );
}
