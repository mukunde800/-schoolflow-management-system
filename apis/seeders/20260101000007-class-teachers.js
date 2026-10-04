'use strict';
const { uuids } = require('../seed-utils');

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('ClassTeachers', [
            { class_id: uuids.class1, teacher_id: uuids.teacher1, created_at: new Date(), updated_at: new Date() },
            { class_id: uuids.class1, teacher_id: uuids.teacher2, created_at: new Date(), updated_at: new Date() },
            { class_id: uuids.class1, teacher_id: uuids.teacher3, created_at: new Date(), updated_at: new Date() },
            { class_id: uuids.class2, teacher_id: uuids.teacher1, created_at: new Date(), updated_at: new Date() },
            { class_id: uuids.class2, teacher_id: uuids.teacher4, created_at: new Date(), updated_at: new Date() },
            { class_id: uuids.class3, teacher_id: uuids.teacher2, created_at: new Date(), updated_at: new Date() },
            { class_id: uuids.class3, teacher_id: uuids.teacher3, created_at: new Date(), updated_at: new Date() },
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete('ClassTeachers', null, {});
    },
};