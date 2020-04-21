
/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */

var ioEvents = function(_io) {

    _io.of('/playpassword').on('connection', function(socket) {
        console.log("Connected to /playpassword nsp");

        socket.on('joindynamicpasswordroom', function(userId, roomId) {
            
            
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