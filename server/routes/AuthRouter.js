const passport = require("passport");
const router = require('express').Router();
const LoginController = require('../controllers/AuthController');

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/google/callback', passport.authenticate('google'), LoginController.getToken);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }))
router.get('/facebook/callback', passport.authenticate('facebook'), LoginController.getToken);

router.post('/login', LoginController.login);

module.exports = router;