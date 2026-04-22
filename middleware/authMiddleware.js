const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  
  // Get token from cookie
  token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized to access this route' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, token failed' 
    });
  }
};

module.exports = { protect };