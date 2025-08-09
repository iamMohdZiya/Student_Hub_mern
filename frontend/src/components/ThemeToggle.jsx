import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true); // Default to dark theme

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDark(savedTheme === 'dark');
    
    // Apply theme to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="premium-card p-3 hover-lift transition-all duration-300 group"
      style={{ width: 'fit-content' }}
    >
      <div className="flex items-center space-x-3">
        <div className="relative w-12 h-6 rounded-full bg-gray-700 transition-colors duration-300 group-hover:bg-gray-600">
          <div
            className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${
              isDark 
                ? 'left-7 bg-gradient-to-r from-indigo-400 to-purple-400' 
                : 'left-1 bg-gradient-to-r from-yellow-400 to-orange-400'
            }`}
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm transition-colors ${isDark ? 'text-purple-400' : 'text-gray-400'}`}>
            🌙
          </span>
          <span className={`text-sm transition-colors ${!isDark ? 'text-yellow-500' : 'text-gray-400'}`}>
            ☀️
          </span>
        </div>
      </div>
    </button>
  );
}
