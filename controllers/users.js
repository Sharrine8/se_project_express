const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const AuthError = require("../errors/AuthError");
const ConflictError = require("../errors/ConflictError");
const { JWT_SECRET } = require("../utils/config");

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("The password and email fields are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({
        token,
        user: {
          name: user.name,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        next(new AuthError("Incorrect email or password"));
      }
      next(err);
    });
};

const createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name, avatar }))
    .then((user) =>
      res.send({
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        next(new ConflictError("Email is already in use"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      }
      next(err);
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      const { _id, email, avatar, name } = user;
      res.send({ _id, email, avatar, name });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      }
      next(err);
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { runValidators: true }
  )
    .orFail()
    .then((user) => {
      const { _id, email } = user;
      return res.send({ _id, email, name, avatar });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      }
      next(err);
    });
};

module.exports = { createUser, getCurrentUser, updateUser, login };
