const { celebrate, Segments, Joi } = require("celebrate");

const validateInput = celebrate({
  [ Segments.BODY ]: Joi.object().keys({
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
  }),
});

module.exports = validateInput;
