import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Education() {
  const [educationData, setEducationData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    degree: '',
    department: '',
    currentCollege: '',
    batchYear: '',
    startDate: '',
    endDate: '',
    dob: '',
    graduationPercentage: '',
    description: '',
    percentage_10th: {
      percentage: '',
      college: '',
      startDate: ''
    },
    percentage_12th: {
      percentage: '',
      college: '',
      startDate: ''
    }
  });

  useEffect(() => {
    fetchEducationData();
  }, []);

  const fetchEducationData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/education/me`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.education) {
          setEducationData(data.education);
          // Populate form with existing data
          const edu = data.education;
          setFormData({
            degree: edu.degree || '',
            department: edu.department || '',
            currentCollege: edu.currentCollege || '',
            batchYear: edu.batchYear || '',
            startDate: edu.startDate ? edu.startDate.split('T')[0] : '',
            endDate: edu.endDate ? edu.endDate.split('T')[0] : '',
            dob: edu.dob ? edu.dob.split('T')[0] : '',
            graduationPercentage: edu.graduationPercentage || '',
            description: edu.description || '',
            percentage_10th: {
              percentage: edu.percentage_10th?.percentage || '',
              college: edu.percentage_10th?.college || '',
              startDate: edu.percentage_10th?.startDate ? edu.percentage_10th.startDate.split('T')[0] : ''
            },
            percentage_12th: {
              percentage: edu.percentage_12th?.percentage || '',
              college: edu.percentage_12th?.college || '',
              startDate: edu.percentage_12th?.startDate ? edu.percentage_12th.startDate.split('T')[0] : ''
            }
          });
        }
      } else if (response.status !== 404) {
        setError('Failed to load education data');
      }
    } catch (error) {
      console.error('Error fetching education data:', error);
      setError('Failed to load education data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const url = educationData 
        ? 'http://localhost:3000/education'
        : 'http://localhost:3000/education';
      
      const method = educationData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(educationData ? 'Education profile updated successfully!' : 'Education profile created successfully!');
        setIsEditing(false);
        fetchEducationData();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to save education data');
      }
    } catch (error) {
      console.error('Error saving education data:', error);
      setError('Failed to save education data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--dark-bg-primary)'}}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="linkedin-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading mb-2">Education Profile</h1>
              <p className="text-subheading">Showcase your academic achievements and educational background</p>
            </div>
            <div className="premium-badge">Premium Feature</div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="notification notification-success mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}

        {error && (
          <div className="notification notification-error mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {error}
          </div>
        )}

        {/* Education Profile */}
        {!educationData && !isEditing ? (
          <div className="linkedin-card p-8 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-heading mb-2">Create Your Education Profile</h2>
            <p className="text-body mb-6 max-w-md mx-auto">
              Add your educational background to help others understand your academic journey and connect with fellow students.
            </p>
            <button 
              onClick={() => setIsEditing(true)}
              className="btn-linkedin px-8 py-3"
            >
              Add Education Details
            </button>
          </div>
        ) : (
          <>
            {/* Current Education Profile View */}
            {educationData && !isEditing && (
              <div className="space-y-6">
                {/* Current Education */}
                <div className="premium-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-heading">Current Education</h2>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="btn-secondary px-4 py-2"
                    >
                      Edit Profile
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{educationData.degree}</h3>
                      <p className="text-gray-600">{educationData.department}</p>
                      <p className="text-gray-600">{educationData.currentCollege}</p>
                      <p className="text-small text-gray-500 mt-2">Batch: {educationData.batchYear}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-small"><span className="font-medium">Duration:</span> {educationData.startDate ? new Date(educationData.startDate).getFullYear() : 'N/A'} - {educationData.endDate ? new Date(educationData.endDate).getFullYear() : 'Present'}</p>
                      {educationData.graduationPercentage && (
                        <p className="text-small"><span className="font-medium">GPA:</span> {educationData.graduationPercentage}%</p>
                      )}
                      <p className="text-small"><span className="font-medium">DOB:</span> {educationData.dob ? new Date(educationData.dob).toLocaleDateString() : 'Not provided'}</p>
                    </div>
                  </div>
                  
                  {educationData.description && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-body">{educationData.description}</p>
                    </div>
                  )}
                </div>

                {/* Previous Education */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 12th Grade */}
                  {educationData.percentage_12th?.college && (
                    <div className="linkedin-card p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">12th Grade</h3>
                      <div className="space-y-2">
                        <p className="text-body">{educationData.percentage_12th.college}</p>
                        {educationData.percentage_12th.percentage && (
                          <p className="text-small text-green-600 font-medium">
                            {educationData.percentage_12th.percentage}%
                          </p>
                        )}
                        {educationData.percentage_12th.startDate && (
                          <p className="text-small text-gray-500">
                            {new Date(educationData.percentage_12th.startDate).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 10th Grade */}
                  {educationData.percentage_10th?.college && (
                    <div className="linkedin-card p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">10th Grade</h3>
                      <div className="space-y-2">
                        <p className="text-body">{educationData.percentage_10th.college}</p>
                        {educationData.percentage_10th.percentage && (
                          <p className="text-small text-green-600 font-medium">
                            {educationData.percentage_10th.percentage}%
                          </p>
                        )}
                        {educationData.percentage_10th.startDate && (
                          <p className="text-small text-gray-500">
                            {new Date(educationData.percentage_10th.startDate).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Edit Form */}
            {isEditing && (
              <div className="linkedin-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-heading">
                    {educationData ? 'Edit Education Profile' : 'Create Education Profile'}
                  </h2>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Current Education */}
                  <div>
                    <h3 className="text-subheading mb-4">Current Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="form-label">Degree *</label>
                        <input
                          type="text"
                          name="degree"
                          value={formData.degree}
                          onChange={handleInputChange}
                          className="input-linkedin w-full"
                          placeholder="e.g., Bachelor of Technology"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Department *</label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="input-linkedin w-full"
                          placeholder="e.g., Computer Science Engineering"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">College/University *</label>
                        <input
                          type="text"
                          name="currentCollege"
                          value={formData.currentCollege}
                          onChange={handleInputChange}
                          className="input-linkedin w-full"
                          placeholder="e.g., IIT Delhi"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Batch Year *</label>
                        <input
                          type="text"
                          name="batchYear"
                          value={formData.batchYear}
                          onChange={handleInputChange}
                          className="input-linkedin w-full"
                          placeholder="e.g., 2024"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="input-linkedin w-full"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">End Date *</label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="input-linkedin w-full"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Date of Birth *</label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="input-linkedin w-full"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Current GPA/Percentage</label>
                        <input
                          type="number"
                          name="graduationPercentage"
                          value={formData.graduationPercentage}
                          onChange={handleInputChange}
                          className="input-linkedin w-full"
                          placeholder="e.g., 85"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="input-linkedin w-full h-24"
                        placeholder="Describe your academic achievements, projects, or any additional information..."
                      />
                    </div>
                  </div>

                  {/* 12th Grade */}
                  <div>
                    <h3 className="text-subheading mb-4">12th Grade Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="form-label">School/College</label>
                        <input
                          type="text"
                          name="percentage_12th.college"
                          value={formData.percentage_12th.college}
                          onChange={handleInputChange}
                          className="input-linkedin w-full"
                          placeholder="e.g., XYZ Senior Secondary School"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Percentage</label>
                        <input
                          type="number"
                          name="percentage_12th.percentage"
                          value={formData.percentage_12th.percentage}
                          onChange={handleInputChange}
                          className="input-linkedin w-full"
                          placeholder="e.g., 92"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Year of Completion</label>
                        <input
                          type="date"
                          name="percentage_12th.startDate"
                          value={formData.percentage_12th.startDate}
                          onChange={handleInputChange}
                          className="input-linkedin w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 10th Grade */}
                  <div>
                    <h3 className="text-subheading mb-4">10th Grade Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="form-label">School</label>
                        <input
                          type="text"
                          name="percentage_10th.college"
                          value={formData.percentage_10th.college}
                          onChange={handleInputChange}
                          className="input-linkedin w-full"
                          placeholder="e.g., ABC High School"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Percentage</label>
                        <input
                          type="number"
                          name="percentage_10th.percentage"
                          value={formData.percentage_10th.percentage}
                          onChange={handleInputChange}
                          className="input-linkedin w-full"
                          placeholder="e.g., 88"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Year of Completion</label>
                        <input
                          type="date"
                          name="percentage_10th.startDate"
                          value={formData.percentage_10th.startDate}
                          onChange={handleInputChange}
                          className="input-linkedin w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary px-6 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-linkedin px-8 py-2 flex items-center space-x-2"
                    >
                      {saving && <div className="spinner w-4 h-4"></div>}
                      <span>{saving ? 'Saving...' : (educationData ? 'Update Profile' : 'Create Profile')}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
