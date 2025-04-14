const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const AuthError = require("../errors/AuthError");

function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthError("Authorization required");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthError("Unverified token");
  }
  req.user = payload;
  return next();
}

module.exports = auth;
