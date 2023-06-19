const pool = require("../db");
const { encodeData, decodeData } = require("./encodeDecode");

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

      // Encode the data before inserting into the database
      const encodedData = encodeData(req.body);

      const newItem = await pool.query(
        `INSERT INTO claims (encoded_data)
                VALUES ($1) RETURNING *`,
        [ encodedData ]
      );

      return newItem.rows[ 0 ];
    } catch (err) {
      throw new Error("Failed to post claims form");
    }
  },

  allClaimsForAdmin: async () => {
    try {
      const allClaims = await pool.query(
        "SELECT claim_id, encoded_data FROM claims"
      );

      // Decode the data before returning
      const decodedClaims = allClaims.rows.map((claim) =>
        decodeData(claim.encoded_data)
      );

      return decodedClaims;
    } catch (err) {
      throw new Error("Failed to fetch all claims for admin");
    }
  },

  allClaimsForUser: async (auth0ID) => {
    try {
      const userClaims = await pool.query(
        `SELECT claim_id, encoded_data FROM claims
      WHERE customer_id IN (SELECT customer_id FROM users WHERE auth0ID = $1)`,
        [ auth0ID ]
      );

      // Decode the data before returning
      const decodedClaims = userClaims.rows.map((claim) =>
        decodeData(claim.encoded_data)
      );

      return decodedClaims;
    } catch (err) {
      throw new Error("Failed to fetch all claims for user");
    }
  },

  updateClaimStatus: async (claim_id, status) => {
    try {
      const updatedClaim = await pool.query(
        "UPDATE claims SET status = $1 WHERE claim_id = $2 RETURNING *",
        [ status, claim_id ]
      );

      // Decode the data before returning
      const decodedClaim = decodeData(updatedClaim.rows[ 0 ].encoded_data);

      return decodedClaim;
    } catch (err) {
      throw new Error("Failed to update claim status");
    }
  },

  getUserByAuth0ID: async (auth0ID) => {
    try {
      const user = await pool.query(
        "SELECT name, customer_id, user_policies, bank_account_number, pre_existing_medical_conditions, address, email_address, phone_number, next_of_kin FROM users WHERE auth0ID = $1",
        [ auth0ID ]
      );

      // Decode the data before returning
      const decodedUser = decodeData(user.rows[ 0 ].encoded_data);

      return decodedUser;
    } catch (err) {
      throw new Error("Failed to fetch user");
    }
  },

  updateUser: async (auth0ID, userData) => {
    try {
      const key = Object.keys(userData)[ 0 ];
      const value = userData[ key ];
      console.log(key);
      console.log(value);
      if (
        key === "customer_id" ||
        key === "user_policies" ||
        key === "bank_account_number" ||
        key === "pre_existing_medical_conditions"
      ) {
        // If the key is one of the excluded values, return the existing user without updating the database
        return getUser(auth0ID); // Implement the `getUser` function to fetch and return the user data
      }

      // Encode the data before updating in the database
      const encodedData = encodeData(userData);

      const result = await pool.query(
        `UPDATE users SET encoded_data = $1 WHERE auth0ID = $2 RETURNING *`,
        [ encodedData, auth0ID ]
      );

      // Decode the data before returning
      const decodedUser = decodeData(result.rows[ 0 ].encoded_data);

      return decodedUser;
    } catch (err) {
      throw new Error("Failed to update user");
    }
  },
};
