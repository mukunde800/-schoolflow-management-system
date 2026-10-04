const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

(async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Connexion MySQL établie');

    // ⚠️ À lancer UNE FOIS pour créer les tables (en dev)
    await sequelize.sync({ alter: true });
    logger.info('✅ Tables synchronisées');

    app.listen(env.port, () =>
      logger.info(`🚀 Serveur démarré sur http://localhost:${env.port}`)
    );
  } catch (err) {
    logger.error('❌ Erreur démarrage :', err);
    process.exit(1);
  }
})();