const jwt = require('jsonwebtoken');
const ResponseObject = require('../models/ResponseObject');
const User = require('../models/User');
const bcrypt = require('bcrypt');

class AuthController {

    async getToken(req, res) {
        if (req.user) {
            const data = {
                _id: req.user._id
            }
            const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1d' });

            const user = await User.findById(req.user._id, { _id: 1, email: 1, full_name: 1, is_first_login: 1 });

            const response = {
                token,
                expires_in: 1000 * 60 * 60 * 24,
                token_type: "Bearer",
                user
            }

            return res.status(200).json(ResponseObject(200, "success", response));
        } else {
            return res.status(400).json(ResponseObject(400, 'Authentication failed!'))
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json(ResponseObject(400, 'User not found!'));
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json(ResponseObject(400, 'Password is incorrect!'));
            }
            if (!user.is_active) {
                return res.status(400).json(ResponseObject(400, 'User is not active!'));
            }

            const data = {
                _id: user._id
            }
            const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1d' });

            const response = {
                token,
                expires_in: 1000 * 60 * 60 * 24,
                token_type: "Bearer",
            }

            return res.status(200).json(ResponseObject(200, "success", response));
        } catch (e) {
            return res.status(500).json(ResponseObject(500, e.message));
        }
    }
}

module.exports = new AuthController();