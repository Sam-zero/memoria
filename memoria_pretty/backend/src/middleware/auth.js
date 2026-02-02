const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token" });
        }

        const token = header.split(" ")[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = payload.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
