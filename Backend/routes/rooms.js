const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')



router.post('/create', authMiddleware, (req,res)=>{
    res.send('create room endpoint')
})

router.post('/join', authMiddleware, (req,res)=>{
    res.send('join room endpoint')
})

module.exports = router

