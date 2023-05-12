const express = require("express");
const pool = require("../db");
const formRouter = express.Router();
const dataValidate = require("../middleware/dataValidation");
const errorMiddleware = require("../middleware/errorHandling");

const { celebrate, Joi, errors, Segments } = require("celebrate");
const e = require("express");

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
formRouter.post("/", dataValidate, async (req, res) => {
  console.log("api hit");
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
  try {
    const newItem = await pool.query(
      `INSERT INTO claims (policy_number, customer_id, condition_claimed_for,first_symptoms_date,symptoms_details,medical_service_type,service_provider_name,other_insurance_provider,consent)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING customer_id`,
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

    console.log(newItem.rows[0]);
    res.json(newItem.rows[0]);
  } catch (err) {
    errorMiddleware(err, req, res, next);
  }
});

formRouter.use(errors());

module.exports = formRouter;
