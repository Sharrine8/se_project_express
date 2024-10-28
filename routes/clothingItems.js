const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  updateClothingItem,
  likeClothingItem,
  dislikeClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

// CRUD -- Create, Read, Update, Delete

router.post("/", createClothingItem);

router.get("/", getClothingItems);

router.put("/:itemId", updateClothingItem);
router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId/likes", dislikeClothingItem);

router.delete("/:itemId", deleteClothingItem);

module.exports = router;
