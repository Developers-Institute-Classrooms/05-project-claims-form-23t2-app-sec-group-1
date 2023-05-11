const express = require("express");
const pool = require("../db");
const formRouter = express.Router();

formRouter.get("/", async (req, res) => {
  console.log("hot reloaded!");
  try {
    const allItems = await pool.query("SELECT * FROM form");
    res.json(allItems.rows);
  } catch (err) {
    console.error(err.message);
  }
});

formRouter.post("/form", async (req, res) => {
  console.log(req.body);
  try {
    const allItems =
      await pool.query(`INSERT INTO form (policy_number, customer_id, condition_claimed_for,first_symptoms_date,symptoms_details,medical_service_type,service_provider_name,other_insurance_provider,consent)
        VALUES (value1, value2, value3)`);
    res.json(allItems.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = formRouter;
