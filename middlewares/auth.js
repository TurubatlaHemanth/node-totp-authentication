import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authToken = req.cookies?.access_token;

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
