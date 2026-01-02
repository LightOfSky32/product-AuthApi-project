const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied, authorization header missing or malformed " })
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.jwt_secret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error verifying token:", error)
        return res.status(401).json({ message: "invalid or expired token"})
    }
};

module.exports = isAuth;