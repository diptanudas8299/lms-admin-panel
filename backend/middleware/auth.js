const jwt = require('jsonwebtoken');

/**
 * Authentication & Authorization Middleware
 * - Verifies JWT
 * - Enforces role-based access (admin)
 * - Correctly distinguishes client vs server errors
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Authorization header check
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authorization header missing or malformed'
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(' ')[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Validate payload
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: 'Invalid token payload'
      });
    }

    // 5️⃣ Enforce role (VERY IMPORTANT)
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        message: 'Forbidden'
      });
    }

    // 6️⃣ Attach user to request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();

  } catch (error) {
    // Token expired → client must re-login
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    // Invalid token → client error
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Anything else → server bug (DO NOT lie with 401)
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      message: 'Internal authentication error'
    });
  }
};

module.exports = authMiddleware;
