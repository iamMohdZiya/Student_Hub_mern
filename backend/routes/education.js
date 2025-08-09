const express = require('express');
const router = express.Router();
const {
  createEducationProfile,
  updateEducationProfile,
  getEducationProfile,
  getAllEducationProfiles,
  deleteEducationProfile,
  getEducationStats
} = require('../controller/educationController');

const { checkForAthenticationCookie } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');

// Protected routes - require authentication
router.post('/', checkForAthenticationCookie('token'), createEducationProfile);
router.put('/', checkForAthenticationCookie('token'), updateEducationProfile);
router.delete('/', checkForAthenticationCookie('token'), deleteEducationProfile);

// Get current user's education profile
router.get('/me', checkForAthenticationCookie('token'), (req, res, next) => {
  req.params.userId = req.user._id;
  next();
}, getEducationProfile);

// Public routes
router.get('/browse', getAllEducationProfiles);
router.get('/:userId', getEducationProfile);

// Admin routes
router.get('/admin/stats', checkForAthenticationCookie('token'), isAdmin, getEducationStats);

module.exports = router;
