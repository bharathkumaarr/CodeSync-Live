const jwt = require('jsonwebtoken')

const socketAuth = (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error: No token provided'))
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user=decoded;
        next()
    }
    catch(error){
        next(new Error('Authentication error: Invalid token'));
    }
}
module.exports = socketAuth