const router = require('express').Router();
const MessageController = require('../controllers/MessageController');
const auth = require('../middleware/Authentication')

router.get('/:roomId', auth, MessageController.findByRoomId);
router.post('/:roomId', auth, MessageController.sendMessage);

module.exports = router;