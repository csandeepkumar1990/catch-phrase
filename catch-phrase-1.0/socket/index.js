
var ioEvents = function(io) {
    io.on('connection', function(socket) {
        console.log("Connected to default nsp");   
    });
}

/**
 * Initialize Socket.io
 *
 */
var init = function(server) {
    var _io = require('socket.io')(server);
    // Define all Events
    ioEvents(_io);
    //load all namespaces
    loadNamespaces(_io);
    return _io;
}

var loadNamespaces = function(_io) {
    require('./arenas').init(_io);
    require('./selectionarena').init(_io);
    require('./90sec').init(_io);
    require('./catchphrase').init(_io);
    require('./password').init(_io);
    require('./playcatchphrase').init(_io);
    require('./playpassword').init(_io);
}

module.exports = { init };