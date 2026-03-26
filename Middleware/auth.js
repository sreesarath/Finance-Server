const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("❌ No Authorization header");
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    console.log("🔐 TOKEN RECEIVED:", token);
    console.log("🔑 SECRET USED:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ DECODED:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ JWT ERROR:", err.message); // ⭐ THIS IS THE KEY
    res.status(401).json({ message: "Unauthorized" });
  }
};
