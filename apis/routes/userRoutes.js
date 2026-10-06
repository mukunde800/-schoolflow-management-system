const router = require('express').Router();
const ctrl = require('../controller/userController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);
router.post('/change-password', ctrl.changePassword);
router.get('/stats', ctrl.getStats);
router.delete('/deactivate', ctrl.deactivateAccount);

module.exports = router;