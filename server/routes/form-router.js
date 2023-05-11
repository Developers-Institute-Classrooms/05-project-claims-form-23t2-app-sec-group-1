const express = require("express");
const pool = require("../db");
const formRouter = express.Router();

formRouter.get("/", async (req, res) => {
  console.log("hot reloaded!");
  try {
    const allItems = await pool.query("SELECT * FROM Claims");
    res.json(allItems.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// create a post route
formRouter.post("/", async (req, res) => {
  try {
    console.log(req.body);
    // const { name, email, message } = req.body;
    const newItem = await pool.query(
      `INSERT INTO Claims (policy_number, customer_id, condition_claimed_for,first_symptoms_date,symptoms_details,medical_service_type,service_provider_name,other_insurance_provider,consent)
        VALUES ('$1','$2', '$3', '$4', '$5', '$6','$7','$8','$9'),[]`
        );

    res.json("hello there");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = formRouter;
