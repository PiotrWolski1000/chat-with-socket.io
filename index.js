// const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const socket = require('socket.io');

const port  = 3001

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('sgs90890s8g90as8rg90as8g9r8a0srg8'));

app.use(express.static("styles"))

app.set('view engine', 'ejs');
app.set('views', './views');

app.get( '/logout', authorize, (req, res) => {
    res.cookie('user', '', { maxAge: -1 } )
    res.redirect('/')
    username = "";
});

app.get( '/chat', authorize, (req, res) => {
    res.render('chat', { user : req.user } )
    
});

app.get( '/', (req, res) => {
    res.render('index', { user : req.user } );    
});

app.get( '/login', (req, res) => {
    res.render('login');
});

app.post( '/login', (req, res) => {//we posted data via form
    username = req.body.txtUser;
    var pwd = req.body.txtPwd;//matching, should be update with data from db or file
    
    if ( username == pwd ) {
        
        res.cookie('user', username);//first we need to create a cookie with username data 
        
        let returnUrl = req.query.returnUrl

        console.log(req.query.returnUrl)//if is undefined, it means user was trying to loging directly from /login, and return url, which is
        
        //this post-->//earlier when we want to get acces to /chat url shows as http://localhost:3001/login?returnUrl=/chat, after succesful login we are moved to proper destination

        //thats why we need to check return url is going to lead us anywhere, like this
        if (typeof(returnUrl) !== 'undefined')
            res.redirect(returnUrl)
        else
            res.redirect('/chat')
        //check if work..
    } else {
        res.render( 'login', { message : "Wrong username or password" } );
    }
});

app.get('*', function(req, res){
    res.render('404');
  });

function authorize(req, res, next) {
    if ( req.cookies.user ) {
        req.user = req.cookies.user;
        next();
    } else {
        res.redirect('/login?returnUrl='+req.url);
    }
}

const server = app.listen(port, () => {
    console.log("Listening requests on port ", port)
})



const io = socket(server)//create socket on server side (that's why is server as param here), client socket u can find in chat.js

io.on('connection', function(socket) {
    //console.log('client connected:' + socket.id);
    socket.emit('chat message','Witaj');
    
    socket.on('chat message', function(data) {
        io.emit('chat message', data);
        //socket.emit('chat message', data); tylko do połączonego
    })
  
});

