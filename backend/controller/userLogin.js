const User = require('../model/user');
const Education = require('../model/education');

exports.handleSignIn = async (req, res) => {
  const { email, password } = req.body;
  
  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    
    // Get user data for response
    const user = await User.findOne({ email }).select('-password -salt');
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000 // 1 hour
    }).status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profileImage: user.profileImage,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message });
  }
};

exports.handleLogout = (req, res) => {
  res.clearCookie('token').redirect('/');
};

exports.handleSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  
  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }
  
  // Password strength validation
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    const user = new User({ name, email, password });
    await user.save();
    
    res.status(201).json({ 
      message: 'Account created successfully! Your account is pending admin approval.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    res.status(500).json({ message: 'Error creating account. Please try again.' });
  }
};

exports.addEducation = async (req, res) => {
  const {
    degree,
    dob,
    department,
    batchYear,
    endDate,
    currentCollege,
    description,
    percentage_10th,
    percentage_12th,
    graduationPercentage
  } = req.body;
 const userId = req.user?._id;
  try {
    const education = new Education({
      userId: userId,
      degree,
      dob,
      department,
      batchYear,
      endDate,
      currentCollege,
      description,
      percentage_10th,
      percentage_12th,
      graduationPercentage
    });

    await education.save();
    res.status(201).json({ message: 'Education added successfully' });

  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({ message: 'Error adding education' });
  }
};



exports.updateEducation = async (req, res) => {
  const {
    educationId,
    degree,
    dob,
    department,
    batchYear,
    endDate,
    currentCollege,
    description,
    percentage_10th,
    percentage_12th,
    graduationPercentage
  } = req.body;

  try {
    const education = await Education.findById(educationId);
    if (!education) {
      return res.status(404).json({ message: 'Education entry not found' });
    }

    education.degree = degree;
    education.dob = dob;
    education.department = department;
    education.batchYear = batchYear;
    education.endDate = endDate;
    education.currentCollege = currentCollege;
    education.description = description;
    education.percentage_10th = percentage_10th;
    education.percentage_12th = percentage_12th;
    education.graduationPercentage = graduationPercentage;

    await education.save();
    res.status(200).json({ message: 'Education updated successfully' });

  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ message: 'Error updating education' });
  }
};


// Get education data for a user
exports.getEducation = async (req, res) => {
  // Get userId from either request params, query, or authenticated user
  const userIdToUse = req.params.userId || req.query.userId || (req.user && req.user.id);
  const educationId = req.params.educationId || req.query.educationId;

  if (!userIdToUse) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // First check if user exists
    const user = await User.findById(userIdToUse);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If educationId is provided, get that specific education record
    if (educationId) {
      const education = await Education.findById(educationId);
      if (!education) {
        return res.status(404).json({ message: 'Education record not found' });
      }
      // Verify the education record belongs to this user
      if (education.userId.toString() !== userIdToUse.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this education record' });
      }
      return res.status(200).json(education);
    }

    // Otherwise, get all education records for this user
    const educations = await Education.find({ userId: userIdToUse });
    res.status(200).json(educations);

  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json({ message: 'Error retrieving education data' });
  }
};

// Delete an education record
exports.deleteEducation = async (req, res) => {
  // Get userId from authenticated user
  const userIdToUse = req.user && req.user.id;
  const educationId = req.params.educationId || req.body.educationId;

  if (!userIdToUse) {
    return res.status(400).json({ message: 'Authentication required' });
  }

  if (!educationId) {
    return res.status(400).json({ message: 'Education ID is required' });
  }

  try {
    // Find the education record
    const education = await Education.findById(educationId);
    if (!education) {
      return res.status(404).json({ message: 'Education record not found' });
    }

    // Verify the education record belongs to this user
    if (education.userId.toString() !== userIdToUse.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this education record' });
    }

    // Delete the education record
    await Education.findByIdAndDelete(educationId);
    res.status(200).json({ message: 'Education record deleted successfully' });

  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ message: 'Error deleting education record' });
  }
};

// Get approved users for public access (Explore page)
exports.getApprovedUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    // Build filter query for approved users only
    let filter = { status: 'approved' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password -salt -email') // Don't expose sensitive information
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
    console.error('Get approved users error:', error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
};
