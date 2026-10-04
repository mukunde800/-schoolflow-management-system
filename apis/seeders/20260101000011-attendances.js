'use strict';
const { uuids } = require('../seed-utils');

const statuses = ['present', 'present', 'present', 'present', 'absent', 'late', 'excused'];

module.exports = {
    async up(queryInterface) {
        const now = new Date();
        const attendances = [];
        let count = 0;

        // 30 jours en arrière
        for (let d = 0; d < 30; d++) {
            const date = new Date();
            date.setDate(date.getDate() - d);

            // Skip weekends
            if (date.getDay() === 0 || date.getDay() === 6) continue;

            const dateStr = date.toISOString().slice(0, 10);

            for (let s = 1; s <= 10; s++) {
                count++;
                const classId = s <= 4 ? uuids.class1 : s <= 7 ? uuids.class2 : uuids.class3;
                attendances.push({
                    id: `a0000000-0000-0000-0000-${String(count).padStart(12, '0')}`,
                    student_id: uuids[`student${s}`],
                    class_id: classId,
                    date: dateStr,
                    status: statuses[Math.floor(Math.random() * statuses.length)],
                    justification: null,
                    created_at: now,
                    updated_at: now,
                });
            }
        }

        const chunkSize = 200;
        for (let i = 0; i < attendances.length; i += chunkSize) {
            await queryInterface.bulkInsert('attendances', attendances.slice(i, i + chunkSize));
        }
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete('attendances', null, {});
    },
};