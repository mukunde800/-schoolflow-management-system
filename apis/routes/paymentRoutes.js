const router = require('express').Router();
const ctrl = require('../controller/paymentController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.get('/', authorize('admin', 'parent'), ctrl.getAll);
router.get('/stats', authorize('admin'), ctrl.getStats);
router.post('/', authorize('admin'), ctrl.create);
router.put('/:id', authorize('admin'), ctrl.update);
router.patch('/:id/pay', authorize('admin'), ctrl.markAsPaid);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;