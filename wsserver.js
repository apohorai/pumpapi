const { client } = require('websocket');
const WebSocket = require('ws');

const PORT = 5000;

const wsServer = new WebSocket.Server({
    port: PORT
});

wsServer.on('connection', function (socket) {
    // Some feedback on the console
   

   
    socket.on('message', function (msg) {
        console.log("Received message from client: "  + msg);
   
        wsServer.clients.forEach(function (client) {
            client.send(JSON.stringify(msg));
        });

    });

});

console.log( (new Date()) + " Server is listening on port " + PORT);
