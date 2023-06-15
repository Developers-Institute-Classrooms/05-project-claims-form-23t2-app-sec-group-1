const pool = require("../db");

module.exports = {
  postClaimsForm: async (req, res, next, policy_number, customer_id, condition_claimed_for) => {
    try {
      const {
        first_symptoms_date,
        symptoms_details,
        medical_service_type,
        service_provider_name,
        other_insurance_provider,
        consent,
      } = req.body;

      const newItem = await pool.query(
        `INSERT INTO claims (policy_number, customer_id, condition_claimed_for, first_symptoms_date, symptoms_details, medical_service_type, service_provider_name, other_insurance_provider, consent)
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
    const user = await pool.query(
      "SELECT CustomerID, Name, Address, EmailAddress, PhoneNumber, NextOfKin, PreExistingMedicalConditions, BankAccountNumber FROM Users WHERE Auth0ID = $1",
      [ auth0ID ]
    );
    return user.rows[ 0 ];
  },
  updateUser: async (auth0ID, userData) => {
    const key = Object.keys(userData)[ 0 ];
    const value = userData[ key ];

    const result = await pool.query(
      `UPDATE Users SET ${key} = $1 WHERE Auth0ID = $2 RETURNING *`,
      [ value, auth0ID ]
    );

    return result.rows[ 0 ];
  },
};
