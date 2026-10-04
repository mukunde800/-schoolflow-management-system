'use strict';
const { uuids } = require('../seed-utils');

module.exports = {
    async up(queryInterface) {
        const now = new Date();
        await queryInterface.bulkInsert('announcements', [
            {
                id: uuids.announcement1,
                title: 'Réunion parents-professeurs',
                content: 'Une réunion parents-professeurs aura lieu le samedi 15 novembre 2024 à 09h00 dans la grande salle. Votre présence est vivement souhaitée.',
                author_id: uuids.admin,
                target_role: 'all',
                class_id: null,
                priority: 'high',
                published_at: now,
                expires_at: null,
                created_at: now,
                updated_at: now,
            },
            {
                id: uuids.announcement2,
                title: 'Examens du premier trimestre',
                content: 'Les examens du premier trimestre débuteront le lundi 2 décembre 2024. Consultez le calendrier détaillé sur le tableau d\'affichage.',
                author_id: uuids.admin,
                target_role: 'student',
                class_id: null,
                priority: 'normal',
                published_at: now,
                expires_at: null,
                created_at: now,
                updated_at: now,
            },
            {
                id: uuids.announcement3,
                title: 'Fermeture exceptionnelle',
                content: 'L\'établissement sera fermé le vendredi 1er novembre 2024 pour cause de jour férié.',
                author_id: uuids.admin,
                target_role: 'all',
                class_id: null,
                priority: 'normal',
                published_at: now,
                expires_at: null,
                created_at: now,
                updated_at: now,
            },
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete('announcements', null, {});
    },
};