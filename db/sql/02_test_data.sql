INSERT INTO
    form (
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
        1234567890,
        'CUST001',
        'Back pain',
        '2022-01-01',
        'Experienced sharp pain while lifting heavy object',
        'Physical therapy',
        'ABC Medical Center',
        false,
        true
    );

INSERT INTO
    form (
        policy_number,
        customer_id,
        condition_claimed_for,
        first_symptoms_date,
        symptoms_details,
        medical_service_type,
        service_provid ider_name,
        other_insurance_provider,
        consent
    )
VALUES
    (
        2345678901,
        'CUST002',
        'Heart attack',
        '2022-02-15',
        'Chest pain, dizziness, and shortness of breath',
        'Cardiology',
        'XYZ Hospital',
        true,
        true
    );