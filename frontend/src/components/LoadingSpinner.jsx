export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--dark-bg-primary)'}}>
      <div className="flex flex-col items-center space-y-6">
        {/* Premium Loading Animation */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-20 h-20 rounded-full border-4 animate-pulse" style={{borderColor: 'var(--border-secondary)'}}></div>
          {/* Inner Spinning Ring */}
          <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-indigo-600 border-r-purple-600 animate-spin"></div>
          {/* Center Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-lg">S</span>
            </div>
          </div>
        </div>
        
        {/* Premium Text */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            StudentHub Premium
          </h3>
          <p className="font-medium" style={{color: 'var(--text-secondary)'}}>Loading your amazing experience...</p>
          
          {/* Loading Dots */}
          <div className="flex space-x-1 justify-center mt-4">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
