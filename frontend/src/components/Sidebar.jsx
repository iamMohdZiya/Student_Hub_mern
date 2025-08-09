import { useState } from 'react';
import { FaUser, FaHome, FaCog, FaBars } from 'react-icons/fa';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { label: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
    { label: 'Profile', icon: <FaUser />, path: '/profile' },
    { label: 'Settings', icon: <FaCog />, path: '/settings' },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white h-screen transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} flex flex-col`}>
        <div className="flex items-center justify-between p-4">
          <span className={`text-xl font-bold ${!isOpen && 'hidden'}`}>StudentHub</span>
          <button onClick={toggleSidebar} className="text-white">
            <FaBars />
          </button>
        </div>

        <nav className="flex-1 mt-4 space-y-2">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span className="ml-3">{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-semibold">Welcome to your dashboard</h1>
        {/* You can render routes or components here */}
      </div>
    </div>
  );
}
