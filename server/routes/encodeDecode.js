const encodeData = (data) => {
    const encodedData = Buffer.from(JSON.stringify(data)).toString("base64");
    return encodedData;
};

const decodeData = (encodedData) => {
    const decodedData = JSON.parse(
        Buffer.from(encodedData, "base64").toString("utf-8")
    );
    return decodedData;
};

module.exports = { encodeData, decodeData };
