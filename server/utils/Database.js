const mongoose = require('mongoose');

const connection = async (uri, callback) => {
    try {
        const connect = await mongoose.connect(process.env.URL_MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Mongoose connection success on host ${connect.connection.host}`);
    } catch (err) {
        console.log(err);
    }
};

module.exports = connection;