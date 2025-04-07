const ClothingItem = require("../models/clothingItem");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const BadRequestError = require("../errors/BadRequestError");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      next(err);
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
        next(new BadRequestError(`Validation error`));
      } else {
        next(err);
      }
    });
};

const likeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((updatedData) => {
      res.send(updatedData);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Cast Error"));
      }
      next(err);
    });
};

const dislikeClothingItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail()
    .then((updatedData) => res.send(updatedData))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Cast error"));
      }
      next(err);
    });

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        next(new ForbiddenError("You can only delete your own items"));
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Successfully deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Cast error"));
      }
      next(err);
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  likeClothingItem,
  dislikeClothingItem,
  deleteClothingItem,
};
