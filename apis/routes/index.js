const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/students', require('./studentRoutes'));
router.use('/teachers', require('./teacherRoutes'));
router.use('/classes', require('./classRoutes'));
router.use('/grades', require('./gradeRoutes'));
router.use('/attendances', require('./attendanceRoutes'));
router.use('/announcements', require('./announcementRoutes'));
router.use('/schedules', require('./scheduleRoutes'));
router.use('/subjects', require('./subjectRoutes'));
router.use('/payments', require('./paymentRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/settings', require('./settingRoutes'));
router.use('/users', require('./userRoutes'));


module.exports = router;