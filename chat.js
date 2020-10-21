const express = require("express")
const socketio = require("socket.io");
const mongoose = require("mongoose")
const app = express();
const name = {}
    //Connect to Mongoose
mongoose.connect("mongodb+srv://Vishnu_Sai:SaiVishnu14@cluster0.hkghe.mongodb.net/userMsg?retryWrites=true&w=majority")
    //Create A Schema 

const userMsgSchema = new mongoose.Schema({
    userName: String,
    chatMsg: String
});

//Now Create A model

const userMsgModel = mongoose.model("userMsg", userMsgSchema);
app.use(express.static(__dirname + "/public"));
app.get("/", function(req, res) {
    res.redirect("/chat.html")
})
const server = app.listen(process.env.PORT || 3000, function() {
    console.log("Server is Started")
});
const io = socketio(server);
//We are Connecting to the client and receiving the msg form "msgText" event and emitting not to the one socket but to all th io So That we ar Using io.emit We Can Also Use socket.broadcast.emit (But This will emit the message to all client but not shown to you)
io.on("connection", (socket) => {
    //First Display All The Mesage From The DB (old-message When The New User Is Connected)
    userMsgModel.find(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                for (var i = 0; i < result.length; i++) {
                    socket.emit("old-msg", result[i])
                }
            }

        })
        //Get The UserName And Store It in a Javascript Object with key as socket id since that is unique 
    socket.on("new-user-name", function(userName) {
            name[socket.id] = userName
            socket.broadcast.emit("new-user-connected-msg", name[socket.id])
                // console.log(name)
        })
        //While Sending The Message Send The Coresponding Username From The Users Object By POinting The Socket.id as key
    socket.on("msgText", function(msg) {
        const dataMsg = { "name": name[socket.id], "msgtext": msg }
        const newMsgData = new userMsgModel({
            userName: name[socket.id],
            chatMsg: msg
        })
        newMsgData.save();
        // console.log(newMsgData)
        io.emit("msg", dataMsg)
    })
})
