const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

(async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Connexion MySQL établie');

    if (env.nodeEnv === 'development') {
      await sequelize.sync({ alter: false });
      logger.info('✅ Modèles synchronisés');
    }

    app.listen(env.port, () => logger.info(`🚀 Serveur démarré sur http://localhost:${env.port}`));
  } catch (err) {
    logger.error('❌ Erreur démarrage :', err);
    process.exit(1);
  }
})();