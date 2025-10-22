// routes/authMiddleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded user info (like id, role)
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Role-based access control
export const isPatient = (req, res, next) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({ message: "Access denied. Patients only." });
  }
  next();
};

export const isDonor = (req, res, next) => {
  if (req.user.role !== "donor") {
    return res.status(403).json({ message: "Access denied. Donors only." });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
