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

// create a post route
formRouter.post("/", async (req, res) => {
  try {
    // const { name, email, message } = req.body;
    const newItem = await pool.query(
      `INSERT INTO Claims (policy_number, customer_id, condition_claimed_for,first_symptoms_date,symptoms_details,medical_service_type,service_provider_name,other_insurance_provider,consent)
        VALUES ('98765432',
        'CUST002',
        'Broken leg',
        '2023-04-30',
        'Fractured tibia during a soccer game',
        'Orthopedic surgery',
        'XYZ Hospital',
        true,
        true)`
    );

    res.json("hello there");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = formRouter;
