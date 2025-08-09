const Education = require('../model/education');
const User = require('../model/user');

// Create education profile
const createEducationProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const educationData = { ...req.body, userId };
    
    // Check if education profile already exists
    const existingEducation = await Education.findOne({ userId });
    if (existingEducation) {
      return res.status(400).json({ message: 'Education profile already exists. Use update instead.' });
    }
    
    const education = new Education(educationData);
    await education.save();
    
    await education.populate('userId', 'name email profileImage');
    
    res.status(201).json({
      message: 'Education profile created successfully',
      education
    });
  } catch (error) {
    console.error('Error creating education profile:', error);
    res.status(500).json({ message: 'Failed to create education profile', error: error.message });
  }
};

// Update education profile
const updateEducationProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;
    
    const education = await Education.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email profileImage');
    
    if (!education) {
      return res.status(404).json({ message: 'Education profile not found' });
    }
    
    res.json({
      message: 'Education profile updated successfully',
      education
    });
  } catch (error) {
    console.error('Error updating education profile:', error);
    res.status(500).json({ message: 'Failed to update education profile', error: error.message });
  }
};

// Get education profile by user ID
const getEducationProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const targetUserId = userId || req.user._id;
    
    const education = await Education.findOne({ userId: targetUserId })
      .populate('userId', 'name email profileImage bio');
    
    if (!education) {
      return res.status(404).json({ message: 'Education profile not found' });
    }
    
    res.json({ education });
  } catch (error) {
    console.error('Error fetching education profile:', error);
    res.status(500).json({ message: 'Failed to fetch education profile', error: error.message });
  }
};

// Get all education profiles (for browse/discover)
const getAllEducationProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 10, department, batchYear, degree } = req.query;
    
    const filter = {};
    if (department) filter.department = new RegExp(department, 'i');
    if (batchYear) filter.batchYear = batchYear;
    if (degree) filter.degree = new RegExp(degree, 'i');
    
    const educations = await Education.find(filter)
      .populate('userId', 'name email profileImage bio status')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    // Filter out non-approved users
    const approvedEducations = educations.filter(edu => 
      edu.userId && edu.userId.status === 'approved'
    );
    
    const total = await Education.countDocuments(filter);
    
    res.json({
      educations: approvedEducations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching education profiles:', error);
    res.status(500).json({ message: 'Failed to fetch education profiles', error: error.message });
  }
};

// Delete education profile
const deleteEducationProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const education = await Education.findOneAndDelete({ userId });
    
    if (!education) {
      return res.status(404).json({ message: 'Education profile not found' });
    }
    
    res.json({ message: 'Education profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting education profile:', error);
    res.status(500).json({ message: 'Failed to delete education profile', error: error.message });
  }
};

// Get education statistics for admin
const getEducationStats = async (req, res) => {
  try {
    const totalProfiles = await Education.countDocuments();
    
    const departmentStats = await Education.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const batchStats = await Education.aggregate([
      { $group: { _id: '$batchYear', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    
    const degreeStats = await Education.aggregate([
      { $group: { _id: '$degree', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      totalProfiles,
      departmentStats,
      batchStats,
      degreeStats
    });
  } catch (error) {
    console.error('Error fetching education stats:', error);
    res.status(500).json({ message: 'Failed to fetch education statistics', error: error.message });
  }
};

module.exports = {
  createEducationProfile,
  updateEducationProfile,
  getEducationProfile,
  getAllEducationProfiles,
  deleteEducationProfile,
  getEducationStats
};
