const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { Socket } = require('engine.io')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser,getUserInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server) 

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
//let count = 0
io.on('connection', (socket) => {
    console.log('new websocket connection')

    socket.on('join', ({ username, Room}, callback) => {
        const { error, user} = addUser({id: socket.id, username, Room})
        if (error) {
            return callback(error)
        }
        socket.join(user.Room)
        socket.emit('message', generateMessage('admin','welcome!'))
        socket.broadcast.to(user.Room).emit('message', generateMessage('admin' ,`${user.username} has joined`))
        io.to(user.Room).emit('roomData', {
            Room: user.Room,
            users: getUserInRoom(user.Room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.Room).emit('message', generateMessage(user.username, message))
        callback()
        //profanity is not done video -9
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.Room).emit('locationMessage', generateLocationMessage(user.username, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.Room).emit('message', generateMessage('admin',`${user.username} is left`))
            io.to(user.Room).emit('roomData', {
                Room: user.Room,
                users: getUserInRoom(user.Room)
            })
        }
        
    })
            // socket.emit('countUpdated', count)

            // socket.on('increment', () => {
            //     count++
            //     io.emit('countUpdated', count)
            // })
})

server.listen(port, () => {
    console.log(`server is running on port ${port} `)
})