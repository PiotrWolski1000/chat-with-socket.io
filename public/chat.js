//make connection
var socket = io.connect("http://localhost:3000")


let message = document.getElementById('message')
let name = document.getElementById('name')
let btn = document.getElementById('send')
let output = document.getElementById('output')
let feedback = document.getElementById('feedback')


//emit events

btn.addEventListener('click', () => {
    socket.emit('chat', {
        message: message.value,
        name: name.value
    })
})

message.addEventListener('keypress', () => {

    socket.emit('typing', name.value)
})

//listen for events on frontend(client- browser side) socket
socket.on('chat', (data) => {
    feedback.innerHTML = ""//so after message was sended we dont see info about typing anymore
    output.innerHTML += '<p><strong>' + data.name + ': </strong>' + data.message + '</p><br>'  
}) 


socket.on('typing', (data) => {
    feedback.innerHTML = '<p><em>' + data + ' is typing a message..</em></p>'
})