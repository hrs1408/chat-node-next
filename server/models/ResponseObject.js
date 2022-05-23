const responseObject = (status, message, body = "") => ({ status, message, body });

module.exports = responseObject;