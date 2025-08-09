export default function ProfileView({ profile }) {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {/* Background */}
        <img src={profile.bgImage} alt="Background" className="w-full h-40 object-cover" />

        {/* Profile Info */}
        <div className="p-6 text-center">
          <img src={profile.profilePic} alt="Profile" className="w-24 h-24 rounded-full mx-auto -mt-12 border-4 border-white shadow" />
          <h2 className="text-xl font-bold mt-2">{profile.name}</h2>
          <p className="text-gray-600">{profile.description}</p>
        </div>

        {/* Education */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold mb-2">Education</h3>
          {Object.entries(profile.education).map(([level, data]) => (
            <div key={level} className="mb-2">
              <p className="font-medium capitalize">{level}</p>
              <p className="text-sm text-gray-700">{data.school || data.college} | {data.year} | CGPA: {data.cgpa}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
