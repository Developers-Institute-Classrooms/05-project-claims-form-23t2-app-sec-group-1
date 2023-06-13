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

module.exports = {
    checkJwt,
    checkScopes,
    encodingMiddleware,
    encryptionMiddleware,
};
