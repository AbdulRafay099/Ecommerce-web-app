const jwt = require('jsonwebtoken'); //https://www.npmjs.com/package/jsonwebtoken

module.exports = function (req, res, next) {
  let token = req.headers["authorization"];

  if (token) {
    jwt.verify(token, "computer-zone", function (err, decoded) {
      if (err) {
        res.json({
          success: false,
          message: 'Failed to authenticate token'
        });
      } else {

        req.decoded = decoded;
        next();

      }
    });

  } else {
    res.status(403).json({
      success: false,
      message: 'No token provided'
    });

  }
}