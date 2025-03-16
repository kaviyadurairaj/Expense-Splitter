
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authMiddleware = async (req, res, next) => {
  try {
    console.log("🔹 Request Headers:", req.headers);  

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in environment variables!");
      return res.status(500).json({ message: "Server error: Missing JWT secret" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No token received in request");
      return res.status(401).json({ message: "Access denied, no token provided" });
    }

    const token = authHeader.split(" ")[1];  // Extract token after "Bearer "
    console.log("🟢 Extracted Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Decoded:", decoded);

    if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
      console.error("❌ Invalid User ID:", decoded.id);
      return res.status(401).json({ message: "Invalid token structure" });
    }

    req.user = { id: decoded.id };
    console.log("✅ User Authenticated:", req.user);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error("❌ Token Expired:", error.message);
      return res.status(401).json({ message: "Session expired, please log in again" });
    }

    console.error("❌ Token Verification Failed:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
