'use strict';
require('dotenv').config();
const { sequelize } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connecté à MySQL');

    const [tables] = await sequelize.query('SHOW TABLES');
    if (!tables.length) {
      console.log('⚠️  Aucune table à vider');
      process.exit(0);
    }

    const tableKey = Object.keys(tables[0])[0];
    const tableNames = tables.map((t) => t[tableKey]);

    console.log(`📋 ${tableNames.length} tables trouvées`);

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    for (const table of tableNames) {
      await sequelize.query(`TRUNCATE TABLE \`${table}\``);
      console.log(`🧹 ${table} vidée`);
    }

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('\n✅ Base de données vidée avec succès !');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur :', err.message);
    process.exit(1);
  }
})();