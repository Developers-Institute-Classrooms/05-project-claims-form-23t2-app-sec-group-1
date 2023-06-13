const express = require("express");
const formRouter = express.Router();
const dataValidate = require("../middleware/dataValidation");
const { auth } = require("express-oauth2-jwt-bearer");
const formRepository = require("./form-router.repository");
const crypto = require("crypto");
const generateKey = require("../generateKey");

const checkJwt = auth();

const checkPermissions = (req, res, next) => {
  if (!req.auth.payload.permissions.includes("admin:claims")) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

// Encoding Middleware
const encodingMiddleware = (req, res, next) => {
  const body = req.body;
  for (const key in body) {
    if (typeof body[ key ] === "string") {
      body[ key ] = Buffer.from(body[ key ]).toString("base64");
    }
  }
  next();
};

// Encryption Middleware
const encryptionMiddleware = (req, res, next) => {
  const algorithm = "aes-256-cbc";
  const key = generateKey(); // Generate the encryption key
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encryptedData = "";
  cipher.on("readable", () => {
    let chunk;
    while ((chunk = cipher.read()) !== null) {
      encryptedData += chunk.toString("hex");
    }
  });

  cipher.on("end", () => {
    req.encryptedData = encryptedData;
    next();
  });

  cipher.write(JSON.stringify(req.body));
  cipher.end();
};

// Decoding Middleware
const decodingMiddleware = (req, res, next) => {
  const body = req.decryptedData;
  for (const key in body) {
    if (typeof body[ key ] === "string") {
      body[ key ] = Buffer.from(body[ key ], "base64").toString("utf8");
    }
  }
  next();
};

// Decryption Middleware
const decryptionMiddleware = (req, res, next) => {
  const algorithm = "aes-256-cbc";
  const key = req.decryptionKey;
  const iv = crypto.randomBytes(16);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decryptedData = "";
  decipher.on("readable", () => {
    let chunk;
    while ((chunk = decipher.read()) !== null) {
      decryptedData += chunk.toString("utf8");
    }
  });

  decipher.on("end", () => {
    req.decryptedData = decryptedData;
    next();
  });

  decipher.write(req.encryptedData, "hex");
  decipher.end();
};

formRouter.use((req, res, next) => {
  const decryptionKey = process.env.ENCRYPTION_KEY || generateKey(); // Use existing key or generate a new one
  if (!decryptionKey) {
    return res.status(500).json({ error: "Encryption key is missing" });
  }
  req.decryptionKey = decryptionKey;
  next();
});

formRouter.use(decryptionMiddleware);
formRouter.use(decodingMiddleware);

// Login into Auth0 with client@blablabla.com ClientPassword1
// Login into Auth0 with admin@blablabla.com AdminPassword1

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
  encryptionMiddleware,
  dataValidate,
  async (req, res, next) => {
    try {
      const postClaimsForm = await formRepository.postClaimsForm(
        req,
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
    console.log(auth0ID);
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
