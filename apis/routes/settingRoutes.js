const router = require('express').Router();
const ctrl = require('../controller/settingController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect, authorize('admin'));

router.get('/', ctrl.getAll);
router.post('/', ctrl.upsert);
router.delete('/', ctrl.reset);

module.exports = router;