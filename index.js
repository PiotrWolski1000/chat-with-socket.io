var express = require('express')
var socket = require('socket.io')
var port = 3000


var app = express()

var server = app.listen(port, () => {
    console.log("Listening requests on port ", port)
})

app.use(express.static('public'))


//socket
var io = socket(server)//create socket on server side (that's why is server as param here), client socket u cna find in chat.js

io.on('connection', ((socket) => {
    console.log('socket connection succed!' + socket.id)
    socket.on('chat', (data) => {
        io.sockets.emit('chat', data)//as a server we receive data form one socket and broadcast it to rest sockets
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    })


}))



