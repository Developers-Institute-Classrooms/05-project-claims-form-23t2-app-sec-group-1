const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");

const checkJwt = auth({
  audience: "https://AppSecProjectAPI.com",
  issuerBaseURL: "https://dev-maux72b4.us.auth0.com/",
});

const checkScopes = requiredScopes("admin:claims");

module.exports = {
  checkJwt,
  checkScopes,
};
