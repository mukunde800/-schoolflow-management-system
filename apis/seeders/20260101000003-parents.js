'use strict';
const { uuids } = require('../seed-utils');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('parents', [
      { id: uuids.parent1, user_id: uuids.parentUser1, profession: 'Ingénieur', address: 'Bujumbura, Rohero', relationship: 'father', created_at: now, updated_at: now },
      { id: uuids.parent2, user_id: uuids.parentUser2, profession: 'Médecin', address: 'Bujumbura, Kiriri', relationship: 'mother', created_at: now, updated_at: now },
      { id: uuids.parent3, user_id: uuids.parentUser3, profession: 'Commerçant', address: 'Bujumbura, Buyenzi', relationship: 'father', created_at: now, updated_at: now },
      { id: uuids.parent4, user_id: uuids.parentUser4, profession: 'Avocate', address: 'Bujumbura, Kinindo', relationship: 'mother', created_at: now, updated_at: now },
      { id: uuids.parent5, user_id: uuids.parentUser5, profession: 'Enseignant', address: 'Bujumbura, Gihosha', relationship: 'guardian', created_at: now, updated_at: now },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('parents', null, {});
  },
};