const express = require("express");
const pool = require("../db");
const formRouter = express.Router();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

formRouter.get("/", async (req, res) => {
  console.log("hot reloaded!");
  try {
    const allItems = await pool.query("SELECT * FROM Claims");
    res.json(allItems.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Validation Schema

const bodyVarSchema = Joi.object().keys({
  policy_number: Joi.string()
    .regex(/^\d{8}$/)
    .required(),
  customer_id: Joi.string().required(),
  // policy_number: Joi.string().regex(/^\d{8}$/),
  // customer_id: Joi.required(),
  // condition_claimed_for: Joi.string().required(),
  // first_symptoms_date: Joi.date().required(),
  // symptoms_details: Joi.string().required(),
  // medical_service_type: Joi.string().required(),
  // service_provider_name: Joi.string().required(),
  // other_insurance_provider: Joi.boolean().default(false),
  // consent: Joi.boolean().valid(true).default(false),
});

// create a post route
formRouter.post("/", async (req, res) => {
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

    // console.log(typeof req.body, customer_id);
    // bodyVarSchema.validate(request.params);
    // const { name, email, message } = req.body;
    const newItem = await pool.query(
      `INSERT INTO claims (policy_number, customer_id, condition_claimed_for,first_symptoms_date,symptoms_details,medical_service_type,service_provider_name,other_insurance_provider,consent)
        VALUES ('${policy_number}', '${customer_id}','${condition_claimed_for}','${first_symptoms_date}','${symptoms_details}','${medical_service_type}','${service_provider_name}','${other_insurance_provider}','${consent}')`
    );
    console.log(newItem.rows[0]);
    res.json(newItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = formRouter;
