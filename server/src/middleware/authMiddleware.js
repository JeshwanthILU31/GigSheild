const jwt = require('jsonwebtoken');
const Worker = require('../models/Worker');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token missing or malformed'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const worker = await Worker.findById(decoded.workerId);

    if (!worker) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    req.worker = worker;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = {
  protect
};
