const ClothingItem = require("../models/clothingItem");
// const {
//   BAD_REQUEST,
//   FORBIDDEN,
//   NOT_FOUND,
//   DEFAULT,
// } = require("../utils/errors");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const BadRequestError = require("../errors/BadRequestError");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      next(err);
      // return res.status(DEFAULT).send({
      //   message: `An error has occurred on the server ${res}`,
      // });
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
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        // return res.status(BAD_REQUEST).send({
        //   message: `${err.name} with the message ${err.message}`,
        // });
        next(new BadRequestError(`Validation error`));
      } else {
        next(err);
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: `An error has occurred on the server` });
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
        // return res.status(NOT_FOUND).send({
        //   message: `${err.name} with the message ${err.message}`,
        // });
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST).send({
        //   message: `${err.name} with the message ${err.message}`,
        // });
        next(new BadRequestError("Cast Error"));
      }
      next(err);
      // return res.status(DEFAULT).send({
      //   message: `An error has occurred on the server`,
      // });
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
        // return res.status(NOT_FOUND).send({
        //   message: `${err.name} with the message ${err.message}`,
        // });
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST).send({
        //   message: `${err.name} with the message ${err.message}`,
        // });
        next(new BadRequestError("Cast error"));
      }
      next(err);
      // return res.status(DEFAULT).send({
      //   message: `An error has occurred on the server`,
      // });
    });

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        next(new ForbiddenError("You can only delete your own items"));
        // return res
        //   .status(FORBIDDEN)
        //   .send({ message: "You can only delete your own items" });
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Successfully deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
        // return res.status(NOT_FOUND).send({
        //   message: `${err.name} with the message ${err.message}`,
        // });
      }
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST).send({
        //   message: `${err.name} with the message ${err.message}`,
        // });
        next(new BadRequestError("Cast error"));
      }
      next(err);
      // return res.status(DEFAULT).send({
      //   message: `An error has occurred on the server`,
      // });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  likeClothingItem,
  dislikeClothingItem,
  deleteClothingItem,
};
