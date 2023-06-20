const CryptoJS = require("crypto-js");


const encodeData = (data) => {
    const wordArray = CryptoJS.enc.Utf8.parse(data);
    const base64 = CryptoJS.enc.Base64.stringify(wordArray);
    return base64;
};

const decodeData = (encodedData) => {
    const parsedWordArray = CryptoJS.enc.Base64.parse(encodedData);
    const parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
    return parsedStr;
};

module.exports = {
    encodeData,
    decodeData,
};
