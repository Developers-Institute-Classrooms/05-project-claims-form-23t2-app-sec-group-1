const pool = require("../db");

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
      const newItem = await pool.query(
        `INSERT INTO claims (policy_number, customer_id, condition_claimed_for,first_symptoms_date,symptoms_details,medical_service_type,service_provider_name,other_insurance_provider,consent)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          policy_number,
          customer_id,
          condition_claimed_for,
          first_symptoms_date,
          symptoms_details,
          medical_service_type,
          service_provider_name,
          other_insurance_provider,
          consent,
        ]
      );

      return newItem.rows[0];
    } catch (err) {
      throw new Error("Failed to post claims form");
    }
  },

  allClaimsForAdmin: async () => {
    try {
      const allClaims = await pool.query(
        "SELECT Claims.*, Users.Name, Users.Address, Users.EmailAddress, Users.PhoneNumber, Users.PreExistingMedicalConditions, Users.UserPolicies FROM Claims JOIN Users ON Claims.customer_id = Users.CustomerID;"
      );
      return allClaims.rows;
    } catch (err) {
      throw new Error("Failed to fetch all claims for admin");
    }
  },

  allClaimsForUser: async (auth0ID) => {
    try {
      const userClaims = await pool.query(
        `SELECT Claims.* FROM Claims 
      JOIN Users ON Claims.customer_id = Users.CustomerID
      WHERE (Users.Auth0ID = $1)`,
        [auth0ID]
      );
      return userClaims.rows;
    } catch (err) {
      throw new Error("Failed to fetch all claims for user");
    }
  },

  updateClaimStatus: async (claim_id, status) => {
    try {
      const updatedClaim = await pool.query(
        "UPDATE Claims SET status = $1 WHERE claim_id = $2 RETURNING *",
        [status, claim_id]
      );
      return updatedClaim.rows[0];
    } catch (err) {
      throw new Error("Failed to update claim status");
    }
  },

  getUserByAuth0ID: async (auth0ID) => {
    try {
      const user = await pool.query(
        "SELECT Name, CustomerID, UserPolicies, BankAccountNumber, PreExistingMedicalConditions, Address, EmailAddress, PhoneNumber, NextOfKin FROM Users WHERE Auth0ID = $1",
        [auth0ID]
      );
      return user.rows[0];
    } catch (err) {
      throw new Error("Failed to fetch user");
    }
  },

  updateUser: async (auth0ID, userData) => {
    try {
      const key = Object.keys(userData)[0];
      const value = userData[key];
      if (
        key === "CustomerID" ||
        key === "UserPolicies" ||
        key === "BankAccountNumber" ||
        key === "preexistingmedicalconditions"
      ) {
        // If the key is one of the excluded values, return the existing user without updating the database
        return getUser(auth0ID); // Implement the `getUser` function to fetch and return the user data
      }

      const result = await pool.query(
        `UPDATE Users SET ${key} = $1 WHERE Auth0ID = $2 RETURNING *`,
        [value, auth0ID]
      );

      return result.rows[0];
    } catch (err) {
      throw new Error("Failed to update user");
    }
  },
};
