const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserStats,
  approveUser,
  rejectUser,
  deleteUser,
  getPendingUsers,
  getUserDetails,
  updateUserRole,
  bulkApproveUsers,
  bulkRejectUsers
} = require('../controller/adminController');

const { checkForAthenticationCookie } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');

// Apply authentication and admin check to all routes
router.use(checkForAthenticationCookie('token'));
router.use(isAdmin);

// Dashboard statistics
router.get('/stats', getUserStats);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/pending', getPendingUsers);
router.get('/users/:userId', getUserDetails);
router.delete('/users/:userId', deleteUser);

// User approval/rejection routes
router.put('/users/:userId/approve', approveUser);
router.put('/users/:userId/reject', rejectUser);
router.put('/users/:userId/role', updateUserRole);

// Bulk operations
router.put('/users/bulk/approve', bulkApproveUsers);
router.put('/users/bulk/reject', bulkRejectUsers);

module.exports = router;

