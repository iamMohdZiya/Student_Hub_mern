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
      <div className="premium-card p-8 mb-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Join the Conversation</h3>
        <p className="text-gray-600 mb-4">Please sign in to share your achievements and connect with other students.</p>
        <a href="/login" className="btn-linkedin px-6 py-3">Sign In to Post</a>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const postData = { title, content };
      if (image) {
        postData.image = image;
      }
      
      await apiService.createPost(postData);
      
      // Clear form
      setTitle('');
      setContent('');
      setImage(null);
      
      // Reset file input
      const fileInput = document.getElementById('image-input');
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Notify parent component to refresh posts
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <div className="premium-card group hover-lift mb-6">
      <form onSubmit={handleSubmit}>
        {/* Premium Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Share Your Achievement</h2>
          </div>

          {error && (
            <div className="notification notification-error mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Enhanced Form Fields */}
        <div className="px-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="What's your achievement title?"
              className="input-premium w-full text-lg font-semibold placeholder-gray-400 focus-premium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <span className={`text-sm font-medium ${
                title.length > 50 ? 'text-red-500' : 'text-gray-400'
              }`}>
                {title.length}/100
              </span>
            </div>
          </div>

          <div className="relative">
            <textarea
              placeholder="Share the details of your achievement... What did you accomplish? How did you do it? What did you learn?"
              className="input-premium w-full h-32 resize-none placeholder-gray-400 focus-premium"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="absolute bottom-3 right-3">
              <span className={`text-sm font-medium ${
                content.length > 500 ? 'text-red-500' : 'text-gray-400'
              }`}>
                {content.length}/1000
              </span>
            </div>
          </div>
        </div>

        {/* Premium Action Bar */}
        <div className="border-t border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Image Upload */}
              <label className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 cursor-pointer group transition-colors">
                <div className="p-2 rounded-xl group-hover:bg-indigo-50 transition-colors">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Add Photo</span>
                <input
                  type="file"
                  id="image-input"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Emoji Button */}
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors group"
              >
                <div className="p-2 rounded-xl group-hover:bg-yellow-50 transition-colors">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Add Emoji</span>
              </button>

              {/* Tag Button */}
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors group"
              >
                <div className="p-2 rounded-xl group-hover:bg-green-50 transition-colors">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Add Tags</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className={`btn-linkedin px-8 py-3 flex items-center space-x-2 ${
                loading || !title.trim() 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover-lift'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Share Achievement</span>
                </>
              )}
            </button>
          </div>

          {/* Image Preview */}
          {image && (
            <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Image ready to upload</p>
                  <p className="text-sm text-gray-600">{image.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  document.getElementById('image-input').value = '';
                }}
                className="text-gray-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
