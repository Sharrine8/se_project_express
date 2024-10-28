const ClothingItem = require("../models/clothingItem");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .send({ message: `${err.name} with the message ${err.message}` });
    });
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: "671c09510c5089144beb9553",
  })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${err.name} with the message ${err.message}`,
        });
      }
      return res
        .status(500)
        .send({ message: `${err.name} with the message ${err.message}` });
    });
};

const updateClothingItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .send({ message: `${err.name} with the message ${err.message}` });
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
        return res.status(404).send({
          message: `${err.name} with the message ${err.message}`,
        });
      }
      if (err.name === "CastError") {
        return res.status(400).send({
          message: `${err.name} with the message ${err.message}`,
        });
      } else {
        return res.status(500).send({
          message: `${err.name} with the message ${err.message}`,
        });
      }
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
        return res.status(404).send({
          message: `${err.name} with the message ${err.message}`,
        });
      }
      if (err.name === "CastError") {
        return res.status(400).send({
          message: `${err.name} with the message ${err.message}`,
        });
      } else {
        return res.status(500).send({
          message: `${err.name} with the message ${err.message}`,
        });
      }
    });

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndRemove({ _id: itemId })
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({
          message: `${err.name} with the message ${err.message}`,
        });
      }
      if (err.name === "CastError") {
        return res.status(400).send({
          message: `${err.name} with the message ${err.message}`,
        });
      } else {
        return res.status(500).send({
          message: `${err.name} with the message ${err.message}`,
        });
      }
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  updateClothingItem,
  likeClothingItem,
  dislikeClothingItem,
  deleteClothingItem,
};
