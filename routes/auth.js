const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/signup
// @desc    Register a user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all fields' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters' 
      });
    }
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }
    
    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});

// @route   GET /api/auth/dashboard-data
// @desc    Get dashboard data (protected)
router.get('/dashboard-data', protect, (req, res) => {
  const principles = [
    "1. Prevention - It's better to prevent waste than to treat it",
    "2. Atom Economy - Synthetic methods should maximize incorporation of materials",
    "3. Less Hazardous Synthesis - Use less toxic substances",
    "4. Designing Safer Chemicals - Minimize toxicity while maintaining function",
    "5. Safer Solvents & Auxiliaries - Avoid solvents or use benign ones",
    "6. Energy Efficiency - Recognize environmental impacts of energy",
    "7. Renewable Feedstocks - Use renewable raw materials",
    "8. Reduce Derivatives - Avoid unnecessary derivatization",
    "9. Catalysis - Use catalytic reagents",
    "10. Design for Degradation - Design chemicals that degrade",
    "11. Real-time Analysis - Monitor to prevent pollution",
    "12. Inherently Safer Chemistry - Minimize chemical accidents"
  ];
  
  const greenTechExamples = [
    "🌞 Solar photovoltaic cells - Converting sunlight to electricity",
    "♻️ Biodegradable polymers - Plastic alternatives from corn starch",
    "🌍 Carbon capture & storage - Removing CO2 from atmosphere",
    "💧 Green hydrogen fuel - Clean energy from water electrolysis",
    "🔬 Plastic recycling technologies - Chemical recycling of waste",
    "🌱 Biofuels from algae - Renewable energy source",
    "🏗️ Green building materials - Recycled and sustainable construction"
  ];
  
  res.json({
    success: true,
    principles: principles,
    greenTechExamples: greenTechExamples,
    message: "Welcome to Green Technology Dashboard"
  });
});

module.exports = router;