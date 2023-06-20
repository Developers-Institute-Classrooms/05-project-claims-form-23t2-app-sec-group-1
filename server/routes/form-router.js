const express = require("express");
const formRouter = express.Router();
const dataValidate = require("../middleware/dataValidation");
const { auth } = require("express-oauth2-jwt-bearer");
const formRepository = require("./form-router.repository");
const fetch = require("node-fetch");
const checkJwt = auth();
const checkPermissions = require("../middleware/checkPermissions");
const { encodeData, decodeData } = require("./encodeDecode");

// POST claim route
formRouter.post("/", checkJwt, dataValidate, async (req, res, next) => {
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.API_KEY}&response=${req.body.captcha}`
    );
    const data = await response.json();
    if (data.success === true) {
      // check if user exists in database
      const auth0ID = req.auth.payload.sub;
      const user = await formRepository.getUserByAuth0ID(auth0ID);

      // check if user has the same customer ID and Policy ID in the request body
      if (
        user.customer_id !== req.body.customerid ||
        user.userpolicies.includes(req.body.policy_number) === false
      ) {
        return res.status(400).json({ error: "Validation failed" });
      }

      // Encode data before posting claims form
      const encodedData = encodeData(JSON.stringify(req.body));

      const postClaimsForm = await formRepository.postClaimsForm(
        encodedData,
        res,
        next
      );

      console.info(
        JSON.stringify({
          timestamp: postClaimsForm.created_at,
          route_name: "/api/form",
          route_type: "POST",
          claim_id: postClaimsForm.claim_id,
        })
      );

      // Decode data after successful submission
      const decodedData = JSON.parse(decodeData(encodedData));

      res.status(201).json({ ...postClaimsForm, decodedData });
    } else {
      res.status(400).send("ERROR Invalid request");
    }
  } catch (err) {
    next(err);
  }
});

// PUT profile route
formRouter.put("/profile", checkJwt, async (req, res, next) => {
  try {
    const auth0ID = req.auth.payload.sub;
    console.log(auth0ID);

    // Encode data before updating user profile
    const encodedData = encodeData(JSON.stringify(req.body));

    const user = await formRepository.updateUser(auth0ID, encodedData);

    // Decode data after successful update
    const decodedData = JSON.parse(decodeData(encodedData));

    res.json({ ...user, decodedData });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// PUT claim status route
formRouter.put(
  "/:claim_id",
  checkJwt,
  checkPermissions,
  async (req, res, next) => {
    const { status } = req.body;
    const { claim_id } = req.params;

    try {
      const updatedClaim = await formRepository.updateClaimStatus(
        claim_id,
        status
      );

      res.json(updatedClaim);
    } catch (err) {
      next(err);
    }
  }
);

// GET user profile route
formRouter.get("/profile", checkJwt, async (req, res, next) => {
  try {
    const auth0ID = req.auth.payload.sub;

    const user = await formRepository.getUserByAuth0ID(auth0ID);

    // Decode data before sending user profile response
    const decodedData = JSON.parse(decodeData(user));

    res.json(decodedData);
  } catch (err) {
    next(err);
  }
});

// GET dashboard route
formRouter.get("/dashboard", checkJwt, async (req, res, next) => {
  try {
    const auth0ID = req.auth.payload.sub;

    const dashboardData = await formRepository.getDashboardData(auth0ID);

    // Decode data before sending dashboard response
    const decodedData = JSON.parse(decodeData(dashboardData));

    res.json(decodedData);
  } catch (err) {
    next(err);
  }
});

module.exports = formRouter;
