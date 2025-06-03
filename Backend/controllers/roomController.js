const Room = require('../models/Room')


const createRoom = async (req,res)=>{
    // console.log('req.user:', req.user);
    const {name, language} = req.body;
    if (!name) {
        return res.status(400).json({error:'Room name is required'})
    }
    try {
        const room = new Room({
            name,
            language: language || 'javascript',
            creator: req.user.id,
            users: [{user: req.user.id, role: 'admin'}]
        });

        await room.save();

        res.status(201).json({ roomId: room._id, name: room.name})
    }

    catch (error) {
        
        res.status(500).json({error: 'server error'})

    }
}


const joinRoom = async (req,res)=>{
    const {roomId} = req.body;
    if (!roomId) {
        return res.status(400).json({error: 'Room ID is required'})
    }
    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(400).json({error: 'room not found'})
        }
        const userExists = room.users.some(u=> u.user.toString()===req.user.id);
        if (userExists){
            return res.status(400).json({error: 'User already in room'})
        }
        room.users.push({user: req.user.id, role: 'editor'})
        await room.save();

        res.json({roomId: room._id, name: room.name})
    }
    catch(error){
        res.status(500).json({error: 'server error'})

    }
}

module.exports = {
    createRoom,
    joinRoom
}