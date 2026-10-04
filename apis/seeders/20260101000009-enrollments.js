'use strict';
const { uuids } = require('../seed-utils');

module.exports = {
    async up(queryInterface) {
        const now = new Date();
        const enrollments = [];

        for (let i = 1; i <= 10; i++) {
            const classId = i <= 4 ? uuids.class1 : i <= 7 ? uuids.class2 : uuids.class3;

            // ✅ padStart garantit exactement 12 caractères
            const paddedId = String(i).padStart(12, '0');
            const enrollmentId = `80000000-0000-0000-0000-${paddedId}`;
            // Pour i=1  → "80000000-0000-0000-0000-000000000001"
            // Pour i=10 → "80000000-0000-0000-0000-000000000010"

            enrollments.push({
                id: enrollmentId,
                student_id: uuids[`student${i}`],
                class_id: classId,
                academic_year: '2024-2025',
                status: 'confirmed',
                date: '2024-09-01',
                notes: null,
                created_at: now,
                updated_at: now,
            });
        }

        try {
            await queryInterface.bulkInsert('enrollments', enrollments);
            console.log(`✅ ${enrollments.length} inscriptions insérées`);
        } catch (err) {
            console.error('❌ Erreur :', err.message);
            console.error('Parent  :', err.parent?.message);
            throw err;
        }
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('enrollments', null, {});
    },
};