const config = require("config");
const { CognitoJwtVerifier } = require("aws-jwt-verify");

module.exports = async function (req, res, next) {
  const configVerify = {
    userPoolId: config.get("userPool"),
    tokenUse: "access",
    clientId: config.get("clientId"),
    region: config.get("region"),
  };

  const verifier = CognitoJwtVerifier.create(configVerify);

  // Get token from header
  var token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ msg: "Authorization denied" });
  } else {
    token = token.replace("Bearer ", "");
  }

  // Verify token
  try {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // Zscaler sucks!
    payload = await verifier.verify(token);
    req.user = payload.user;
    next();
  } catch (err) {
    console.log("Token invalid:", err);
    res.status(401).json({ msg: "Authorization denied" });
  }
};
