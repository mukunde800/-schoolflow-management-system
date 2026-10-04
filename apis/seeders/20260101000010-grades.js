'use strict';
const { uuids } = require('../seed-utils');

const subjects = [
    uuids.subjectMath, uuids.subjectFr, uuids.subjectScience,
    uuids.subjectHistory, uuids.subjectEnglish,
];

const randomGrade = () => (Math.random() * 12 + 7).toFixed(2); // entre 7 et 19
const types = ['devoir', 'examen', 'interrogation', 'tp'];

module.exports = {
    async up(queryInterface) {
        const now = new Date();
        const grades = [];
        let count = 0;

        for (let s = 1; s <= 10; s++) {
            for (const subjectId of subjects) {
                for (let g = 0; g < 3; g++) {
                    count++;
                    grades.push({
                        id: `90000000-0000-0000-0000-${String(count).padStart(12, '0')}`,
                        student_id: uuids[`student${s}`],
                        subject_id: subjectId,
                        teacher_id: uuids.teacher1,
                        value: randomGrade(),
                        coefficient: 1,
                        type: types[Math.floor(Math.random() * types.length)],
                        semester: 1,
                        date: `2024-${String(10 + (g % 3)).padStart(2, '0')}-${String(10 + g).padStart(2, '0')}`,
                        comment: null,
                        created_at: now,
                        updated_at: now,
                    });
                }
            }
        }

        // Insert par chunks pour éviter les timeouts
        const chunkSize = 100;
        for (let i = 0; i < grades.length; i += chunkSize) {
            await queryInterface.bulkInsert('grades', grades.slice(i, i + chunkSize));
        }
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete('grades', null, {});
    },
};