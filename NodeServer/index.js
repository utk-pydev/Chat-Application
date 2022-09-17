///This is our Node server for handling socket io connections
/*

///Reference:
https://stackoverflow.com/questions/24058157/socket-io-node-js-cross-origin-request-blocked

Note: DO NOT USE "socketio" package... use "socket.io" instead. "socketio" is out of date. Some users seem to be using the wrong package.
socket.io v3
docs: https://socket.io/docs/v3/handling-cors/
cors options: https://www.npmjs.com/package/cors
const io = require('socket.io')(server, { cors: { origin: '*', } });
socket.io < v3
const io = require('socket.io')(server, { origins: '*:*'});
or
io.set('origins', '*:*');
*/
const io = require('socket.io')(8000,  {
    cors: {
      origin: '*',
    }
  });

const users = {};
///on is the event handler and 'connection' and 'new-user-joined' are the variables
io.on('connection', socket=>{ 
    socket.on('new-user-joined', name=>{
          //  console.log("new user ",name);
            
            users[socket.id] = name;
            ///broadcast that a new user joined the message will go to everyone currently on the server except for the new user that joined 
            socket.broadcast.emit('user-joined', name);
        });

    socket.on('send', message=>{
        ///Same function as mentioned above
        ///Sends a structure containing the infromation of the message
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
        });
    
    socket.on('disconnect', message=>{
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id]; 
    });
});
