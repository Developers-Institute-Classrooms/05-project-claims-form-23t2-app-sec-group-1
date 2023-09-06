const keysToEncode = [
  "condition_claimed_for",
  "symptoms_details",
  "medical_service_type",
  "service_provider_name",
  "name",
  "address",
  "emailaddress",
  "phonenumber",
  "nextofkin",
  "preexistingmedicalconditions",
  "bankaccountnumber",
];

const encodeData = (obj) => {
  const encodedObject = {};
  for (let key in obj) {
    if (typeof obj[key] === "string" && keysToEncode.includes(key)) {
      encodedObject[key] = Buffer.from(obj[key]).toString("base64");
    } else {
      encodedObject[key] = obj[key];
    }
  }
  return encodedObject;
};

const decodeData = (obj) => {
  const decodedObject = {};
  for (let key in obj) {
    if (typeof obj[key] === "string" && keysToEncode.includes(key)) {
      decodedObject[key] = Buffer.from(obj[key], "base64").toString("utf-8");
    } else {
      decodedObject[key] = obj[key];
    }
  }
  return decodedObject;
};

module.exports = {
  encodeData,
  decodeData,
};
