import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Resident from "../models/Resident.js";

/* ================= Protect Routes ================= */
export const protect = async (req, res, next) => {
  let token;

  try {
    // Check Authorization header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      // Verify JWT
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Fetch user from DB (exclude password)
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ message: "User not found" });

      req.user = user;

      // If user is a resident, attach resident profile
      if (user.role?.toLowerCase() === "resident") {
        const resident = await Resident.findOne({ user: user._id })
          .populate("hostel", "name location image amenities")
          .populate("assignedWarden", "user name email");

        req.resident = resident || null;
      }

      next();
    } else {
      return res.status(401).json({ message: "No token provided" });
    }
  } catch (err) {
    console.error("Protect Middleware Error:", err.message);
    return res.status(401).json({ message: "Not authorized" });
  }
};

/* ================= Role-Based Authorization ================= */
export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  // Make roles case-insensitive
  const userRole = req.user.role?.toLowerCase();
  const rolesLower = allowedRoles.map((r) => r.toLowerCase());

  // Debug logging
  console.log("User Role:", req.user.role, "| Allowed Roles:", allowedRoles);

  if (!rolesLower.includes(userRole)) {
    return res
      .status(403)
      .json({ message: "Access forbidden: insufficient role" });
  }

  next();
};
