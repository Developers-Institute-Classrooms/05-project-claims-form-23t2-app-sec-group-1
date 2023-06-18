const pool = require("../db");
const { Buffer } = require('buffer');

// Encode value to base64
const encodeToBase64 = (value) => {
  if (typeof value !== 'string') {
    value = String(value);
  }
  const encodedValue = Buffer.from(value).toString("base64");
  return encodedValue;
};

// Decode value from base64
const decodeFromBase64 = (value) => {
  const decodedValue = Buffer.from(value, "base64").toString();
  return decodedValue;
};

module.exports = {
  postClaimsForm: async (req, res, next) => {
    try {
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
        symptoms_details: encodeToBase64(symptoms_details),
        medical_service_type: encodeToBase64(medical_service_type),
        service_provider_name: encodeToBase64(service_provider_name),
        other_insurance_provider: encodeToBase64(other_insurance_provider),
        consent: encodeToBase64(consent),
      };

      const newItem = await pool.query(
        `INSERT INTO claims (policy_number, customer_id, condition_claimed_for, first_symptoms_date, symptoms_details, medical_service_type, service_provider_name, other_insurance_provider, consent)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          encodedFields.policy_number,
          encodedFields.customer_id,
          encodedFields.condition_claimed_for,
          encodedFields.first_symptoms_date,
          encodedFields.symptoms_details,
          encodedFields.medical_service_type,
          encodedFields.service_provider_name,
          encodedFields.other_insurance_provider,
          encodedFields.consent,
        ]
      );

      return newItem.rows[ 0 ];
    } catch (err) {
      throw err;
    }
  },

  allClaimsForAdmin: async () => {
    const allClaims = await pool.query(
      "SELECT Claims.*, Users.Name, Users.Address, Users.EmailAddress, Users.PhoneNumber, Users.PreExistingMedicalConditions, Policies.PolicyNumber AS OtherPolicies FROM Claims JOIN Users ON Claims.customer_id = Users.CustomerID LEFT JOIN Policies ON Users.CustomerID = Policies.CustomerID AND Claims.policy_number != Policies.PolicyNumber;"
    );
    return allClaims.rows;
  },

  allClaimsForUser: async (auth0ID) => {
    const userClaims = await pool.query(
      `SELECT Claims.* FROM Claims
      JOIN Users ON Claims.customer_id = Users.CustomerID
      WHERE (Users.Auth0ID = $1)`,
      [ auth0ID ]
    );
    return userClaims.rows;
  },

  updateClaimStatus: async (claim_id, status) => {
    const updatedClaim = await pool.query(
      "UPDATE Claims SET status = $1 WHERE claim_id = $2 RETURNING *",
      [ status, claim_id ]
    );
    return updatedClaim.rows[ 0 ];
  },

  getUserByAuth0ID: async (auth0ID) => {
    const user = await pool.query("SELECT * FROM Users WHERE Auth0ID = $1", [
      auth0ID,
    ]);
    return user.rows[ 0 ];
  },

  // Other repository functions...
};
