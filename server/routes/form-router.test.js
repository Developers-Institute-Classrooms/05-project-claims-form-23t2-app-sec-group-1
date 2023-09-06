const request = require("supertest");
const app = require("../app");
jest.mock("../db");

const pool = require("../db");

describe("POST /", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should create a new item and return it", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        {
          claim_id: 1,
          policy_number: "12345678",
          customer_id: "CUST001",
          condition_claimed_for: "Back pain",
          first_symptoms_date: "2023-05-01",
          symptoms_details: "Severe pain in lower back",
          medical_service_type: "Physical therapy",
          service_provider_name: "ABC Medical Center",
          other_insurance_provider: false,
          consent: true,
          created_at: "2021-05-01T00:00:00.000Z",
        },
      ],
    });

    const newItem = {
      policy_number: "12345678",
      customer_id: "CUST001",
      condition_claimed_for: "Back pain",
      first_symptoms_date: "2023-05-01",
      symptoms_details: "Severe pain in lower back",
      medical_service_type: "Physical therapy",
      service_provider_name: "ABC Medical Center",
      other_insurance_provider: false,
      consent: true,
    };

    const response = await request(app).post("/api/form").send(newItem);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("customer_id", newItem.customer_id);
  });

  it("should return 400 when the request body is invalid", async () => {
    const response = await request(app).post("/api/form").send({
      policy_number: "abcdefgh",
      customer_id: "CUST001",
      condition_claimed_for: "Back pain",
      first_symptoms_date: "2023-05-01",
      symptoms_details: "Severe pain in lower back",
      medical_service_type: "Physical therapy",
      service_provider_name: "ABC Medical Center",
      other_insurance_provider: false,
      consent: true,
    });

    expect(response.status).toBe(400);
  });
  it("should return 500 when the data base is non functional", async () => {
    const response = await request(app).post("/api/form").send({
      policy_number: "12345678",
      customer_id: "CUST001",
      condition_claimed_for: "Back pain",
      first_symptoms_date: "2023-05-01",
      symptoms_details: "Severe pain in lower back",
      medical_service_type: "Physical therapy",
      service_provider_name: "ABC Medical Center",
      other_insurance_provider: false,
      consent: true,
    });

    expect(response.status).toBe(500);
  });
});
