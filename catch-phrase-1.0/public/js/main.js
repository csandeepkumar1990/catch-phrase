
var app = {

  arenas: function(username, userId) {
    var socket = io('/arenas', { transports: ['websocket'] });
    var username = username;
    var userId = userId;
    // When socket connects, get a list of arenas
    socket.on('connect', function() {
      // Update arenas list upon emitting updateArenasList event
      socket.on('update_arenas_list', function(arena) {
        app.helpers.updateArenasList(arena, userId);
      });
    });

    // Whenever the user hits the create button, emit createArena event.
    $('.room-create button').on('click', function(e) {
      var inputEle = $("input[name='createroom']");
      var roomTitle = inputEle.val().trim();
      if (roomTitle !== '') {
        socket.emit('create_arena', roomTitle, userId);
        
        inputEle.val('');
      }
    });

    $('#playcatchphrase').click( function() {
      var socket = io('/playcatchphrase', { transports: ['websocket'] });
      socket.on('connect', function() {
        //console.log();
        socket.emit('joindynamiccatchphraseroom', userId, app.helpers.generateUUID());
        
      });
    });

    $('#playpassword').click( function() {
      var socket = io('/playpassword', { transports: ['websocket'] });
      socket.on('connect', function() {
        //console.log();
        socket.emit('joindynamicpasswordroom', userId, app.helpers.generateUUID());
      });
    });
  },

  selectionarena: function(roomId, username, userId) {

    var socket = io('/selectionarena', { transports: ['websocket'] });
    var username = username;
    var userId = userId;
    // When socket connects, join the current gameroom
    socket.on('connect', function() {

      socket.emit('joingameroom', userId, roomId);

      socket.on('updateUsersList', function(users, clear) {
        app.helpers.updateUsersList(users, clear);
      });

      $('#saveteamdata').click( function() {
        var $tr1 = $('.users-table tr').eq(1);
        var user1 = $('td', $tr1).eq(0).text();

        var $tr2 = $('.users-table tr').eq(2);
        var user2 = $('td', $tr2).eq(0).text();

        var $tr3 = $('.users-table tr').eq(3);
        var user3 = $('td', $tr3).eq(0).text();

        var $tr4 = $('.users-table tr').eq(4);
        var user4 = $('td', $tr4).eq(0).text();

        //var $tr1 = $('.users-table tr').eq(1);
        var username1 = $('td', $tr1).eq(1).text();

       // var $tr2 = $('.users-table tr').eq(2);
        var username2 = $('td', $tr2).eq(1).text();

       // var $tr3 = $('.users-table tr').eq(3);
        var username3 = $('td', $tr3).eq(1).text();

       // var $tr4 = $('.users-table tr').eq(4);
        var username4 = $('td', $tr4).eq(1).text();
        
        var teamId1 = $('#selectteam1').val();
        var teamId2 = $('#selectteam2').val();
        var teamId3 = $('#selectteam3').val();
        var teamId4 = $('#selectteam4').val();

        var users = new Array();
        users.push(user1);
        users.push(user2);
        users.push(user3);
        users.push(user4);

        var teams = new Array();
        teams.push(teamId1);
        teams.push(teamId2);
        teams.push(teamId3);
        teams.push(teamId4);

        var usernames = new Array();
        usernames.push(username1);
        usernames.push(username2);
        usernames.push(username3);
        usernames.push(username4);

        socket.emit('saveteamdata', users, usernames, teams, roomId);
        
      });

      socket.on('load90secroom', function () {
        window.location.href = 'http://localhost:3002/ninetysec/'+roomId+'/'+userId;
      });

      socket.on('loadcatchphraseroom', function () {
        window.location.href = 'http://localhost:3002/catchphrase/'+roomId+'/'+userId;
      });

      socket.on('loadpasswordroom', function () {
        window.location.href = 'http://localhost:3002/password/'+roomId+'/'+userId;
      });

       
    });
  },


  ninetysec : function(userId, username, roomId, title){
    var socket = io('/90sec', { transports: ['websocket'] });
    //alert(socket);
    socket.on('connect', function() {
     //console.log('connected to 90 sec');
      //socket.emit("newUser", username, userId);
      socket.emit('join90secroom', userId, username, roomId, title);

      socket.on('updatechat', function (username, data) {
        //console.log('dfssdf');
		    $('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
      });

      $('#datasend').click( function() {
        var message = $('#data').val();
        $('#data').val('');
        socket.emit('sendchat', userId, roomId, message);
      });

      $('#powerpass').click( function() {
        var message = $('#data').val();
        $('#data').val('');
        socket.emit('powerpass', userId, roomId, message);
      });

      $('#freezo').click( function() {
        var message = $('#data').val();
        $('#data').val('');
        socket.emit('freezo', userId, roomId, message);
      });

    });


  },

  catchphrase : function(userId, username, roomId, title){
    var socket = io('/catchphrase', { transports: ['websocket'] });
    //alert(socket);
    socket.on('connect', function() {
     //console.log('connected to 90 sec');
      //socket.emit("newUser", username, userId);
      socket.emit('joincatchphraseroom', userId, username, roomId, title);

      socket.on('updatechat', function (username, data) {
        //console.log('dfssdf');
		    $('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
      });

      $('#datasend').click( function() {
        var message = $('#data').val();
        $('#data').val('');
        socket.emit('sendchat', userId, roomId, message);
      });

    });


  },

  password : function(userId, username, roomId, title){
    var socket = io('/password', { transports: ['websocket'] });
    //alert(socket);
    socket.on('connect', function() {
     //console.log('connected to 90 sec');
      //socket.emit("newUser", username, userId);
      socket.emit('joinpasswordroom', userId, username, roomId, title);

      socket.on('updatechat', function (username, data) {
        //console.log('dfssdf');
		    $('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
      });

      socket.on('teamAPoints', function (data) {
        console.log('teamAPoints : ' +data);
		    document.getElementById('#teamAPoints').innerHTML = data;
      });
      socket.on('teamBPoints', function (data) {
        console.log('teamBPoints : ' +data);
		    document.getElementById('#teamBPoints').innerHTML = data;
      });

      $('#datasend').click( function() {
        var message = $('#data').val();
        $('#data').val('');
        socket.emit('sendchat', userId, roomId, message);
      });

    });


  },

  helpers: {

        encodeHTML: function(str) {
          return $('<div />').text(str).html();
        },

        // Update Arenas list
        updateArenasList: function(arena, userId) {
          arena.title = this.encodeHTML(arena.title);
          var html = `<li class="room-item btn btn-lg btn-outline-primary btn-block"><a href="/selectionarena/${arena._id}/${userId}">${arena.title}</a></li>`;

          if (html === '') { return; }

          if ($(".room-list ul li").length > 0) {
            $('.room-list ul').prepend(html);
          } else {
            $('.room-list ul').html('').html(html);
          }
        },

        // Update users list
        updateUsersList: function(users, clear) {
          if (users.constructor !== Array) {
            users = [users];
          }

          var html = '';
          var i = 0;
          for (var user of users) {
            
            var $tr = $('.users-table tr').eq(i + 1);
            $('td', $tr).eq(0).text(users[i]._id);
            $('td', $tr).eq(1).text(users[i].username);
            i = i+1;
          }

        },

        generateUUID: function () {
          var d = new Date().getTime();
          var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
          var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random() * 16;
              if(d > 0){
                  var r = (d + r)%16 | 0;
                  d = Math.floor(d/16);
              } else {
                  var r = (d2 + r)%16 | 0;
                  d2 = Math.floor(d2/16);
              }
              return (c=='x' ? r : (r&0x7|0x8)).toString(16);
          });
          return uuid;
      }
      }
};