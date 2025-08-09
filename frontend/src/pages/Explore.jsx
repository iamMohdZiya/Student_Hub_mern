import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Explore() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use the public approved users endpoint
      const response = await apiService.getApprovedUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-gray-900 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-50 mb-6 text-center">Explore Students</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-50"
          />
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 text-red-300 rounded-md">
            {error}
          </div>
        )}
        
        {/* Student Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="bg-gray-800 shadow-md rounded-lg p-4 border border-gray-700 hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-3 mx-auto text-xl overflow-hidden">
                  {user.profileImage ? (
                    <img
                      src={`http://localhost:3000/uploads/profiles/${user.profileImage}`}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-50 text-center mb-2">{user.name}</h3>
                <p className="text-gray-400 text-center text-sm mb-3 line-clamp-2">
                  {user.bio || 'Student at StudentHub'}
                </p>
                <div className="flex justify-center mb-3">
                  {user.role === 'ADMIN' && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                      Admin
                    </span>
                  )}
                </div>
                <Link 
                  to={`/profile/view/${user._id}`}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200 text-center"
                >
                  View Profile
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">
                {searchTerm ? 'No students found matching your search.' : 'No students to display.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}