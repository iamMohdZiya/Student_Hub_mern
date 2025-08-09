import { useState } from 'react';

export default function ProfileForm() {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [education, setEducation] = useState({
    tenth: { school: '', year: '', cgpa: '' },
    twelfth: { school: '', year: '', cgpa: '' },
    graduation: { college: '', year: '', cgpa: '' },
  });

  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) setter(URL.createObjectURL(file));
  };

  const handleEduChange = (level, field, value) => {
    setEducation(prev => ({
      ...prev,
      [level]: { ...prev[level], [field]: value },
    }));
  };

  return (
    <div className="bg-gray-100 py-10 px-4">
      <form className="bg-white max-w-xl mx-auto p-6 rounded-lg shadow space-y-6">
        <h2 className="text-xl font-bold text-center text-indigo-700">Create Your Profile</h2>

        {/* Profile Picture */}
        <div>
          <label className="block font-medium mb-1">Profile Picture</label>
          <input type="file" onChange={(e) => handleImageUpload(e, setProfilePic)} className="w-full" />
          {profilePic && <img src={profilePic} alt="Profile" className="w-20 h-20 rounded-full mt-2" />}
        </div>

        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded resize-none"
            placeholder="Tell us about yourself"
          />
        </div>

        {/* Education Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-indigo-600">Education</h3>

          {['tenth', 'twelfth', 'graduation'].map(level => (
            <div key={level} className="space-y-2">
              <label className="block font-medium capitalize">{level}</label>
              <input
                type="text"
                placeholder={`${level === 'graduation' ? 'College' : 'School'} Name`}
                className="w-full p-2 border rounded"
                value={education[level].school || education[level].college}
                onChange={(e) => handleEduChange(level, 'school', e.target.value)}
              />
              <input
                type="text"
                placeholder="Year"
                className="w-full p-2 border rounded"
                value={education[level].year}
                onChange={(e) => handleEduChange(level, 'year', e.target.value)}
              />
              <input
                type="text"
                placeholder="CGPA"
                className="w-full p-2 border rounded"
                value={education[level].cgpa}
                onChange={(e) => handleEduChange(level, 'cgpa', e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
