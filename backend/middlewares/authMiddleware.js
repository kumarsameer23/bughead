// File: backend/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  // Check if the token exists
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided, authorization denied." });
  }

  // The header is typically in the format "Bearer TOKEN", so we split to get the token part
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format, authorization denied." });
  }

  try {
    // Verify the token using the JWT secret from your .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    
    // Attach the decoded user ID to the request object
    req.userId = decoded.id;
    next(); // Pass the request to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: "Token is not valid, authorization denied." });
  }

};

export default verifyToken;
