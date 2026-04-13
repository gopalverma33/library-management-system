const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const LEGACY_JWT_SECRET = "12345@abcd12";


const userAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({error: true, message: "Access Denied: No token provided" });
  }

  const token = authHeader.split(" ")[1]; 

  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not configured" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (primaryError) {
      // Backward compatibility for previously issued tokens.
      decoded = jwt.verify(token, LEGACY_JWT_SECRET);
    }
    req.userInfo = decoded; 
    next(); 
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });

  }
};


module.exports = {userAuth}
