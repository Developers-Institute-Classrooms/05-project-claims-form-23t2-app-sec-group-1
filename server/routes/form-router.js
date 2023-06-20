const express = require("express");
const formRouter = express.Router();
const dataValidate = require("../middleware/dataValidation");
const { auth } = require("express-oauth2-jwt-bearer");
const formRepository = require("./form-router.repository");
const fetch = require("node-fetch");
const {
  checkJwt,
  checkScopes,
} = require("../middleware/authorizationMiddleware");
const captchaCheck = require("../middleware/captchaCheck");

// Login into Auth0 with client@blablabla.com ClientPassword1
// Login into Auth0 with admin@blablabla.com AdminPassword1

// Get dashboard route
formRouter.get("/dashboard", checkJwt, async (req, res, next) => {
  try {
    if (req.auth.payload.permissions.includes("admin:claims")) {
      const adminClaims = await formRepository.allClaimsForAdmin();
      res.json({ claims: adminClaims, role: "Admin" });
    } else {
      const auth0ID = req.auth.payload.sub;
      const userClaims = await formRepository.allClaimsForUser(auth0ID);
      res.json({ claims: userClaims, role: null });
    }
  } catch (err) {
    next(err);
  }
});

// post claim route
formRouter.post("/", checkJwt, dataValidate, async (req, res, next) => {
  try {
    // check if user exists in database
    const auth0ID = req.auth.payload.sub;
    const user = await formRepository.getUserByAuth0ID(auth0ID);

    // check if user has same customer ID and Policy ID in request body
    if (
      user.customer_id !== req.body.customerid ||
      user.userpolicies.includes(req.body.policy_number) === false
    ) {
      return res.status(400).json({ error: "Validation failed" });
    }
    const postClaimsForm = await formRepository.postClaimsForm(req, res, next);

    console.info(
      JSON.stringify({
        timestamp: postClaimsForm.created_at,
        route_name: "/api/form",
        route_type: "POST",
        claim_id: postClaimsForm.claim_id,
      })
    );
    res.status(201).json(postClaimsForm);
  } catch (err) {
    next(err);
  }
});

formRouter.put("/profile", checkJwt, async (req, res, next) => {
  try {
    const auth0ID = req.auth.payload.sub;
    console.log(auth0ID);
    const user = await formRepository.updateUser(auth0ID, req.body);
    res.json(user);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

formRouter.put("/:claim_id", checkJwt, checkScopes, async (req, res, next) => {
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
});

formRouter.get("/profile", checkJwt, async (req, res, next) => {
  try {
    const auth0ID = req.auth.payload.sub;
    const user = await formRepository.getUserByAuth0ID(auth0ID);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = formRouter;
