import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

const protect = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Not authorized. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = verifyToken(token);

    // 3. Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 'User no longer exists.', 401);
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired. Please log in again.', 401);
    }
    return errorResponse(res, 'Not authorized.', 401);
  }
};

export default protect;
