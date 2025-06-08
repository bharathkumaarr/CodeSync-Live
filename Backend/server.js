const express = require('express')
const app = express()
require('dotenv').config();

const http = require('http');
const {Server} = require('socket.io')

const ot = require('ot');

const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const roomRoutes = require('./routes/rooms')
const socketAuth = require('./middlewares/socketAuth')
const Room = require('./models/Room');

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

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

socket.on('join-room', async (roomId) => {
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }
    const userInRoom = room.users.some(u => u.user.toString() === socket.user.id);
    if (!userInRoom) {
      socket.emit('error', 'User not authorized to join this room');
      return;
    }
    socket.join(roomId);
    socket.emit('code-update', {
      code: room.code || '',
      version: room.version,
      operations: room.operations.map(op => JSON.parse(op.operation)),
    });
    console.log(`User ${socket.user.id} joined room ${roomId}`);
  } catch (error) {
    socket.emit('error', 'Server error');
  }
});

  socket.on('code-change', async ({ roomId, operation, clientVersion }) => {
    try {
        const room = await Room.findById(roomId);
        if (!room) {
            socket.emit('error', 'Room not found');
            return;
        }
        // Initialize ot server
        const otServer = new ot.Server(room.code || '', room.operations.map(op => JSON.parse(op.operation)));
        // Validate client version
        if (clientVersion !== room.version) {
            socket.emit('error', 'Version mismatch');
            return;
        }

        // Apply operation
        const transformedOp = otServer.receiveOperation(clientVersion, JSON.parse(operation));
        room.code = otServer.document;
        room.version += 1;
        room.operations.push({
        operation: JSON.stringify(transformedOp),
        version: room.version,
        user: socket.user.id,
        });
        await room.save();

        // Broadcast to other clients
        socket.to(roomId).emit('operation-update', {
            operation: JSON.stringify(transformedOp),
            version: room.version,
        });
    } catch (error) {
        socket.emit('error', 'Server error');
    }
});

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


io.use(socketAuth)

server.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})