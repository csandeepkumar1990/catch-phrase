
/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */

var ioEvents = function(_io) {

    _io.of('/playcatchphrase').on('connection', function(socket) {
        console.log("Connected to /playcatchphrase nsp");

        socket.on('joindynamiccatchphraseroom', function(userId, roomId) {
            //store in collection
            ///match making
            //create dynamic arena using uuid
            //load their sockets
            
        });

    });
}

/**
 * Initialize Socket.io name space
 *
 */
var init = function(_io) {
    // Define all Events
    ioEvents(_io);
    return _io;
}

module.exports = { init };