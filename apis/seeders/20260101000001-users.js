'use strict';
const { uuids, hash } = require('../seed-utils');

const defaultPassword = hash('Password@123');

module.exports = {
    async up(queryInterface) {
        const now = new Date();

        // ==================== ADMIN ====================
        const users = [
            {
                id: uuids.admin,
                email: 'admin@schoolflow.com',
                password: hash('Admin@123'),
                first_name: 'Super',
                last_name: 'Admin',
                phone: '+257 79 00 00 01',
                role: 'admin',
                is_active: true,
                created_at: now,
                updated_at: now,
            },
        ];

        // ==================== TEACHERS ====================
        const teacherData = [
            { id: uuids.teacherUser1, first: 'Jean', last: 'Mbaye', email: 'prof.math@schoolflow.com', phone: '+257 79 11 00 01' },
            { id: uuids.teacherUser2, first: 'Marie', last: 'Niyonzima', email: 'prof.fr@schoolflow.com', phone: '+257 79 11 00 02' },
            { id: uuids.teacherUser3, first: 'Paul', last: 'Kamanzi', email: 'prof.science@schoolflow.com', phone: '+257 79 11 00 03' },
            { id: uuids.teacherUser4, first: 'Claudine', last: 'Uwimana', email: 'prof.histoire@schoolflow.com', phone: '+257 79 11 00 04' },
        ];
        teacherData.forEach((t) => users.push({
            id: t.id, email: t.email, password: defaultPassword,
            first_name: t.first, last_name: t.last, phone: t.phone,
            role: 'teacher', is_active: true, created_at: now, updated_at: now,
        }));

        // ==================== PARENTS ====================
        const parentData = [
            { id: uuids.parentUser1, first: 'Pierre', last: 'Hakizimana', email: 'parent1@example.com' },
            { id: uuids.parentUser2, first: 'Sarah', last: 'Nkunzimana', email: 'parent2@example.com' },
            { id: uuids.parentUser3, first: 'David', last: 'Bizimana', email: 'parent3@example.com' },
            { id: uuids.parentUser4, first: 'Alice', last: 'Mukamana', email: 'parent4@example.com' },
            { id: uuids.parentUser5, first: 'Éric', last: 'Ndayishimiye', email: 'parent5@example.com' },
        ];
        parentData.forEach((p, i) => users.push({
            id: p.id, email: p.email, password: defaultPassword,
            first_name: p.first, last_name: p.last,
            phone: `+257 79 22 00 0${i + 1}`,
            role: 'parent', is_active: true, created_at: now, updated_at: now,
        }));

        // ==================== STUDENTS ====================
        const studentNames = [
            ['Kevin', 'Ndayizeye'], ['Aline', 'Uwase'], ['Brian', 'Ntirandekura'],
            ['Chantal', 'Mukeshimana'], ['Daniel', 'Baraka'], ['Esther', 'Niyigena'],
            ['Fabrice', 'Nshimiyimana'], ['Grace', 'Ingabire'], ['Henri', 'Rwigema'],
            ['Ines', 'Uwera'],
        ];
        studentNames.forEach(([first, last], i) => users.push({
            id: uuids[`studentUser${i + 1}`],
            email: `student${i + 1}@schoolflow.com`,
            password: defaultPassword,
            first_name: first, last_name: last,
            phone: `+257 79 33 00 ${String(i + 1).padStart(2, '0')}`,
            role: 'student', is_active: true, created_at: now, updated_at: now,
        }));

        // ==================== FILTRAGE DES DOUBLONS ====================
        // Récupérer les emails et IDs déjà présents
        const [existing] = await queryInterface.sequelize.query(
            'SELECT id, email FROM users'
        );
        const existingEmails = new Set(existing.map((u) => u.email));
        const existingIds = new Set(existing.map((u) => u.id));

        const newUsers = users.filter(
            (u) => !existingEmails.has(u.email) && !existingIds.has(u.id)
        );

        console.log(`📝 ${users.length} utilisateurs préparés, ${users.length - newUsers.length} déjà présents`);

        if (newUsers.length === 0) {
            console.log('⏭️  Aucun nouvel utilisateur à insérer');
            return;
        }

        try {
            await queryInterface.bulkInsert('users', newUsers);
            console.log(`✅ ${newUsers.length} utilisateurs insérés avec succès`);
        } catch (err) {
            console.error('❌ Erreur :');
            console.error('Message :', err.message);
            console.error('Parent  :', err.parent?.message);
            throw err;
        }
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('users', null, {});
    },
};