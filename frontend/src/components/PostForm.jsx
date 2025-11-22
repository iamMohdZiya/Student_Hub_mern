import { useState } from 'react';
import apiService from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function PostForm({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="glass-panel text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl">
          ✍️
        </div>
        <p className="text-lg font-semibold text-white">Share your wins with the community</p>
        <p className="mt-1 text-sm text-slate-400">Sign in to post your achievement.</p>
        <a
          href="/login"
          className="mt-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-2 font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:shadow-indigo-900/60"
        >
          Sign in
        </a>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const postData = { title, content };
      if (image) postData.image = image;

      await apiService.createPost(postData);
      setTitle('');
      setContent('');
      setImage(null);
      const fileInput = document.getElementById('image-input');
      if (fileInput) fileInput.value = '';
      onPostCreated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
            +
          </div>
          <div>
            <p className="text-base font-semibold text-white">Create a post</p>
            <p className="text-xs text-slate-400">Tell the community what you’ve been working on.</p>
          </div>
        </div>
        {error && (
          <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {error}
          </p>
        )}
        <div className="space-y-3 text-slate-200">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Title</label>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                maxLength={100}
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">What happened?</label>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What did you build, learn, or launch?"
                rows={4}
                className="w-full bg-transparent py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
            </div>
            <p className="mt-1 text-right text-xs text-slate-500">{content.length}/1000</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/5">
            📷 Upload image
            <input
              id="image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            />
          </label>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="inline-flex items-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post update'}
          </button>
        </div>

        {image && (
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-white">Ready to upload:</p>
              <p className="text-xs text-slate-400">{image.name}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setImage(null);
                const fileInput = document.getElementById('image-input');
                if (fileInput) fileInput.value = '';
              }}
              className="rounded-xl px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/10"
            >
              Remove
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
