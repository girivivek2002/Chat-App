const express = require('express')
const dotenv = require('dotenv')
const datas = require('./data/data')
const app = express()
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const connectDB = require('./database/db');
const colors = require('colors')
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middlewares/errorHandling');
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const { Server } = require('socket.io');   // for socket.io import
const http = require('http');          //  Required for Socket.IO
const registerSocketHandlers = require('./controllers/socket')

dotenv.config() // connect to .env file
connectDB() // it will connect to mongoDB Db 
// connectDB(app)  // if use second method in db.js


// for socket.io connection
const server = http.createServer(app); // Wrap express app with http
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    },
    //optional
    pingTimeout: 60000,      // 60 seconds - disconnects if no pong received
    pingInterval: 25000      // 25 seconds - sends a ping every 25s
});


app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",   // frontend path
    credentials: true
}));


// no use just for fun
app.get('/api/datas', (req, res) => {
    res.json(datas)
})


// app.get('/', (req, res) => {
//     res.send("<h1>api is running</h1>")
// })

app.use('/api/user', userRoutes) // it connected to userRoutes file
app.use('/api/chats', chatRoutes) // it connected to chatRoutes file
app.use('/api/message', messageRoutes)
app.use('/api/notification', notificationRoutes)

app.use(notFound) // for error handling if you hit diffrent then above url
app.use(errorHandler) // for error handling any different kind of error


registerSocketHandlers(io)   // function where all logic of socket.io written



// app.listen(PORT, () => {
//     console.log(`I am running on the port: ${PORT}`.yellow.bold)
// })


// for socket.io
server.listen(PORT, () => {
    console.log(`I am running on the port: ${PORT}`.yellow.bold)
})

