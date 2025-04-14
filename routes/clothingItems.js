const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getClothingItems,
  createClothingItem,
  likeClothingItem,
  dislikeClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");
const {
  validateItemCreation,
  validateId,
} = require("../middlewares/validation");

// CRUD -- Create, Read, Update, Delete

router.post("/", auth, validateItemCreation, createClothingItem);

router.get("/", getClothingItems);

router.put("/:itemId/likes", auth, validateId, likeClothingItem);
router.delete("/:itemId/likes", auth, validateId, dislikeClothingItem);

router.delete("/:itemId", auth, validateId, deleteClothingItem);

module.exports = router;
