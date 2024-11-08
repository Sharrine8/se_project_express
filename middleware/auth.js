const jwt = require("jsonwebtoken");
const { AUTH_ERROR } = require("../utils/errors");

function authorization(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(AUTH_ERROR).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(AUTH_ERROR).send({ message: "Authorization required" });
  }
  req.user = payload;
  next();
}

module.exports = {
  authorization,
};
