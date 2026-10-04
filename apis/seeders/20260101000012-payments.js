'use strict';
const { uuids } = require('../seed-utils');

const types = ['inscription', 'scolarite', 'cantine', 'transport'];
const methods = ['cash', 'card', 'transfer', 'mobile'];
const statuses = ['paid', 'paid', 'paid', 'pending', 'overdue'];

module.exports = {
    async up(queryInterface) {
        const now = new Date();
        const payments = [];
        let count = 0;

        for (let s = 1; s <= 10; s++) {
            for (let p = 0; p < 3; p++) {
                count++;
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                payments.push({
                    id: `b0000000-0000-0000-0000-${String(count).padStart(12, '0')}`,
                    student_id: uuids[`student${s}`],
                    amount: [150.00, 300.00, 500.00, 200.00][Math.floor(Math.random() * 4)],
                    type: types[Math.floor(Math.random() * types.length)],
                    status,
                    due_date: '2024-12-31',
                    paid_date: status === 'paid' ? '2024-10-15' : null,
                    method: status === 'paid' ? methods[Math.floor(Math.random() * methods.length)] : null,
                    reference: `REF-${1000 + count}`,
                    notes: null,
                    created_at: now,
                    updated_at: now,
                });
            }
        }

        await queryInterface.bulkInsert('payments', payments);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete('payments', null, {});
    },
};