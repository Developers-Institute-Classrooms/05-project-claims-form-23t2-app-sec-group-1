require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const formRouter = require("./routes/form-router");
const BodyParser = require("body-parser");
const { errors } = require("celebrate");
app.use(BodyParser.json());
app.use(cors());

app.use("/api/form", formRouter);
app.use(errors());
const thePort = process.env.EXPRESS_PORT || 5000;
app.listen(thePort, () => {
  console.log(`server has started on port ${thePort}`);
});
