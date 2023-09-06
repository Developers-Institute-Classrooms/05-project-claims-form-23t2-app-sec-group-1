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
    'CUST1234',
    'QmFjayBwYWlu',
    '2022-01-01',
    'RXhwZXJpZW5jZWQgc2hhcnAgcGFpbiB3aGlsZSBsaWZ0aW5nIGhlYXZ5IG9iamVjdA',
    'UGh5c2ljYWwgdGhlcmFweQ',
    'QUJDIE1lZGljYWwgQ2VudGVy',
    false,
    true
  );

INSERT INTO Users (
    Auth0ID,
    CustomerID,
    Name,
    Address,
    EmailAddress,
    PhoneNumber,
    NextOfKin,
    PreExistingMedicalConditions,
    BankAccountNumber,
    UserPolicies
  )
VALUES
  (
    'auth0|647f077f42e6ffa2e795956a',
    'CUST1234',
    'Sm9obiBEb2U=',
    'MTIzIE1haW4gU3QsIEFueXRvd24sIEFueXdoZXJl',
    'am9obmRvZUBleGFtcGxlLmNvbQ==',
    'NTU1LTU1NS01NTU1',
    'SmFuZSBEb2U=',
    'RGlhYmV0ZXM=',
    'MTIzNDU2Nzg5MA==',
    ARRAY['12345678', '23456789']
  );