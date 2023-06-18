const express = require("express");
const formRouter = express.Router();
const fetch = require("node-fetch");
const { auth } = require("express-oauth2-jwt-bearer");
const dataValidate = require("../middleware/dataValidation");
const formRepository = require("./form-router.repository.js");
const checkJwt = auth();

const checkPermissions = (req, res, next) => {
  if (!req.auth.payload.permissions.includes("admin:claims")) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

//Encode & Decode Functions (with console.logging)
// Encode value to base64
function encodeToBase64(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }

  const encodedValue = Buffer.from(value).toString("base64");
  console.log(`Encoded value: ${encodedValue}`);
  return encodedValue;
}

// Decode value from base64
function decodeFromBase64(value) {
  const decodedValue = Buffer.from(value, "base64").toString();
  console.log(`Decoded value: ${decodedValue}`);
  return decodedValue;
}

// ROUTES

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

      // Encode all fields to base64
      const encodedFields = {
        policy_number: encodeToBase64(policy_number),
        customer_id: encodeToBase64(customer_id),
        condition_claimed_for: encodeToBase64(condition_claimed_for),
        first_symptoms_date: encodeToBase64(first_symptoms_date.toISOString()),
        // Encode date as string - avoiding a known error likely when decoding dates.
        symptoms_details: encodeToBase64(symptoms_details),
        medical_service_type: encodeToBase64(medical_service_type),
        service_provider_name: encodeToBase64(service_provider_name),
        other_insurance_provider: encodeToBase64(other_insurance_provider),
        consent: encodeToBase64(consent),
      };

      console.log("Encoded Fields:");
      console.log(encodedFields);

      // Perform encryption and decryption as needed - to be added later

      // Decode specific fields from base64
      const decodedPolicyNumber = decodeFromBase64(encodedFields.policy_number);
      const decodedCustomerId = decodeFromBase64(encodedFields.customer_id);
      const decodedConditionClaimedFor = decodeFromBase64(encodedFields.condition_claimed_for);
      const decodedFirstSymptomsDate = new Date(decodeFromBase64(encodedFields.first_symptoms_date)); // Decode date from string
      const decodedSymptomsDetails = decodeFromBase64(encodedFields.symptoms_details);
      const decodedMedicalServiceType = decodeFromBase64(encodedFields.medical_service_type);
      const decodedServiceProviderName = decodeFromBase64(encodedFields.service_provider_name);
      const decodedOtherInsuranceProvider = decodeFromBase64(encodedFields.other_insurance_provider);
      const decodedConsent = decodeFromBase64(encodedFields.consent);

      console.log("Decoded Fields:");
      console.log({
        policy_number: decodedPolicyNumber,
        customer_id: decodedCustomerId,
        condition_claimed_for: decodedConditionClaimedFor,
        first_symptoms_date: decodedFirstSymptomsDate,
        symptoms_details: decodedSymptomsDetails,
        medical_service_type: decodedMedicalServiceType,
        service_provider_name: decodedServiceProviderName,
        other_insurance_provider: decodedOtherInsuranceProvider,
        consent: decodedConsent,
      });

      // Process the decoded values as needed

      res.status(201).json({ message: "Claims form submitted successfully" });
    } else {
      res.status(400).send("ERROR Invalid request");
    }
  } catch (err) {
    next(err);
  }
});

// Other routes... which do NOT require POST request handling

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