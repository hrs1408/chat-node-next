const {GROUP_ROOM} = require('../constants/RoomType');
const Message = require('../models/Message');
const ResponseObject = require('../models/ResponseObject')
const Room = require('../models/Room')
const User = require('../models/User')
const {isBase64} = require("validator");
const fs = require("fs");

class RoomController {

    async findAll(req, res) {
        try {
            await Room.find({}).then(data => {
                return res.status(200).json(ResponseObject(200, 'Find All Room Success', data));
            })
        } catch (e) {
            return res.json(ResponseObject(500, e.message))
        }
    }

    async changeRoomAvatar(req, res) {
        try {
            const {roomId, avatar} = req.body;

            const base64 = avatar.split(';base64,').pop();
            const type = avatar.split(';')[0].split('/')[1];

            let nameAvatar = null;

            if (isBase64(base64)) {
                const newNameAvatar = `avatar-${roomId}-${Date.now()}.${type}`;
                nameAvatar = `http://localhost:${process.env.PORT}/images/${newNameAvatar}`;
                await fs.writeFile(`public/images/${newNameAvatar}`, base64, {encoding: 'base64'}, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('File created');
                    }
                })
            }

            const room = await Room.findByIdAndUpdate({_id: roomId}, {avatar: nameAvatar}, {new: true});
            const user = await User.findById(req.userId);

            const messageNotify = new Message();
            messageNotify.text = `${user.full_name} đã thay đổi ảnh nhóm`;
            messageNotify.type = 'notify';
            messageNotify.room = roomId;
            messageNotify.owner = null;
            messageNotify.save()

            await req.io.in(roomId).emit('change_avatar_room', messageNotify);

            return res.status(200).json(ResponseObject(200, 'Change Avatar Room Success'));
        } catch (e) {
            return res.json(ResponseObject(500, e.message))
        }
    }

    async addMemberToRoom(req, res) {
        try {
            const userId = req.userId;
            const {roomId, members} = req.body;

            const user = await User.findById(userId);
            const room = await Room.findByIdAndUpdate(
                {_id: roomId},
                {$addToSet: {members: {$each: members}}}, {new: true})
                .populate([
                    {
                        path: 'members',
                        select: 'full_name avatar',
                    },
                    {
                        path: 'owner',
                        select: 'full_name avatar',
                    }
                ]);

            await User.updateMany({_id: {$in: members}}, {$addToSet: {rooms: roomId}});

            const messageNotify = new Message();
            messageNotify.text = `${user.full_name} đã thêm thành viên vào nhóm`;
            messageNotify.message_type = 'notify';
            messageNotify.room = roomId;
            messageNotify.owner = null;
            messageNotify.save()

            await req.io.in(roomId).emit('add_member_to_room', messageNotify);

            await members.forEach((u) => {
                req.io.in(u._id.toString()).emit('new_room', room);
            });

            return res.status(200).json(ResponseObject(200, 'Add Member To Room Success'));
        } catch (e) {
            return res.status(500).json(ResponseObject(500, e.message))
        }
    }

    async changeRoomName(req, res) {
        try {
            const {roomName, roomId} = req.body;

            const room = await Room.findByIdAndUpdate(roomId, {name: roomName}, {new: true});
            const user = await User.findById(req.userId);

            let messageNotify = new Message();
            messageNotify.text = `${user.full_name} đã đổi tên phòng thành ${roomName}`;
            messageNotify.owner = null;
            messageNotify.message_type = 'notify';
            messageNotify.room = roomId;
            messageNotify.save();

            await req.io.in(roomId).emit('change_room_name', messageNotify);

            return res.status(200).json(ResponseObject(200, 'Change Room Name Success'));
        } catch (e) {
            return res.json(ResponseObject(500, e.message))
        }
    }

    async create(req, res) {
        try {
            const {members, name} = req.body;

            const memberList = [...members, req.userId];

            let newRoom = new Room();
            newRoom.name = name;
            newRoom.members = memberList;
            newRoom.owner = req.userId;
            newRoom.room_type = GROUP_ROOM;
            newRoom.save();

            newRoom = await Room.populate(newRoom, [
                {path: 'members', select: '_id email full_name avatar'},
                {path: 'owner', select: '_id email full_name avatar'}
            ]);

            await User.updateMany({_id: {$in: newRoom.members}}, {$push: {rooms: newRoom._id}});

            await memberList.forEach((u) => {
                req.io.in(u).emit('new_room', newRoom);
            });

            return res.status(200).json(ResponseObject(200, 'Create Room Success', newRoom));

        } catch (e) {
            return res.json(ResponseObject(500, e.message))
        }
    }

    async leaveRoom(req, res) {
        try {
            const roomId = req.params.roomId;
            const userId = req.userId;

            const room = await Room.findOne({_id: roomId}).populate([
                {path: 'members', select: '_id email full_name avatar'},
                {path: 'owner', select: '_id email full_name avatar'}
            ]);

            if (!room) {
                return res.status(404).json(ResponseObject(404, 'Room Not Found'));
            }

            if (room.owner._id.toString() === userId) {
                await User.updateMany({rooms: roomId}, {$pull: {rooms: roomId}});
                await Message.deleteMany({room: roomId});
                await Room.findByIdAndDelete(roomId);

                await req.io.in(room._id.toString()).emit('delete_room', room);

                return res.status(200).json(ResponseObject(200, 'Delete Room Success'));
            }

            const index = room.members.indexOf(userId);

            if (index > -1) {
                room.members.splice(index, 1);
                room.save();
            }

            const user = await User.findByIdAndUpdate({_id: userId}, {$pull: {rooms: roomId}}, {new: true});
            await Room.findByIdAndUpdate({_id: room._id}, {$pull: {members: userId}});

            const message = new Message();
            message.room = room._id;
            message.owner = null;
            message.text = user.full_name + ' đã rời khỏi phòng';
            message.message_type = 'notify';
            message.save();

            await req.io.in(room._id.toString()).emit('leave_room', {
                message,
                roomId: room._id.toString(),
            });

            await req.io.in(userId).emit('user_leave_room', {
                userId: user._id.toString(),
                roomId: room._id.toString()
            });

            return res.status(200).json(ResponseObject(200, 'Leave Room Success'));
        } catch (e) {
            return res.status(500).json(ResponseObject(500, e.message))
        }
    }

    async findById(req, res) {
        try {
            const roomId = req.params.roomId;
            let countMessage = 0;

            await Message.find({room: roomId})
                .then(data => {
                    countMessage = data.length;
                });

            const room = await Room.findById(roomId).populate('members', '_id email full_name avatar');

            if (!room) {
                return res.json(ResponseObject(404, 'Room Not Found'));
            }

            return res.status(200).json(ResponseObject(200, 'Find Room Success', {
                room,
                total_message: countMessage
            }));
        } catch (e) {
            return res.json(ResponseObject(500, e.message))
        }
    }

    update() {

    }

    delete() {

    }
}

module.exports = new RoomController();
