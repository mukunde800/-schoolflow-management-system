'use strict';
const { uuids } = require('../seed-utils');

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('TeacherSubjects', [
            { teacher_id: uuids.teacher1, subject_id: uuids.subjectMath, created_at: new Date(), updated_at: new Date() },
            { teacher_id: uuids.teacher2, subject_id: uuids.subjectFr, created_at: new Date(), updated_at: new Date() },
            { teacher_id: uuids.teacher2, subject_id: uuids.subjectEnglish, created_at: new Date(), updated_at: new Date() },
            { teacher_id: uuids.teacher3, subject_id: uuids.subjectScience, created_at: new Date(), updated_at: new Date() },
            { teacher_id: uuids.teacher4, subject_id: uuids.subjectHistory, created_at: new Date(), updated_at: new Date() },
            { teacher_id: uuids.teacher1, subject_id: uuids.subjectSports, created_at: new Date(), updated_at: new Date() },
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete('TeacherSubjects', null, {});
    },
};