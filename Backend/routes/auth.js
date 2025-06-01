const express = require('express')
const router = express.Router()


const { signup, login } = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')


router.post('/signup', signup)

router.post('/login', login)

router.get('/profile', authMiddleware, (req,res)=>{
    res.json({message: 'protected route', userId: req.user.id})
})

module.exports = router
