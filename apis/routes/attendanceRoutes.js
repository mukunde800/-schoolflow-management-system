const router = require('express').Router();
const ctrl = require('../controller/attendanceController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.get('/', ctrl.getAll);
router.post('/', authorize('admin', 'teacher'), ctrl.create);
router.post('/bulk', authorize('admin', 'teacher'), ctrl.bulkMark);
router.put('/:id', authorize('admin', 'teacher'), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;