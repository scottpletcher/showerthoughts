const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async function (req, res, next) {
  
  // Get token from header
  var token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ msg: "Authorization denied" });
  } else {
    token = token.replace("Bearer ", "");
  }

  // Verify token
  try {
    await jwt.verify(token, config.get("jwtSecret"), (error, decoded) => {
      if (error) {
        res.status(401).json({ msg: "Token is not valid" });
      } else {
        req.user = decoded.user; // decoded.user  equals user's id
        next();
      }
    });
  } catch (err) {
    console.error("Middleware error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};
