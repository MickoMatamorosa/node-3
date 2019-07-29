const jwt = require('jsonwebtoken');
const secret = require('../secret.js');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, secret); // will throw when token is invalid
    next();
  } catch (err) {
    console.error(err);
    res.status(401).end();
  }
}