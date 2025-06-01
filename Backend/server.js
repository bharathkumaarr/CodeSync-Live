const express = require('express')
const app = express()
require('dotenv').config();

const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const roomRoutes = require('./routes/rooms')

const port = process.env.PORT || 3000

app.use(express.json())


app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)




connectDB();

app.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})

