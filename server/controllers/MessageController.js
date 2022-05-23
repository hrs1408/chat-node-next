const isBase64 = require('is-base64');
const Message = require('../models/Message');
const ResponseObject = require('../models/ResponseObject');
const randomstring = require("randomstring");
const fs = require('fs');

class MessageController {

    async findByRoomId(req, res) {
        const limit = req.query.limit || 10;

        try {
            await Message.find({room: req.params.roomId})
                .sort({createdAt: -1})
                .limit(limit)
                .populate('owner', '_id email full_name avatar')
                .then(data => {
                    return res.status(200)
                        .json(ResponseObject(200, 'Find Message By Room Id Success', data));
                });
        } catch (e) {
            return res.status(500).json(ResponseObject(500, e.message))
        }
    }

    async sendMessage(req, res) {
        try {
            const roomId = req.params.roomId;
            const {text, images, type} = req.body;

            let message = new Message();
            text && (message.text = text);

            message.owner = req.userId;
            message.room = roomId;
            if (type) {
                message.message_type = type
                message.owner = null
            }

            let imagesId = [];

            if (images && images.length > 0) {


                images.forEach(image => {
                    let base64 = image.split(';base64,').pop();
                    let type = image.split(';')[0].split('/')[1];
                    if (isBase64(base64)) {
                        console.log(type)
                        const newNameAvatar = `${randomstring.generate()}.${type}`;
                        const nameAvatar = `http://localhost:${process.env.PORT}/images/${newNameAvatar}`;
                        imagesId = [...imagesId, nameAvatar];
                        fs.writeFile(`public/images/${newNameAvatar}`, base64, {encoding: 'base64'}, function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('File created');
                            }
                        })
                    }
                })
            }

            message.image = imagesId;
            message.save();


            message = await Message.populate(message, {path: "owner", select: "_id email full_name avatar"})


            req.io.in(roomId).emit('chat_message', message);

            return res.status(200).json(ResponseObject(200, 'Send Message Success', message));
        } catch (e) {
            return res.status(500).json(ResponseObject(500, e.message))
        }

    }
}

module.exports = new MessageController();