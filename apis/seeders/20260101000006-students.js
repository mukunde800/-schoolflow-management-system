'use strict';
const { uuids } = require('../seed-utils');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const studentRecords = [
      { idx: 1, gender: 'M', birth: '2012-03-15', classId: uuids.class1, parentId: uuids.parent1 },
      { idx: 2, gender: 'F', birth: '2012-06-22', classId: uuids.class1, parentId: uuids.parent2 },
      { idx: 3, gender: 'M', birth: '2012-01-10', classId: uuids.class1, parentId: uuids.parent3 },
      { idx: 4, gender: 'F', birth: '2012-11-05', classId: uuids.class1, parentId: uuids.parent4 },
      { idx: 5, gender: 'M', birth: '2011-08-19', classId: uuids.class2, parentId: uuids.parent5 },
      { idx: 6, gender: 'F', birth: '2011-04-02', classId: uuids.class2, parentId: uuids.parent1 },
      { idx: 7, gender: 'M', birth: '2011-09-12', classId: uuids.class2, parentId: uuids.parent2 },
      { idx: 8, gender: 'F', birth: '2011-12-25', classId: uuids.class3, parentId: uuids.parent3 },
      { idx: 9, gender: 'M', birth: '2010-05-30', classId: uuids.class3, parentId: uuids.parent4 },
      { idx: 10, gender: 'F', birth: '2010-07-14', classId: uuids.class3, parentId: uuids.parent5 },
    ];

    await queryInterface.bulkInsert('students', studentRecords.map((s) => ({
      id: uuids[`student${s.idx}`],
      user_id: uuids[`studentUser${s.idx}`],
      matricule: `STU-2024-${String(s.idx).padStart(3, '0')}`,
      birth_date: s.birth,
      gender: s.gender,
      address: 'Bujumbura, Burundi',
      city: 'Bujumbura',
      parent_id: s.parentId,
      class_id: s.classId,
      enrollment_date: '2024-09-01',
      status: 'active',
      notes: null,
      created_at: now,
      updated_at: now,
    })));
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('students', null, {});
  },
};