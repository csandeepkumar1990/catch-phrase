var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var AllRooms = [];
var wordsArray = ["INDIA", "AMERICA", "PAKISTAN", "AFRICA"];
var wordNumbersMap = new Map();
var roundsMap = new Map();
var MapNumber = 0;



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var nsp = io.of('/my-namespace');

nsp.on('connection', function(socket){
  io.of(socket.nsp.name).emit('newRoomName', AllRooms);
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('roomNo', function(msg){
      var clientsInRoom = io.nsps[socket.nsp.name].adapter.rooms["room"+msg];
      var numClients = clientsInRoom === undefined ? [] : Object.keys(clientsInRoom.sockets);
      console.log(JSON.stringify(numClients));
      if(numClients.length === 1){
        socket.nextSocket = nsp.connected[numClients[0]];
        nsp.connected[numClients[0]].nextSocket = socket;
        console.log(socket.nextSocket);
      //socket.nextSocket.emit('chat message', "MESSAGE FROM NEXT SOCKET");
      socket.arrayPosition = MapNumber ;
      socket.nextSocket.arrayPosition = MapNumber ;
      
      wordNumbersMap.set(MapNumber, 0);
      
      roundsMap.set(MapNumber, 0);
      MapNumber++;
      }
      
      if(numClients.length!=2){
          console.log(numClients);
          socket.leaveAll();
      
      socket.join("room"+msg);
      socket.emit('chat message', "JOINED ROOM : "+msg);
      }
      else {
        socket.emit('chat message', "CANT JOIN ROOM. MAX USERS REACHED.");
      }

      
      
    });

    socket.on('play', function(msg){
      if(msg){
        
        socket.emit('chat message', "YOUR WORD : "+wordsArray[wordNumbersMap.get(socket.arrayPosition)]);
        socket.emit('chat message', "WRITE HINT : ");
        socket.nextSocket.emit('disable', true);
        roundsMap.set(socket.arrayPosition, roundsMap.get(socket.arrayPosition)+1);

      }
    });

    socket.on('UserName', function(msg){
      socket.userName = msg;
      socket.points = 0;
    });

socket.on('myRoom', function(msg){
  AllRooms.push(msg);
  io.of(socket.nsp.name).emit('newRoomName', AllRooms);
  console.log("rooms pushed" + AllRooms);
});

  // socket.on('chat message', function(msg){
  //   console.log('message: ' + msg);
  //   var roomName = Object.keys(socket.rooms).filter(item => item!=socket.id)[0];
  //   console.log(roomName);
  //   //socket.broadcast.to(roomName).emit('chat message', msg);
  //   io.of(socket.nsp.name).in(roomName).emit('chat message', msg);
  //   //console.log(socket);
  // });

socket.on('chat message', function(msg){
  var num = socket.arrayPosition;
  if(roundsMap.get(num)%2===0){
    socket.emit('chat message', msg);
      if(wordsArray[wordNumbersMap.get(num)].toLowerCase() === msg.toLowerCase()){
        socket.points++;
        socket.emit('mypoints', socket.points);
        socket.emit('chat message', "YOU ANSWERED CORRECT." );
        socket.nextSocket.emit('chat message', socket.nextSocket.userName+" ANSWERED CORRECT." );
      }
      else{
        socket.emit('chat message', "YOU ANSWERED WRONG." );
        socket.nextSocket.emit('chat message', socket.nextSocket.userName+" ANSWERED WRONG." );
      }
      roundsMap.set(num, roundsMap.get(num)+1);
      wordNumbersMap.set(num, wordNumbersMap.get(num)+1);
      socket.emit('chat message', "YOUR WORD : "+wordsArray[wordNumbersMap.get(num)]);
      socket.emit('chat message', "WRITE HINT : ");
      socket.nextSocket.emit('disable', true);
  }
  else {
    socket.emit('chat message', msg);
    socket.nextSocket.emit('chat message', socket.userName +" HINT : "+msg);
    socket.nextSocket.emit('chat message', "YOUR ANSWER : ");
    socket.nextSocket.emit('disable', false);
    socket.emit('disable', true);
    roundsMap.set(num, roundsMap.get(num)+1);
    
  }
});




});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
