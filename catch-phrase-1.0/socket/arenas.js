var Arena = require('../models/arena');
var CREATE_ARENA = 'create_arena';
var UPDATE_ARENAS = 'update_arenas_list';

/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */

var ioEvents = function(IO) {

    IO.on('connection', function(socket) {
      
        console.log('connect to /arenas nsp');
        // Create a new arena
        socket.on(CREATE_ARENA, function(title, userId) {
            Arena.findOne({ 'title': new RegExp('^' + title + '$', 'i') }, function(err, arena) {
            if (err) 
                throw err;
            if (arena) {
                //Arena title already exists.
                throw err;
            } else {
                Arena.create({
                    title: title
                }, function(err, newArena) {
                    if (err) 
                        throw err;

                    socket.emit(UPDATE_ARENAS, newArena);
                    socket.broadcast.emit(UPDATE_ARENAS, newArena);
                });
            }
            });
        });

        socket.on('disconnect', function() {
              
        });
    });

}

/**
 * Initialize /arenas name space
 *
 */
var init = function(_io) {
    var nsp = _io.of('/arenas');
    // Define all Events
    ioEvents(nsp);
    return _io;
}

module.exports = { init };