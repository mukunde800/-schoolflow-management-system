const router = require('express').Router();
const ctrl = require('../controller/authController');
const { protect } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const validate = require('../middlewares/validateMiddleware');

router.post('/register', [
  body('email').isEmail(), body('password').isLength({ min: 6 }),
  body('firstName').notEmpty(), body('lastName').notEmpty(),
], validate, ctrl.register);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validate, ctrl.login);
router.get('/me', protect, ctrl.me);

module.exports = router;