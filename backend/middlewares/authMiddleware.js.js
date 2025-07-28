import jwt from "jsonwebtoken";

const protectRoute = (req, res, next) => {
  const token = req.cookies.jwt; 
  if (!token) return res.status(401).json({ error: "Authentication token required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });
    req.user = decoded; 
    next();
  });
};

export default protectRoute;
