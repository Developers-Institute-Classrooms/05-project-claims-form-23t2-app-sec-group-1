const crypto = require('crypto');
const fs = require('fs');

const key = crypto.randomBytes(32).toString('hex');
fs.writeFileSync('.env', `ENCRYPTION_KEY=${key}`);

console.log('Key generated and saved to .env file.');

//Run the generateKey.js file:
//Open your terminal or command prompt.
//Navigate to the directory where the generateKey.js file is located.
//Run the command node generateKey.js.
//This will generate a random encryption key and save it to the.env file.
//After running the script and generating the key, you can use the.env file in your app.js server file or any other relevant files to load the encryption key from the environment variables.;