const express = require("express");
const formRouter = express.Router();
const CryptoJS = require("crypto-js");
const dataValidate = require("../middleware/dataValidation");
const { auth } = require("express-oauth2-jwt-bearer");
const formRepository = require("./form-router.repository");
const fetch = require("node-fetch");
const checkJwt = auth();

const checkPermissions = (req, res, next) => {
  if (!req.auth.payload.permissions.includes("admin:claims")) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

// Login into Auth0 with client@blablabla.com ClientPassword1
// Login into Auth0 with admin@blablabla.com AdminPassword1

// Middleware for encoding data to Base64
const encodeToBase64 = (req, res, next) => {
  if (req.body.policy_number) {
    req.body.policy_number = Buffer.from(req.body.policy_number).toString("base64");
  }
  next();
};

// Middleware for encrypting data
const encryptData = (req, res, next) => {
  if (req.body.customer_id) {
    req.body.customer_id = encryptString(req.body.customer_id, process.env.ENCRYPTION_KEY);
  }
  if (req.body.condition_claimed_for) {
    req.body.condition_claimed_for = encryptString(req.body.condition_claimed_for, process.env.ENCRYPTION_KEY);
  }
  // Apply encryption to other fields as needed
  next();
};

// Middleware for decrypting data
const decryptData = (req, res, next) => {
  if (req.body.customer_id) {
    req.body.customer_id = decryptString(req.body.customer_id, process.env.ENCRYPTION_KEY);
  }
  if (req.body.condition_claimed_for) {
    req.body.condition_claimed_for = decryptString(req.body.condition_claimed_for, process.env.ENCRYPTION_KEY);
  }
  // Apply decryption to other fields as needed
  next();
};

// Encryption function
function encryptString(value, key) {
  const encrypted = CryptoJS.AES.encrypt(value, key).toString();
  return encrypted;
}

// Decryption function
function decryptString(encryptedValue, key) {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, key);
  const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedValue;
}

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
formRouter.post("/", checkJwt, dataValidate, encodeToBase64, encryptData, async (req, res, next) => {
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.API_KEY}&response=${req.body.captcha}`
    );
    const data = await response.json();
    if (data.success === true) {
      const {
        policy_number,
        customer_id,
        condition_claimed_for,
        first_symptoms_date,
        symptoms_details,
        medical_service_type,
        service_provider_name,
        other_insurance_provider,
        consent,
      } = req.body;

      // Apply encoding and encryption to other fields as needed

      const postClaimsForm = await formRepository.postClaimsForm(
        req,
        res,
        next,
        policy_number,
        customer_id,
        condition_claimed_for
      );

      console.info(
        JSON.stringify({
          timestamp: postClaimsForm.created_at,
          route_name: "/api/form",
          route_type: "POST",
          claim_id: postClaimsForm.claim_id,
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

formRouter.put("/profile", checkJwt, async (req, res) => {
  try {
    const auth0ID = req.auth.payload.sub;
    console.log(auth0ID);
    const user = await formRepository.updateUser(auth0ID, req.body);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
