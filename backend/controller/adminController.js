const User = require('../model/user');
const Education = require('../model/education');

// Get all users for admin
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    // Build filter query
    let filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password -salt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalUsers: total
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
};

// Get user statistics for admin dashboard
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingUsers = await User.countDocuments({ status: 'pending' });
    const approvedUsers = await User.countDocuments({ status: 'approved' });
    const rejectedUsers = await User.countDocuments({ status: 'rejected' });
    const adminUsers = await User.countDocuments({ role: 'ADMIN' });

    // Recent signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSignups = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      totalUsers,
      pendingUsers,
      approvedUsers,
      rejectedUsers,
      adminUsers,
      recentSignups
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Error retrieving user statistics' });
  }
};

// Approve a user
exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { status: 'approved' },
      { new: true }
    ).select('-password -salt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User approved successfully',
      user
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Error approving user' });
  }
};

// Reject a user
exports.rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        status: 'rejected',
        rejectionReason: reason || 'No reason provided'
      },
      { new: true }
    ).select('-password -salt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User rejected successfully',
      user
    });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ message: 'Error rejecting user' });
  }
};

// Delete a user (with their education data)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // First check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    // Delete user's education records first
    await Education.deleteMany({ userId: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: 'User and associated data deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Get pending users for approval
exports.getPendingUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const users = await User.find({ status: 'pending' })
      .select('-password -salt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ status: 'pending' });

    res.status(200).json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalPending: total
    });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ message: 'Error retrieving pending users' });
  }
};

// Get user details with education
exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password -salt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const education = await Education.find({ userId: userId });

    res.status(200).json({
      user,
      education
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Error retrieving user details' });
  }
};

// Update user role (promote to admin or demote to user)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be USER or ADMIN' });
    }

    // Prevent admin from demoting themselves
    if (userId === req.user.id && role === 'USER') {
      return res.status(400).json({ message: 'You cannot demote yourself' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password -salt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: `User role updated to ${role} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
};

// Bulk approve users
exports.bulkApproveUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs array is required' });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { status: 'approved' }
    );

    res.status(200).json({
      message: `${result.modifiedCount} users approved successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk approve users error:', error);
    res.status(500).json({ message: 'Error approving users' });
  }
};

// Bulk reject users
exports.bulkRejectUsers = async (req, res) => {
  try {
    const { userIds, reason } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs array is required' });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { 
        status: 'rejected',
        rejectionReason: reason || 'No reason provided'
      }
    );

    res.status(200).json({
      message: `${result.modifiedCount} users rejected successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk reject users error:', error);
    res.status(500).json({ message: 'Error rejecting users' });
  }
};
