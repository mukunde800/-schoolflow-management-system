'use strict';
const { uuids } = require('../seed-utils');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('teachers', [
      { id: uuids.teacher1, user_id: uuids.teacherUser1, employee_id: 'TCH-001', hire_date: '2020-09-01', specialization: 'Mathématiques', diploma: 'Master', salary: 800.00, created_at: now, updated_at: now },
      { id: uuids.teacher2, user_id: uuids.teacherUser2, employee_id: 'TCH-002', hire_date: '2019-09-01', specialization: 'Français', diploma: 'Licence', salary: 750.00, created_at: now, updated_at: now },
      { id: uuids.teacher3, user_id: uuids.teacherUser3, employee_id: 'TCH-003', hire_date: '2021-09-01', specialization: 'Sciences', diploma: 'Master', salary: 820.00, created_at: now, updated_at: now },
      { id: uuids.teacher4, user_id: uuids.teacherUser4, employee_id: 'TCH-004', hire_date: '2018-09-01', specialization: 'Histoire-Géo', diploma: 'Doctorat', salary: 950.00, created_at: now, updated_at: now },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('teachers', null, {});
  },
};