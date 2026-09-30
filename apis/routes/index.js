const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/students', require('./studentRoutes'));
router.use('/teachers', require('./teacherRoutes'));
router.use('/classes', require('./classRoutes'));
router.use('/grades', require('./gradeRoutes'));
router.use('/attendances', require('./attendanceRoutes'));
router.use('/payments', require('./paymentRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));

module.exports = router;