require("dotenv").config();
const express = require("express");
const cors = require("cors");
const formRouter = require("./routes/form-router");
const errorMiddleware = require("./middleware/errorHandling");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/form", formRouter);

app.use(errorMiddleware);
app.use(errors());

module.exports = app;
