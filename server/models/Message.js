const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        room: {type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true},
        owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        text: {type: String},
        image: [{type: String}],
        message_type: {type: String, enum: ["message", "notify"], default: "message"},
    },
    {timestamps: true}
);

module.exports = mongoose.model("Message", messageSchema);