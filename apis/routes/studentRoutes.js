const router = require('express').Router();
const ctrl = require('../controller/studentController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.get('/', authorize('admin', 'teacher'), ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', authorize('admin'), ctrl.create);
router.put('/:id', authorize('admin'), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);
router.get('/:id/grades', ctrl.getGrades);
router.get('/:id/attendance', ctrl.getAttendance);

module.exports = router;