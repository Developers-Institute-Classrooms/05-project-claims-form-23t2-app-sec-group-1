const express = require("express");
const formRouter = express.Router();
const CryptoJS = require("crypto-js");
const dataValidate = require("../middleware/dataValidation");
const { auth } = require("express-oauth2-jwt-bearer");
const formRepository = require("./form-router.repository");
const fetch = require("node-fetch");
require("dotenv").config(); // Load environment variables from .env file

const checkJwt = auth();

const checkPermissions = (req, res, next) => {
  if (!req.auth.payload.permissions.includes("admin:claims")) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

// Encode value to base64
function encodeToBase64(value) {
  const encodedValue = Buffer.from(value).toString("base64");
  console.log(`Encoded value: ${encodedValue}`);
  return encodedValue;
}

// Encrypt string using AES encryption
function encryptString(value, key) {
  const encrypted = CryptoJS.AES.encrypt(value, key).toString();
  console.log(`Encrypted value: ${encrypted}`);
  return encrypted;
}

// Decrypt string using AES decryption
function decryptString(encryptedValue, key) {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, key);
  const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
  console.log(`Decrypted value: ${decryptedValue}`);
  return decryptedValue;
}

// Decode value from base64
function decodeFromBase64(value) {
  const decodedValue = Buffer.from(value, "base64").toString();
  console.log(`Decoded value: ${decodedValue}`);
  return decodedValue;
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
formRouter.post("/", checkJwt, dataValidate, async (req, res, next) => {
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

      // Encode sensitive fields to base64
      const encodedPolicyNumber = encodeToBase64(policy_number);

      // Encrypt sensitive fields using AES encryption
      const encryptedCustomerId = encryptString(
        customer_id,
        process.env.ENCRYPTION_KEY
      );
      const encryptedConditionClaimedFor = encryptString(
        condition_claimed_for,
        process.env.ENCRYPTION_KEY
      );

      // Apply encoding and encryption to other sensitive fields as needed

      const postClaimsForm = await formRepository.postClaimsForm(
        req,
        res,
        next,
        encodedPolicyNumber,
        encryptedCustomerId,
        encryptedConditionClaimedFor
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
    console.log(`Auth0 ID: ${auth0ID}`);
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
