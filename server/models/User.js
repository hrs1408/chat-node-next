const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String },
        full_name: { type: String },
        number_phone: { type: String },
        address: { type: String },
        status: { type: Number, default: 1 },
        rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        friend_pending: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        is_active: { type: Boolean, default: true },
        googleId: { type: String },
        facebookId: { type: String },
        is_first_login: { type: Boolean, default: true },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", userSchema);
