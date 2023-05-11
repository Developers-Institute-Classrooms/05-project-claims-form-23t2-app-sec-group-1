const express = require("express");
const pool = require("../db");
const formRouter = express.Router();

const { celebrate, Joi, errors, Segments } = require("celebrate");

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
formRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      policy_number: Joi.string()
        .pattern(/^\d{8}$/)
        .required()
        .messages({
          "string.pattern.base": "Policy number must be 8 digits long",
        }),
      customer_id: Joi.string().required(),
      condition_claimed_for: Joi.string().required(),
      first_symptoms_date: Joi.date().iso().required(),
      symptoms_details: Joi.string().required(),
      medical_service_type: Joi.string().required(),
      service_provider_name: Joi.string().required(),
      other_insurance_provider: Joi.boolean().default(false),
      consent: Joi.boolean().default(false),
    }),
  }),
  async (req, res) => {
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
        VALUES ('${policy_number}', '${customer_id}','${condition_claimed_for}','${first_symptoms_date}','${symptoms_details}','${medical_service_type}','${service_provider_name}','${other_insurance_provider}','${consent}' RETURNING customer_id)`
      );
      console.log(newItem.rows[0]);
      res.json(newItem.rows[0]);
    } catch (err) {
      console.log(err);
    }
  }
);

formRouter.use(errors());

module.exports = formRouter;
