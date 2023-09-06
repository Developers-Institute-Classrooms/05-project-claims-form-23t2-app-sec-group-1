// Import the necessary testing libraries and the app.js file
const request = require("supertest");
const app = require("./app");
const formRepository = require("./routes/form-router.repository");

// Mock the formRepository functions
jest.mock("./routes/form-router.repository", () => ({
  allClaimsForAdmin: jest
    .fn()
    .mockResolvedValue([{ claimId: 1, claimStatus: "Approved" }]),
  allClaimsForUser: jest
    .fn()
    .mockResolvedValue([{ claimId: 2, claimStatus: "Pending" }]),
}));

describe("GET /dashboard", () => {
  test("should return the dashboard data for admin", async () => {
    // Mock the checkJwt middleware
    const mockCheckJwt = jest.fn((req, res, next) => {
      req.auth = { payload: { permissions: ["admin:claims"] } };
      next();
    });

    // Replace the actual route handler with the mocked middleware
    app.get(
      "/api/form/dashboard",
      mockCheckJwt,
      require("./routes/form-router").dashboard
    );

    const response = await request(app).get("/api/form/dashboard");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("claims");
    expect(response.body).toHaveProperty("role", "Admin");
    // Add more assertions based on the expected response data

    // Verify that the formRepository function was called
    expect(formRepository.allClaimsForAdmin).toHaveBeenCalled();
  });

  test("should return the dashboard data for user", async () => {
    // Mock the checkJwt middleware
    const mockCheckJwt = jest.fn((req, res, next) => {
      req.auth = { payload: { permissions: [] } };
      next();
    });

    // Replace the actual route handler with the mocked middleware
    app.get(
      "/api/form/dashboard",
      mockCheckJwt,
      require("./routes/form-router").dashboard
    );

    const response = await request(app).get("/api/form/dashboard");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("claims");
    expect(response.body).toHaveProperty("role", null);
    // Add more assertions based on the expected response data

    // Verify that the formRepository function was called
    expect(formRepository.allClaimsForUser).toHaveBeenCalled();
  });
});
