import { useState, useEffect } from 'react';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, usersResponse, pendingResponse] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getAllUsers(),
        apiService.getPendingUsers()
      ]);

      setStats(statsResponse.data);
      setUsers(usersResponse.data.users || []);
      setPendingUsers(pendingResponse.data.users || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await apiService.approveUser(userId);
      await loadDashboardData(); // Refresh data
    } catch {
      alert('Failed to approve user');
    }
  };

  const handleRejectUser = async (userId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason !== null) {
      try {
        await apiService.rejectUser(userId, reason);
        await loadDashboardData(); // Refresh data
      } catch {
        alert('Failed to reject user');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await apiService.deleteUser(userId);
        await loadDashboardData(); // Refresh data
      } catch {
        alert('Failed to delete user');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {['stats', 'pending', 'all-users'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'stats' && 'Statistics'}
                  {tab === 'pending' && `Pending Users (${pendingUsers.length})`}
                  {tab === 'all-users' && `All Users (${users.length})`}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Pending Approval</h3>
                  <p className="text-3xl font-bold text-yellow-600">{stats?.pendingUsers || 0}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Approved Users</h3>
                  <p className="text-3xl font-bold text-green-600">{stats?.approvedUsers || 0}</p>
                </div>
              </div>
            )}

            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingUsers.length > 0 ? (
                  pendingUsers.map((user) => (
                    <div key={user._id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{user.name}</h3>
                          <p className="text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            Registered: {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveUser(user._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectUser(user._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No pending users</p>
                )}
              </div>
            )}

            {activeTab === 'all-users' && (
              <div className="space-y-4">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div key={user._id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{user.name}</h3>
                          <p className="text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'approved' ? 'bg-green-100 text-green-800' :
                              user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {user.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveUser(user._id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectUser(user._id)}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {user.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">No users found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
