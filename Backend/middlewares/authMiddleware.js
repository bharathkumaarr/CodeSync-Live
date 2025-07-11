const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next) =>{
    const token = req.header('Authorization')?.replace('Bearer', '');
    if (!token) {
        return res.status(401).json({error: 'no valid token provided'})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next()
    }
    catch (error) {
        res.status(401).json({error: 'invalid token'})
    }
}

module.exports = authMiddleware;