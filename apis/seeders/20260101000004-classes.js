'use strict';
const { uuids } = require('../seed-utils');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('classes', [
      { id: uuids.class1, name: '6ème A', level: '6ème', academic_year: '2024-2025', capacity: 40, room: 'Salle 101', description: 'Classe de 6ème A', created_at: now, updated_at: now },
      { id: uuids.class2, name: '6ème B', level: '6ème', academic_year: '2024-2025', capacity: 40, room: 'Salle 102', description: 'Classe de 6ème B', created_at: now, updated_at: now },
      { id: uuids.class3, name: '5ème A', level: '5ème', academic_year: '2024-2025', capacity: 35, room: 'Salle 201', description: 'Classe de 5ème A', created_at: now, updated_at: now },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('classes', null, {});
  },
};