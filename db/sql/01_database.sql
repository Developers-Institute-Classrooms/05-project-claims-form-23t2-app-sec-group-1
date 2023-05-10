CREATE TABLE
  form (
    claim_id SERIAL PRIMARY KEY,
    policy_number INT NOT NULL,
    customer_id VARCHAR NOT NULL,
    condition_claimed_for TEXT NOT NULL,
    first_symptoms_date DATE NOT NULL,
    symptoms_details TEXT NOT NULL,
    medical_service_type VARCHAR(255) NOT NULL,
    service_provider_name VARCHAR(255) NOT NULL,
    other_insurance_provider BOOLEAN DEFAULT false,
    consent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW ()
  );