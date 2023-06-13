const crypto = require("crypto");

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
    const key = crypto.randomBytes(32);
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

// Decryption Middleware
const decryptionMiddleware = (req, res, next) => {
    const algorithm = "aes-256-cbc";
    const key = crypto.randomBytes(32);
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

module.exports = {
    encodingMiddleware,
    encryptionMiddleware,
    decryptionMiddleware,
    decodingMiddleware,
};
