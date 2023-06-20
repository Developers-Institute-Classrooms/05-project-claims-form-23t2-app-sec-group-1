const request = require("supertest");
const express = require("express");
const formRouter = require("./form-router");
const formRepository = require("./form-router.repository");
const { auth } = require("express-oauth2-jwt-bearer");

// Mock the dependencies
jest.mock("./form-router.repository", () => ({
  allClaimsForAdmin: jest.fn(),
  allClaimsForUser: jest.fn(),
  getUserByAuth0ID: jest.fn(),
}));

jest.mock("express-oauth2-jwt-bearer", () => ({
  auth: jest.fn(),
}));

describe("Form Router - GET /dashboard", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", formRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all claims for admin when user has admin:claims permission", async () => {
    jest.mock("express-oauth2-jwt-bearer", () => ({
      auth: jest.fn(() => (req, res, next) => {
        req.auth = {
          payload: {
            permissions: ["admin:claims"],
          },
        };
        next();
      }),
    }));

    const adminClaims = [
      {
        claim_id: "123",
        status: "submitted",
        // Add other properties as needed
      },
      // Add more claims as needed
    ];
    formRepository.allClaimsForAdmin.mockResolvedValue(adminClaims);

    const response = await request(app)
      .get("/dashboard")
      .set("Authorization", "Bearer YOUR_ACCESS_TOKEN");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      claims: adminClaims,
      role: "Admin",
    });

    expect(formRepository.allClaimsForAdmin).toHaveBeenCalledTimes(1);
  });

  it("should return user-specific claims when user does not have admin:claims permission", async () => {
    const userClaims = [
      {
        claim_id: "456",
        status: "submitted",
        // Add other properties as needed
      },
      // Add more claims as needed
    ];
    formRepository.allClaimsForUser.mockResolvedValue(userClaims);

    const response = await request(app)
      .get("/dashboard")
      .set("Authorization", "Bearer YOUR_ACCESS_TOKEN");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      claims: userClaims,
      role: null,
    });

    expect(formRepository.allClaimsForUser).toHaveBeenCalledTimes(1);
  });
});
