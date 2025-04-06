// authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];  // Get token from 'Bearer <token>'

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      req.body.userId = decoded.id; // Ensure that userId is correctly set in the request body
      next();  // Proceed to the next middleware or controller
    });
  } catch (error) {
    res.status(401).json({ message: "Auth Failed. Invalid token." });
  }
};

module.exports = authMiddleware;
