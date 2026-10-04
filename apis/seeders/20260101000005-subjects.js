'use strict';
const { uuids } = require('../seed-utils');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('subjects', [
      { id: uuids.subjectMath, name: 'Mathématiques', code: 'MATH', coefficient: 4, description: 'Cours de mathématiques', created_at: now, updated_at: now },
      { id: uuids.subjectFr, name: 'Français', code: 'FR', coefficient: 4, description: 'Cours de français', created_at: now, updated_at: now },
      { id: uuids.subjectScience, name: 'Sciences', code: 'SCI', coefficient: 3, description: 'Sciences physiques et SVT', created_at: now, updated_at: now },
      { id: uuids.subjectHistory, name: 'Histoire-Géographie', code: 'HIST', coefficient: 2, description: 'Histoire et géographie', created_at: now, updated_at: now },
      { id: uuids.subjectEnglish, name: 'Anglais', code: 'ANG', coefficient: 2, description: 'Cours d\'anglais', created_at: now, updated_at: now },
      { id: uuids.subjectSports, name: 'Éducation physique', code: 'EPS', coefficient: 1, description: 'Sport', created_at: now, updated_at: now },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('subjects', null, {});
  },
};