const User = require("../models/user");
const bcrypt = require("bcryptjs");
const {
  BAD_REQUEST,
  AUTH_ERROR,
  NOT_FOUND,
  DEFAULT,
  CONFLICT,
} = require("../utils/errors");
const JWT_SECRET = require("../utils/config");
const jwt = require("jsonwebtoken");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT)
        .send({ message: `An error has occurred on the server` });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(AUTH_ERROR).send({
        message: err.message,
      });
    });
};

//check that there's not already an existing user email
//email se to user, the user.create will throw a
//11000 MongoDB duplicate error -- handle this error
//in a throw block and return a corresponding err msg
const createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name, avatar }))
    .then((user) =>
      res.send({ name: user.name, email: user.email, avatar: user.avatar })
    )
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res.status(CONFLICT).send({
          message: `Email is already in use`,
        });
      } else if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: `${err.name} with the message ${err.message}`,
        });
      }
      return res
        .status(DEFAULT)
        .send({ message: `An error has occurred on the server` });
    });
};

const getUserById = (req, res) => {
  console.log(req.params);
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({
          message: `${err.name} with the message ${err.message}`,
        });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: `${err.name} with the message ${err.message}`,
        });
      }
      return res.status(DEFAULT).send({
        message: `An error has occurred on the server`,
      });
    });
};

module.exports = { getUsers, createUser, getUserById, login };
