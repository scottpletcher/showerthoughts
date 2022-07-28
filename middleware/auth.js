const { CognitoJwtVerifier } = require("aws-jwt-verify");

module.exports = async function (req, res, next) {
  const configVerify = {
    userPoolId: process.env.USERPOOL,
    tokenUse: "access",
    clientId: process.env.CLIENTID,
    region: process.env.REGION,
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
    //    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; 
    payload = await verifier.verify(token);
    req.username = payload.username;
    next();
  } catch (err) {
    console.log("Token invalid:", err);
    res.status(401).json({ msg: "Authorization denied" });
  }
};
