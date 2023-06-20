const app = require("./app");


const thePort = process.env.EXPRESS_PORT || 5000;
app.listen(thePort, () => {
  console.log(`server has started on port ${thePort}`);
});
