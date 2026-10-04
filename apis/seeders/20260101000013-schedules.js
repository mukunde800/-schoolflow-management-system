'use strict';
const { uuids } = require('../seed-utils');

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const slots = [
    { start: '08:00:00', end: '10:00:00' },
    { start: '10:15:00', end: '12:15:00' },
    { start: '14:00:00', end: '16:00:00' },
];
const subjects = [uuids.subjectMath, uuids.subjectFr, uuids.subjectScience, uuids.subjectHistory, uuids.subjectEnglish];

module.exports = {
    async up(queryInterface) {
        const now = new Date();
        const schedules = [];
        let count = 0;

        for (const classId of [uuids.class1, uuids.class2, uuids.class3]) {
            for (const day of days) {
                for (let i = 0; i < 3; i++) {
                    count++;
                    schedules.push({
                        id: `c0000000-0000-0000-0000-${String(count).padStart(12, '0')}`,
                        class_id: classId,
                        subject_id: subjects[Math.floor(Math.random() * subjects.length)],
                        teacher_id: [uuids.teacher1, uuids.teacher2, uuids.teacher3, uuids.teacher4][Math.floor(Math.random() * 4)],
                        day_of_week: day,
                        start_time: slots[i].start,
                        end_time: slots[i].end,
                        room: `Salle ${100 + i}`,
                        created_at: now,
                        updated_at: now,
                    });
                }
            }
        }

        await queryInterface.bulkInsert('schedules', schedules);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete('schedules', null, {});
    },
};