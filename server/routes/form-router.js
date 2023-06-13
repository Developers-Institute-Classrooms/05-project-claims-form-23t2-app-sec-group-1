const express = require("express");
const formRouter = express.Router();
const dataValidate = require("../middleware/dataValidation");
const {
  encodingMiddleware,
  encryptionMiddleware,
} = require("./encryptionMiddleware");
const crypto = require("crypto");
const { auth } = require("express-oauth2-jwt-bearer");
const formRepository = require("./form-router.repository");

const checkJwt = auth();

const checkPermissions = (req, res, next) => {
  if (!req.auth.payload.permissions.includes("admin:claims")) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

// Get dashboard route
formRouter.get("/dashboard", checkJwt, async (req, res, next) => {
  try {
    if (req.auth.payload.permissions.includes("admin:claims")) {
      const adminClaims = await formRepository.allClaimsForAdmin();
      res.json({ claims: adminClaims, role: "Admin" });
    } else {
      const auth0ID = req.auth.payload.sub;
      const userClaims = await formRepository.allClaimsForUser(auth0ID);
      res.json({ claims: userClaims, role: null });
    }
  } catch (err) {
    next(err);
  }
});

// post claim route
formRouter.post(
  "/",
  checkJwt,
  encodingMiddleware,
  encryptionMiddleware(process.env.ENCRYPTION_KEY),
  dataValidate,
  async (req, res, next) => {
    try {
      // Decrypt the data
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        process.env.ENCRYPTION_KEY,
        Buffer.from(req.iv, "hex")
      );
      let decryptedData = "";
      decipher.on("readable", () => {
        let chunk;
        while ((chunk = decipher.read()) !== null) {
          decryptedData += chunk.toString("utf8");
        }
      });
      decipher.on("end", () => {
        req.decryptedData = JSON.parse(decryptedData);
        next();
      });
      decipher.on("error", (err) => {
        next(err);
      });
      decipher.write(req.encryptedData, "hex");
      decipher.end();
    } catch (err) {
      next(err);
    }
  },
  async (req, res, next) => {
    try {
      const postClaimsForm = await formRepository.postClaimsForm(
        req.decryptedData,
        res,
        next
      );

      console.info(
        JSON.stringify({
          timestamp: postClaimsForm.created_at,
          route_name: "/api/form",
          route_type: "POST",
          claim_id: postClaimsForm.claim_id,
        })
      );

      res.status(201).json(postClaimsForm);
    } catch (err) {
      next(err);
    }
  }
);

formRouter.put("/profile", checkJwt, async (req, res) => {
  try {
    const auth0ID = req.auth.payload.sub;
    const user = await formRepository.updateUser(auth0ID, req.body);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

formRouter.put(
  "/:claim_id",
  checkJwt,
  checkPermissions,
  async (req, res, next) => {
    const { status } = req.body;
    const { claim_id } = req.params;

    try {
      const updatedClaim = await formRepository.updateClaimStatus(
        claim_id,
        status
      );
      res.json(updatedClaim);
    } catch (err) {
      next(err);
    }
  }
);

formRouter.get("/profile", checkJwt, async (req, res, next) => {
  try {
    const auth0ID = req.auth.payload.sub;
    const user = await formRepository.getUserByAuth0ID(auth0ID);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = formRouter;
