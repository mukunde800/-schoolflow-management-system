const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.method} ${req.url}`);

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'Conflit de données',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Erreur de validation',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Erreur serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};