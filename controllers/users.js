const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  CONFLICT,
  AUTH_ERROR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "The password and email fields are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res.status(AUTH_ERROR).send({
          message: err.message,
        });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
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
        return res.status(CONFLICT).send({
          message: `Email is already in use`,
        });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: `${err.name} with the message ${err.message}`,
        });
      }
      return res
        .status(DEFAULT)
        .send({ message: `An error has occurred on the server` });
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
        return res.status(BAD_REQUEST).send({
          message: `${err.name} with the message ${err.message}`,
        });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({
          message: "User not found",
        });
      }
      return res.status(DEFAULT).send({
        message: "An error has occured on the server",
      });
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
        return res.status(BAD_REQUEST).send({
          message: `${err.name} with the message ${err.message}`,
        });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = { createUser, getCurrentUser, updateUser, login };
