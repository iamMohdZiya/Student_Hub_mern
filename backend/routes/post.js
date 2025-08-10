const express = require('express');
const router = express.Router();
const { checkForAthenticationCookie } = require('../middleware/auth');
const { postUpload } = require('../middleware/multerConfig');
const {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  updatePost,
  deletePost
} = require('../controller/postController');

// Create a new post with image upload
router.post(
  '/',
  checkForAthenticationCookie('token'),
  postUpload.single('image'),
  createPost
);

// Get all posts
router.get('/', getAllPosts);

// Get current user's posts (must come before /:postId to avoid conflicts)
router.get('/my-posts', checkForAthenticationCookie('token'), getPostsByUser);

// Get posts by user ID  
router.get('/user/:userId', getPostsByUser);

// Get a single post by ID
router.get('/:postId', getPostById);

// Update a post with optional image upload
router.put(
  '/:postId',
  checkForAthenticationCookie('token'),
  postUpload.single('image'),
  updatePost
);

// Delete a post
router.delete('/:postId', checkForAthenticationCookie('token'), deletePost);

module.exports = router;