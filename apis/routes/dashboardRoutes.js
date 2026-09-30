const router = require('express').Router();
const ctrl = require('../controller/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/stats', ctrl.getStats);
router.get('/activities', ctrl.getRecentActivities);
router.get('/attendance-chart', ctrl.getAttendanceChart);
router.get('/grade-distribution', ctrl.getGradeDistribution);

module.exports = router;