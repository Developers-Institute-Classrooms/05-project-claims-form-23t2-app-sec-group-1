require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const formRouter = require("./routes/form-router");
const errorMiddleware = require("./middleware/errorHandling");
const BodyParser = require("body-parser");
const { errors } = require("celebrate");
app.use(BodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3333",
  })
);

app.use("/api/form", formRouter);

app.use(errorMiddleware);
app.use(errors());

module.exports = app;
