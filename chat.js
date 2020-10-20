const express = require("express")
const socketio = require("socket.io");
const app = express();
app.use(express.static(__dirname + "/public"));
const server = app.listen(process.env.PORT || 3000);
const io = socketio(server);
//We are Connecting to the client and receiving the msg form "msgText" event and emitting not to the one socket but to all th io
io.on("connection", (socket) => {
    socket.on("msgText", function(msg) {
        io.emit("msg", msg)
    })
})
