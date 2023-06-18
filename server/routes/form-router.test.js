it("should create a new item and return it with the unique claim ID", async () => {
  // Mock the database response with the inserted claim
  pool.query.mockResolvedValueOnce({
    rows: [
      {
        claim_id: 1234567890, // Unique claim ID
        status: "submitted",
        policy_number: "12345678",
        customer_id: "CUST1234",
        condition_claimed_for: "Back pain",
        first_symptoms_date: "2022-01-01",
        symptoms_details: "Experienced sharp pain while lifting heavy object",
        medical_service_type: "Physical therapy",
        service_provider_name: "ABC Medical Center",
        other_insurance_provider: false,
        consent: true,
        created_at: "2021-05-01T00:00:00.000Z",
      },
    ],
  });

  // Create a new claim item
  const newItem = {
    policy_number: "12345678",
    customer_id: "CUST1234",
    condition_claimed_for: "Back pain",
    first_symptoms_date: "2022-01-01",
    symptoms_details: "Experienced sharp pain while lifting heavy object",
    medical_service_type: "Physical therapy",
    service_provider_name: "ABC Medical Center",
    other_insurance_provider: false,
    consent: true,
  };

  const response = await request(app).post("/api/form").send(newItem);

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty("claim_id", 1234567890);
  expect(response.body).toHaveProperty("status", "submitted");
  // Add more assertions for other properties if needed
});

it("should return 400 when the request body has invalid data", async () => {
  // Send a request with an invalid policy number
  const response = await request(app).post("/api/form").send({
    policy_number: "INVALID",
    customer_id: "CUST1234",
    condition_claimed_for: "Back pain",
    first_symptoms_date: "2022-01-01",
    symptoms_details: "Experienced sharp pain while lifting heavy object",
    medical_service_type: "Physical therapy",
    service_provider_name: "ABC Medical Center",
    other_insurance_provider: false,
    consent: true,
  });

  expect(response.status).toBe(400);
  // Add more assertions if needed
});

it("should return 500 when there is a database error", async () => {
  // Simulate a database error
  pool.query.mockRejectedValueOnce(new Error("Database error"));

  const newItem = {
    policy_number: "12345678",
    customer_id: "CUST1234",
    condition_claimed_for: "Back pain",
    first_symptoms_date: "2022-01-01",
    symptoms_details: "Experienced sharp pain while lifting heavy object",
    medical_service_type: "Physical therapy",
    service_provider_name: "ABC Medical Center",
    other_insurance_provider: false,
    consent: true,
  };

  const response = await request(app).post("/api/form").send(newItem);

  expect(response.status).toBe(500);
  // Add more assertions if needed
});
