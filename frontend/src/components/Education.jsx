import { useState, useEffect } from 'react';
import apiService from '../services/api';

export default function Education({ isOwner = false }) {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
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
    description: '',
    graduationPercentage: '',
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
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEducation();
      setEducations(response.data || []);
    } catch (error) {
      console.error('Error fetching educations:', error);
      setEducations([]);
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
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      degree: '',
      department: '',
      currentCollege: '',
      batchYear: '',
      startDate: '',
      endDate: '',
      dob: '',
      description: '',
      graduationPercentage: '',
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
    setEditingEducation(null);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = { ...formData };
      if (editingEducation) {
        payload.educationId = editingEducation._id;
      }

      if (editingEducation) {
        await apiService.updateEducation(payload);
        setSuccess('Education updated successfully!');
      } else {
        await apiService.addEducation(payload);
        setSuccess('Education added successfully!');
      }

      resetForm();
      fetchEducations();
    } catch (error) {
      setError(error.message || 'Failed to save education');
    }
  };

  const handleEdit = (education) => {
    setEditingEducation(education);
    setFormData({
      degree: education.degree || '',
      department: education.department || '',
      currentCollege: education.currentCollege || '',
      batchYear: education.batchYear || '',
      startDate: education.startDate ? new Date(education.startDate).toISOString().split('T')[0] : '',
      endDate: education.endDate ? new Date(education.endDate).toISOString().split('T')[0] : '',
      dob: education.dob ? new Date(education.dob).toISOString().split('T')[0] : '',
      description: education.description || '',
      graduationPercentage: education.graduationPercentage || '',
      percentage_10th: {
        percentage: education.percentage_10th?.percentage || '',
        college: education.percentage_10th?.college || '',
        startDate: education.percentage_10th?.startDate ? 
          new Date(education.percentage_10th.startDate).toISOString().split('T')[0] : ''
      },
      percentage_12th: {
        percentage: education.percentage_12th?.percentage || '',
        college: education.percentage_12th?.college || '',
        startDate: education.percentage_12th?.startDate ? 
          new Date(education.percentage_12th.startDate).toISOString().split('T')[0] : ''
      }
    });
    setShowForm(true);
  };

  const handleDelete = async (educationId) => {
    if (!window.confirm('Are you sure you want to delete this education record?')) {
      return;
    }

    try {
      await apiService.deleteEducation(educationId);
      setSuccess('Education deleted successfully!');
      fetchEducations();
    } catch (error) {
      setError(error.message || 'Failed to delete education');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Education</h3>
        {isOwner && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Education</span>
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && isOwner && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            {editingEducation ? 'Edit Education' : 'Add Education'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree *
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bachelor of Technology"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College/University *
                </label>
                <input
                  type="text"
                  name="currentCollege"
                  value={formData.currentCollege}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., ABC University"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Year *
                </label>
                <input
                  type="text"
                  name="batchYear"
                  value={formData.batchYear}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2020-2024"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Percentage
                </label>
                <input
                  type="number"
                  name="graduationPercentage"
                  value={formData.graduationPercentage}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 85.5"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>

            {/* 10th Grade Details */}
            <div className="border-t pt-4">
              <h5 className="text-md font-medium text-gray-800 mb-3">10th Grade Details</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Percentage
                  </label>
                  <input
                    type="number"
                    name="percentage_10th.percentage"
                    value={formData.percentage_10th.percentage}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 90.5"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School
                  </label>
                  <input
                    type="text"
                    name="percentage_10th.college"
                    value={formData.percentage_10th.college}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ABC High School"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    name="percentage_10th.startDate"
                    value={formData.percentage_10th.startDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 12th Grade Details */}
            <div className="border-t pt-4">
              <h5 className="text-md font-medium text-gray-800 mb-3">12th Grade Details</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Percentage
                  </label>
                  <input
                    type="number"
                    name="percentage_12th.percentage"
                    value={formData.percentage_12th.percentage}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 88.5"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School
                  </label>
                  <input
                    type="text"
                    name="percentage_12th.college"
                    value={formData.percentage_12th.college}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., XYZ Senior Secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    name="percentage_12th.startDate"
                    value={formData.percentage_12th.startDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                placeholder="Additional details about your education..."
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                {editingEducation ? 'Update Education' : 'Add Education'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Education List */}
      <div className="space-y-4">
        {educations.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-gray-500">No education records found</p>
            {isOwner && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your first education
              </button>
            )}
          </div>
        ) : (
          educations.map((education) => (
            <div key={education._id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{education.degree}</h4>
                      <p className="text-blue-600 font-medium">{education.currentCollege}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Department:</span> {education.department}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Batch:</span> {education.batchYear}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Duration:</span> {formatDate(education.startDate)} - {formatDate(education.endDate)}
                      </p>
                    </div>
                    <div>
                      {education.graduationPercentage && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Graduation %:</span> {education.graduationPercentage}%
                        </p>
                      )}
                      {education.percentage_12th?.percentage && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">12th Grade:</span> {education.percentage_12th.percentage}%
                          {education.percentage_12th.college && ` at ${education.percentage_12th.college}`}
                        </p>
                      )}
                      {education.percentage_10th?.percentage && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">10th Grade:</span> {education.percentage_10th.percentage}%
                          {education.percentage_10th.college && ` at ${education.percentage_10th.college}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {education.description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-700">{education.description}</p>
                    </div>
                  )}
                </div>

                {isOwner && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(education)}
                      className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(education._id)}
                      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
