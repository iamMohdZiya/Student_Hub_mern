import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';

export default function PostCard({ post, onPostDeleted }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setLoading(true);
    try {
      await apiService.deletePost(post._id);
      if (onPostDeleted) {
        onPostDeleted(post._id);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  const canDeletePost = user && post.userId && (user._id === post.userId._id || user.role === 'ADMIN');

  return (
    <div className="premium-card group hover-lift mb-6">
      {/* Premium Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div className="flex items-start space-x-4 flex-1">
          {/* Enhanced Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
              {post.userId?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          
          {/* User Info & Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-white hover:text-indigo-300 transition-colors cursor-pointer">
                {post.userId?.name || 'Unknown User'}
              </h3>
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <span className="text-sm text-slate-400">
                {formatDate(post.createdAt || post.updatedAt)}
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-2">Premium Student Member</p>
            <h2 className="text-xl font-bold text-white mb-3 leading-tight">{post.title}</h2>
          </div>
        </div>
        
        {/* Action Menu */}
        <div className="flex items-center space-x-2">
          {canDeletePost && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-slate-400 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/10 transition-all duration-200 group"
              title={loading ? 'Deleting...' : 'Delete post'}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          )}
          <button className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-white/10 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Premium Content */}
      <div className="px-6">
        {post.content && (
          <div className="mb-4">
            <p className="text-slate-200 leading-relaxed text-base font-medium">{post.content}</p>
          </div>
        )}

        {/* Enhanced Image Display */}
        {post.image && (
          <div className="mb-4 -mx-6">
            <img 
              src={`http://localhost:3000/uploads/posts/${post.image}`}
              alt="Post content"
              className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Premium Action Bar */}
      <div className="border-t border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <button className="flex items-center space-x-2 text-slate-300 hover:text-indigo-300 transition-all duration-200 group">
              <div className="p-2 rounded-xl group-hover:bg-indigo-500/10 transition-colors">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="font-medium text-sm">Like</span>
            </button>

            {/* Comment Button */}
            <button className="flex items-center space-x-2 text-slate-300 hover:text-green-300 transition-all duration-200 group">
              <div className="p-2 rounded-xl group-hover:bg-green-500/10 transition-colors">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="font-medium text-sm">Comment</span>
            </button>

            {/* Share Button */}
            <button className="flex items-center space-x-2 text-slate-300 hover:text-purple-300 transition-all duration-200 group">
              <div className="p-2 rounded-xl group-hover:bg-purple-500/10 transition-colors">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <span className="font-medium text-sm">Share</span>
            </button>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>12 likes</span>
            </span>
            <span>3 comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
