const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const signup = async (req,res)=>{
    const {username, email, password} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({error: 'Email already exists'})
        }

        const user = new User({username, email, password})
        await user.save();


        const token = jwt.sign(
            {id: user._id}, 
            process.env.JWT_SECRET, 
            {expiresIn: '1d'})

        res.status(201).json({token})
    }
    catch (error){
        res.status(500).json({error:error.message})
    }
}

const login = async (req,res)=>{
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({error: 'Invalid credentials'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({error: 'invalid password'});

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        )
        res.json({token})
    }
    catch(error) {
        res.status(500).json({error:'Server error'})
    }
}


module.exports = {
    signup,
    login
}