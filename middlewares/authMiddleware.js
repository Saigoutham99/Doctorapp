const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token missing", success: false });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err.message);
                return res.status(401).json({ message: "Invalid or expired token", success: false });
            }

            req.body.userId = decoded.id; 
            next();
        });

    } catch (error) {
        res.status(401).json({ message: "Auth Failed. Invalid token.", success: false });
    }
};

module.exports = authMiddleware;
