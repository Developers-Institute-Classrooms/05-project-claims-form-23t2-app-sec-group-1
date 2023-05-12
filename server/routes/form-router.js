const express = require("express");
const formRouter = express.Router();
const dataValidate = require("../middleware/dataValidation");
const errorMiddleware = require("../middleware/errorHandling");
const formRepository = require("./form-router.repository");

formRouter.get("/", async (req, res) => {
  try {
    const allClaims = await formRepository.allClaims();
    res.json(allClaims);
  } catch (err) {
    console.error(err.message);
  }
});

// create a post route
formRouter.post("/", dataValidate, async (req, res) => {
  try {
    const postClaimsForm = await formRepository.postClaimsForm(req);

    console.info(
      JSON.stringify({
        timestamp: postClaimsForm.created_at,
        route_name: "/api/form",
        route_type: "POST",
        claim_id: postClaimsForm.claim_id,
      })
    );
    res.status(200).json(postClaimsForm);
  } catch (err) {
    errorMiddleware(err, req, res, next);
  }
});

module.exports = formRouter;
