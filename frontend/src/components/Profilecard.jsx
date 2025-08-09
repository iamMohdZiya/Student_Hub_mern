import { Link } from 'react-router-dom';

export default function ProfileCard({ user }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 border border-gray-200 hover:shadow-lg transition duration-300">
      {/* Avatar */}
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={user.photoUrl || '/default-avatar.png'}
          alt="profile"
          className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-sm object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.major}</p>
        </div>
      </div>

      {/* View Profile Button */}
      <Link
        to={`/profile/${user._id}`}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition duration-200"
      >
        View Profile
      </Link>
    </div>
  );
}
