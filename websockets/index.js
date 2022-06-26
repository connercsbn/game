// Importing the required modules
var WebSocketServer = require('ws');
// Creating a new websocket server
var wss = new WebSocketServer.Server({ port: 8080 });
// Creating connection using websocket
wss.on('connection', function (ws) {
    console.log('new client connected');
    // sending message
    ws.on('message', function (data) {
        console.log("Client has sent us: ".concat(data));
    });
    // handling what to do when clients disconnects from server
    ws.on('close', function () {
        console.log('the client has connected');
    });
    // handling client connection error
    ws.onerror = function () {
        console.log('Some Error occurred');
    };
});
console.log('The WebSocket server is running on port 8080');
