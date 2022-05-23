const AuthRoute = require('./AuthRouter');
const RoomRoute = require('./RoomRouter')
const UserRoute = require('./UserRouter')
const MessageRoute = require('./MessageRouter')

const routes = (app) => {
    app.use('/auth', AuthRoute);
    app.use('/api/room', RoomRoute);
    app.use('/api/user', UserRoute);
    app.use('/api/message', MessageRoute);
};

module.exports = routes;