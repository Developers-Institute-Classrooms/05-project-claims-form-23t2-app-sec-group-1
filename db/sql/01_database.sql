CREATE FUNCTION unique_random()
RETURNS bigint AS $$
DECLARE
    r bigint;
BEGIN
    LOOP
        -- Generate a random 10-digit number
        r := floor(random() * (9999999999 - 1000000000 + 1) + 1000000000)::bigint;

        -- Check if this number already exists in the table
        IF NOT EXISTS(SELECT 1 FROM Claims WHERE claim_id = r) THEN
            RETURN r;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;


CREATE TABLE
  Claims (
    claim_id BIGINT DEFAULT unique_random() PRIMARY KEY,
    status VARCHAR(255) DEFAULT 'submitted',
    policy_number CHAR(8) CHECK (policy_number SIMILAR TO '[0-9]{8}'),
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
