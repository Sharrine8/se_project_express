const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  DEFAULT,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT)
        .send({ message: `An error has occurred on the server` });
    });
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
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

const likeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((updatedData) => {
      res.send(updatedData);
    })
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

const dislikeClothingItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail()
    .then((updatedData) => res.send(updatedData))
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

const deleteClothingItem = (req, res) => {
  console.log(req.body);
  console.log(req.user);
  const { itemId } = req.params;
  ClothingItem.findByIdAndRemove({ _id: itemId })
    .orFail()
    .then((item) => {
      return res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({
          message: `${err.name} with the message ${err.message}`,
        });
      }
      if (err.name === "ForbiddenError") {
        return res.status(FORBIDDEN).send({
          message: "You can only delete items that are yours",
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

module.exports = {
  getClothingItems,
  createClothingItem,
  likeClothingItem,
  dislikeClothingItem,
  deleteClothingItem,
};
