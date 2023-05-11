  INSERT INTO
    Claims (
         policy_number,
         customer_id,
         condition_claimed_for,
         first_symptoms_date,
         symptoms_details,
         medical_service_type,
         service_provider_name,
         other_insurance_provider,
        consent
    )
VALUES
    (
         '12345678',
         'CUST001',
         'Back pain',
         '2022-01-01',
         'Experienced sharp pain while lifting heavy object',
         'Physical therapy',
         'ABC Medical Center',
         false,
        true
    );