const router = require("express").Router();
// const { NOT_FOUND } = require("../utils/errors");
const NotFoundError = require("../errors/NotFoundError");

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.get("/", (req, res) => {
  res.send({ status: "Welcome to the WTWR API" });
});

router.use((_req, _res) => {
  throw new NotFoundError("Router not found");
});

module.exports = router;
