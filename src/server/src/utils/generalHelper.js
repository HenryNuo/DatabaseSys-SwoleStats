const { validationResult } = require('express-validator');




//Middleware using Express-Validator to check if is an error in req
const expressValidatorChecker = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
}





module.exports = {
    expressValidatorChecker
};