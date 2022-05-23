const router = require('express').Router();
const UserController = require('../controllers/UserController')
const auth = require('../middleware/Authentication')

router.get('/', UserController.findAll);
router.get('/get-user', auth, UserController.findById);
router.get('/get-friends', auth, UserController.findAllFriend);
router.get('/get-friend-pending', auth, UserController.findAllFriendPending);
router.post('/change-password', auth, UserController.changePassword);
router.post('/update-user', auth, UserController.updateInfoUser);
router.post('/add-friend', auth, UserController.addFriend);
router.post('/accept-friend', auth, UserController.acceptFriend);
router.post('/cancel-friend', auth, UserController.cancelFriend);
router.post('/cancel-friend-pending', auth, UserController.cancelFriendPending);

module.exports = router;
