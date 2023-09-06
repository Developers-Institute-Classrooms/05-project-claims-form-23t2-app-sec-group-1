const express = require("express");
const formRouter = express.Router();
const {
  validateInput,
  validateEdits,
} = require("../middleware/dataValidation");
const { auth } = require("express-oauth2-jwt-bearer");
const formRepository = require("./form-router.repository");
const fetch = require("node-fetch");
const checkJwt = auth();
const checkPermissions = require("../middleware/checkPermissions");
const { encodeData, decodeData } = require("../middleware/encodingFunctions");

// Get dashboard route
formRouter.get("/dashboard", checkJwt, async (req, res, next) => {
  try {
    if (req.auth.payload.permissions.includes("admin:claims")) {
      const adminClaims = await formRepository.allClaimsForAdmin();
      const decodedClaims = adminClaims.map((claim) => {
        return decodeData(claim);
      });

      res.json({ claims: decodedClaims, role: "Admin" });
      // Logging
      console.info(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          route_name: "/api/form/dashboard",
          route_type: "GET",
          auth0ID: req.auth.payload.sub,
          role: "Admin",
        })
      );
    } else {
      const auth0ID = req.auth.payload.sub;
      const userClaims = await formRepository.allClaimsForUser(auth0ID);
      const decodedClaims = userClaims.map((claim) => {
        return decodeData(claim);
      });

      res.json({ claims: decodedClaims, role: null });

      // Logging
      console.info(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          route_name: "/api/form/dashboard",
          route_type: "GET",
          auth0ID: req.auth.payload.sub,
          role: null,
        })
      );
    }
  } catch (err) {
    next(err);
  }
});

// post claim route
formRouter.post("/", checkJwt, validateInput, async (req, res, next) => {
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.API_KEY}&response=${req.body.captcha}`
    );
    const data = await response.json();
    if (data.success === true) {
      // check if user exists in database
      const auth0ID = req.auth.payload.sub;
      const user = await formRepository.getUserByAuth0ID(auth0ID);
      // console.log(req.body);
      console.log(user);
      // check if user has same customer ID and Policy ID in request body
      if (
        user.customerid !== req.body.customer_id ||
        user.userpolicies.includes(req.body.policy_number) === false
      ) {
        return res.status(400).json({ error: "Validation failed" });
      }

      req.body = encodeData(req.body);

      const postClaimsForm = await formRepository.postClaimsForm(
        req,
        res,
        next
      );

      console.info(
        JSON.stringify({
          timestamp: postClaimsForm.created_at,
          route_name: "/api/form",
          route_type: "POST",
          claim_id: postClaimsForm.claim_id,
          auth0ID: auth0ID,
        })
      );
      res.status(201).json(postClaimsForm);
    } else {
      res.status(400).send("ERROR Invalid request");
    }
  } catch (err) {
    next(err);
  }
});

formRouter.put("/profile", checkJwt, validateEdits, async (req, res, next) => {
  try {
    const auth0ID = req.auth.payload.sub;
    req.body = encodeData(req.body);
    console.log(req.body);

    const user = await formRepository.updateUser(auth0ID, req.body);
    res.json(user);
    // Logging
    console.info(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        route_name: "/api/form/profile",
        route_type: "PUT",
        auth0ID: auth0ID,
      })
    );
  } catch (err) {
    console.error(err);
    next(err);
  }
});

formRouter.put(
  "/:claim_id",
  checkJwt,
  checkPermissions,
  validateEdits,
  async (req, res, next) => {
    const { status } = req.body;
    const { claim_id } = req.params;
    const auth0ID = req.auth.payload.sub;
    try {
      const updatedClaim = await formRepository.updateClaimStatus(
        claim_id,
        status
      );
      res.json(updatedClaim);
      // Logging
      console.info(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          route_name: "/api/form/:claim_id",
          route_type: "PUT",
          claim_id: claim_id,
          auth0ID: auth0ID,
        })
      );
    } catch (err) {
      next(err);
    }
  }
);

formRouter.get("/profile", checkJwt, async (req, res, next) => {
  try {
    const auth0ID = req.auth.payload.sub;
    const user = await formRepository.getUserByAuth0ID(auth0ID);
    const userObject = decodeData(user);
    res.json(userObject);

    // Logging
    console.info(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        route_name: "/api/form/profile",
        route_type: "GET",
        auth0ID: auth0ID,
      })
    );
  } catch (err) {
    next(err);
  }
});

module.exports = formRouter;
