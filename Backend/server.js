const express = require('express')
const app = express()
require('dotenv').config();




const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')


const port = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req,res)=>{
    res.send('code sync live backend')
})
app.use('/api/auth', authRoutes)

connectDB();







app.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})

