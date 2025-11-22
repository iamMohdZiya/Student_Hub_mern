import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import apiService from '../services/api';

const heroStats = [
  { label: 'Elite Students', value: '50K+', detail: 'From top universities' },
  { label: 'Success Stories', value: '1M+', detail: 'Shared achievements' },
  { label: 'Career Success', value: '95%', detail: 'Job placement rate' },
];

const featureCards = [
  {
    title: 'Elite Education Hub',
    description: 'Connect with dreamers and doers from the world’s best universities.',
    emoji: '🎓',
  },
  {
    title: 'Career Acceleration',
    description: 'Unlock curated internships, jobs, and mentorship opportunities.',
    emoji: '💼',
  },
  {
    title: 'Success Stories',
    description: 'Share milestones, celebrate wins, and inspire your peers.',
    emoji: '🌟',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'MIT • Computer Science',
    quote: 'This platform unlocked my internship at Google.',
    initial: 'S',
  },
  {
    name: 'Marcus Chen',
    role: 'Stanford • MBA',
    quote: 'I found my co-founder and launched our startup here.',
    initial: 'M',
  },
];

const quickActions = [
  { title: 'Update Status', subtitle: 'Share your latest achievement', emoji: '📝' },
  { title: 'Education Hub', subtitle: 'Refresh your academic profile', emoji: '🎓' },
  { title: 'Career Goals', subtitle: 'Plan your next big leap', emoji: '🚀' },
];

const trendingTopics = [
  { tag: '#TechEducation', posts: '2,847', accent: 'from-pink-500/30 to-orange-500/30', emoji: '💻' },
  { tag: '#StudentLife', posts: '1,923', accent: 'from-indigo-500/30 to-purple-500/30', emoji: '🎓' },
  { tag: '#CareerGoals', posts: '1,456', accent: 'from-emerald-500/30 to-teal-500/30', emoji: '🎯' },
];

const suggestedPeople = [
  { name: 'Sarah Chen', role: 'AI Researcher', mutual: 5, accent: 'from-purple-500 to-pink-500' },
  { name: 'Alex Rodriguez', role: 'Frontend Engineer', mutual: 12, accent: 'from-sky-500 to-indigo-500' },
  { name: 'Maya Patel', role: 'Data Scientist', mutual: 8, accent: 'from-emerald-500 to-teal-500' },
];

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
      setError('');
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('We could not load the community feed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts, isAuthenticated]);

  const handlePostCreated = () => {
    loadPosts();
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const profileImageUrl = user?.profileImage
    ? `http://localhost:3000/uploads/profiles/${user.profileImage}`
    : 'https://via.placeholder.com/128?text=SN';

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      {!isAuthenticated && (
        <section className="glass-panel relative overflow-hidden p-10 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
          <div className="relative">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-2xl font-black text-white shadow-lg shadow-indigo-900/40">
              SN
            </div>
            <h1 className="mb-4 text-4xl font-black leading-tight sm:text-5xl">
              <span className="gradient-text">Where ambitious students meet opportunity.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300">
              Stravio is your modern student network—built for sharing achievements, building your profile, and unlocking real-world growth.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-purple-900/40 transition hover:shadow-purple-900/60"
              >
                Join Stravio
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-white/20 px-8 py-3 text-lg font-semibold text-white transition hover:bg-white/10"
              >
                I already have an account
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-slate-200">
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.detail}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!isAuthenticated && (
        <section className="mt-12 space-y-10">
          <div className="grid gap-6 md:grid-cols-3">
            {featureCards.map((feature) => (
              <div key={feature.title} className="soft-card min-h-full text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                  {feature.emoji}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <div key={item.name} className="soft-card text-left">
                <p className="mb-4 text-base text-slate-200">&ldquo;{item.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold text-white">
                    {item.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-400">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div
        className={
          isAuthenticated
            ? 'mt-12 grid gap-6 lg:[grid-template-columns:280px_minmax(0,1fr)_250px]'
            : 'mt-12 space-y-8'
        }
      >
        {isAuthenticated && (
          <aside className="space-y-6">
            <div className="glass-panel text-center">
              <div className="relative mx-auto mb-4 h-28 w-28">
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="h-full w-full rounded-3xl object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/128?text=SN';
                  }}
                />
                <span className="absolute -bottom-2 -right-2 rounded-full bg-emerald-500 px-2 py-1 text-xs font-semibold text-white">
                  Active
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
              <p className="text-sm text-slate-400">{user?.bio || 'Student Network Member'}</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-left text-sm">
                <StatBox label="Profile views" value="342" />
                <StatBox label="Posts" value={posts.length.toString()} />
              </div>
            </div>

            <div className="glass-panel">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Quick actions</h4>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    <span className="text-lg">{action.emoji}</span>
                    <div>
                      <p className="font-semibold text-white">{action.title}</p>
                      <p className="text-xs text-slate-400">{action.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        <main className="space-y-6">
          {!isAuthenticated && (
            <div className="glass-panel text-center">
              <p className="text-lg font-semibold text-white">See what other students are working on.</p>
              <p className="mt-2 text-sm text-slate-400">
                Sign up or log in to share your first update and grow your network.
              </p>
              <div className="mt-5 flex justify-center gap-3 text-sm font-semibold">
                <Link to="/register" className="rounded-xl bg-white px-5 py-2 text-slate-900">
                  Create account
                </Link>
                <Link to="/login" className="rounded-xl border border-white/20 px-5 py-2 text-white">
                  Sign in
                </Link>
              </div>
            </div>
          )}

          {isAuthenticated && <PostForm onPostCreated={handlePostCreated} />}

          {error && (
            <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 shadow-lg shadow-red-900/30">
              {error}
            </div>
          )}

          <section className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post._id} post={post} onPostDeleted={handlePostDeleted} />
              ))
            ) : (
              <div className="glass-panel text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                  ✨
                </div>
                <p className="text-lg font-semibold text-white">
                  {isAuthenticated ? 'No posts yet' : 'Members only content'}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {isAuthenticated
                    ? 'Share something awesome to kick things off.'
                    : 'Create an account to view the student feed.'}
                </p>
              </div>
            )}
          </section>
        </main>

        {isAuthenticated && (
          <aside className="space-y-6">
            <div className="glass-panel">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Trending now</h4>
              <div className="space-y-3 text-sm">
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.tag}
                    className={`rounded-2xl border border-white/5 bg-gradient-to-r ${topic.accent} px-3 py-3 text-white`}
                  >
                    <p className="text-xs uppercase tracking-wide text-white/70">{topic.emoji} Trending</p>
                    <p className="text-base font-semibold">{topic.tag}</p>
                    <p className="text-xs text-white/70">{topic.posts} posts today</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">People to follow</h4>
              <div className="space-y-3 text-sm">
                {suggestedPeople.map((person) => (
                  <div key={person.name} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${person.accent} text-lg font-semibold text-white`}
                    >
                      {person.name[0]}
                    </div>
                    <div className="flex-1 text-slate-200">
                      <p className="font-semibold text-white">{person.name}</p>
                      <p className="text-xs text-slate-400">{person.role}</p>
                      <p className="text-xs text-slate-500">{person.mutual} mutual connections</p>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
      <p className="text-xl font-semibold text-white">{value}</p>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}

