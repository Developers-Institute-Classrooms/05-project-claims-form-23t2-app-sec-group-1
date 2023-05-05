require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const formRouter = require("./routes/form-router");

app.use(cors());
app.use(express.json());

app.use("/api/form", formRouter);

const thePort = process.env.EXPRESS_PORT || 5000;
app.listen(thePort, () => {
  console.log(`server has started on port ${thePort}`);
});
