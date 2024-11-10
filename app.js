const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;
const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");
const auth = require("./middleware/auth");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.post("/signup", createUser);
app.post("/signin", login);

app.use(auth);

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
