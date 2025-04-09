require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose
  .connect("mongodb://localhost:27017/wtwr_db", {
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB", `${process.env}`);
  })
  .catch(console.error, "Error connecting to DB");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(requestLogger); // needs to be before all route handlers

app.post("/signup", createUser);
app.post("/signin", login);

app.use("/", mainRouter);

app.use(errorLogger); // Needs to be after route handlers
// but before error handlers

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
