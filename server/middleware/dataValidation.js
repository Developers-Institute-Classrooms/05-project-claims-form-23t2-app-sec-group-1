const { celebrate, Segments, Joi } = require("celebrate");

const validateInput = celebrate({
  [Segments.BODY]: Joi.object().keys({
    policy_number: Joi.string()
      .pattern(/^\d{8}$/)
      .required(),
    customer_id: Joi.string().required(),
    condition_claimed_for: Joi.string().required(),
    first_symptoms_date: Joi.date().iso().required(),
    symptoms_details: Joi.string().required(),
    medical_service_type: Joi.string().required(),
    service_provider_name: Joi.string().required(),
    other_insurance_provider: Joi.boolean().default(false),
    consent: Joi.boolean().default(false),
    captcha: Joi.string().required(),
  }),
});

const validateEdits = celebrate({
  [Segments.BODY]: Joi.object().keys({
    policy_number: Joi.string().pattern(/^\d{8}$/),
    customer_id: Joi.string(),
    condition_claimed_for: Joi.string(),
    first_symptoms_date: Joi.date().iso(),
    symptoms_details: Joi.string(),
    medical_service_type: Joi.string(),
    service_provider_name: Joi.string(),
    other_insurance_provider: Joi.boolean(),
    status: Joi.string(),
    consent: Joi.boolean(),
    captcha: Joi.string(),
    address: Joi.string(),
    emailaddress: Joi.string().email(),
    phonenumber: Joi.string(),
    nextofkin: Joi.string(),
  }),
});

module.exports = { validateInput, validateEdits };
