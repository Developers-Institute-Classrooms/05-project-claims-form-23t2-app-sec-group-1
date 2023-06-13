const crypto = require("crypto");
require("dotenv").config(); // Load environmental variables from .env file

const generateKey = (authEnabled) => {
    if (!authEnabled) {
        // Authentication is disabled, return a default key
        return process.env.ENCRYPTION_KEY || "defaultEncryptionKey";
    }

    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (encryptionKey) {
        // Key already exists in the environment, use it
        return encryptionKey;
    }

    // Generate a new key
    const key = crypto.randomBytes(32).toString("hex");
    process.env.ENCRYPTION_KEY = key;

    return key;
};

// Usage example:
const authEnabled = true; // Set this flag based on your authentication configuration
const encryptionKey = generateKey(authEnabled);
console.log(encryptionKey);
