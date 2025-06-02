const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const { createRoom } = require('../controllers/roomController')



router.post('/create', authMiddleware, createRoom)

router.post('/join', authMiddleware, (req,res)=>{
    res.send('join room endpoint')
})

module.exports = router

