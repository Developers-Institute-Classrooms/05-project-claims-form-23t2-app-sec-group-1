const captchaCheck = async (req, res, next) => {
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.API_KEY}&response=${req.body.captcha}`
    );
    const data = await response.json();
    if (data.success === true) {
      next();
    } else {
      res.status(400).send("ERROR Invalid Captcha");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = captchaCheck;
