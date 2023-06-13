const express = require('express');
require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const cors = require('cors');
const formRouter = require('./routes/form-router');
const errorMiddleware = require('./middleware/errorHandling');
const BodyParser = require('body-parser');
const { errors } = require('celebrate');
const encryption = require('../middleware/encryption');

// Generate and set the encryption key if it's not present in .env
if (!process.env.ENCRYPTION_KEY) {
    const key = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync('.env', `ENCRYPTION_KEY=${key}`);
    console.log('Encryption key generated and saved to .env file.');
}

// Other middleware and route handlers
app.use(encryption.middleware); // Update middleware name here
app.use(BodyParser.json());
app.use(cors());

app.use('/api/form', formRouter);

app.use(errorMiddleware);
app.use(errors());

module.exports = app;
