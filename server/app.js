require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const formRouter = require("./routes/form-router");
const errorMiddleware = require("./middleware/errorHandling");
const BodyParser = require("body-parser");
const { errors } = require("celebrate");
const encryptionMiddleware = require("./middleware/encryption");

// Other middleware and route handlers

app.use(encryptionMiddleware);
app.use(BodyParser.json());
app.use(cors());

app.use("/api/form", formRouter);


app.use(errorMiddleware);
app.use(errors());

module.exports = app;
