const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getClothingItems,
  createClothingItem,
  likeClothingItem,
  dislikeClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

// CRUD -- Create, Read, Update, Delete

router.post("/", auth, createClothingItem);

router.get("/", getClothingItems);

router.put("/:itemId/likes", auth, likeClothingItem);
router.delete("/:itemId/likes", auth, dislikeClothingItem);

router.delete("/:itemId", auth, deleteClothingItem);

module.exports = router;
