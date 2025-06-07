const express = require('express')
const app = express()
require('dotenv').config();

const http = require('http');
const {Server} = require('socket.io')

const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const roomRoutes = require('./routes/rooms')

const port = process.env.PORT || 3000

app.use(express.json())


app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)


connectDB();


const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

io.on('connection', (socket)=>{
    console.log('a user is connected: ', socket.id);
    socket.on('disconnect',()=>{
        console.log('User disconnected:', socket.id);
    });
})

server.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})