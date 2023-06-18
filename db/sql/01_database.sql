CREATE EXTENSION IF NOT EXISTS plpgsql;

CREATE OR REPLACE FUNCTION unique_random_claim_id()
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

CREATE TYPE claim_status AS ENUM ('submitted', 'in progress', 'approved', 'denied');

CREATE TABLE Claims (
    claim_id BIGINT DEFAULT unique_random_claim_id() PRIMARY KEY,
    status claim_status DEFAULT 'submitted',
    policy_number CHAR(8) CHECK (policy_number SIMILAR TO '[0-9]{8}'),
    customer_id VARCHAR NOT NULL,
    condition_claimed_for TEXT NOT NULL,
    first_symptoms_date DATE NOT NULL,
    symptoms_details TEXT NOT NULL,
    medical_service_type VARCHAR(255) NOT NULL,
    service_provider_name VARCHAR(255) NOT NULL,
    other_insurance_provider BOOLEAN DEFAULT false,
    consent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT stop_duplicates UNIQUE (policy_number, customer_id, condition_claimed_for, first_symptoms_date, symptoms_details, medical_service_type, service_provider_name, other_insurance_provider, consent)
);

CREATE TABLE Users (
    Auth0ID TEXT UNIQUE NOT NULL,
    CustomerID CHAR(8) UNIQUE NOT NULL,
    Name TEXT NOT NULL,
    Address TEXT,
    EmailAddress TEXT,
    PhoneNumber TEXT,
    NextOfKin TEXT,
    PreExistingMedicalConditions TEXT[],
    BankAccountNumber TEXT
);

CREATE TABLE Policies (
    PolicyNumber CHAR(8) CHECK (PolicyNumber SIMILAR TO '[0-9]{8}') PRIMARY KEY,
    CustomerID CHAR(8),
    CONSTRAINT fk_customer
      FOREIGN KEY (CustomerID)
      REFERENCES Users (CustomerID)
);
