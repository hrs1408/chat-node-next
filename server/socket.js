const socket = (io) => {
    io.on("connection", (socket) => {
        socket.on('user_connected', ({ rooms, _id }) => {

            socket.join(_id);
            rooms && rooms.forEach(room => {
                socket.join(room._id);
            })
        })

        socket.on('join_room', (roomId) => {
            socket.join(roomId);
        })
    });

};

module.exports = socket;