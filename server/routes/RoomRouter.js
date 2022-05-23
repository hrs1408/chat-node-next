const router = require('express').Router();
const RoomController = require('../controllers/RoomController');
const auth = require('../middleware/Authentication');

router.get('/', RoomController.findAll);
router.post('/', auth, RoomController.create);
router.put('/change-room-name', auth, RoomController.changeRoomName);
router.put('/change-room-avatar', auth, RoomController.changeRoomAvatar);
router.put('/add-member-to-room', auth, RoomController.addMemberToRoom);
router.get('/leave-room/:roomId', auth, RoomController.leaveRoom);
router.get('/:roomId', auth, RoomController.findById);

module.exports = router;
