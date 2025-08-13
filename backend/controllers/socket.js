module.exports = function registerSocketHandlers(io) {
    io.on("connection", (socket) => {   // stablish connection to frontend when front end connect then show below msg
        console.log("socket.io connected successfully ", socket.id);

        socket.on("setup", (userData) => {   // userData from frontend it send like this (socket.emit("setup", user))
            socket.join(userData._id);
            //console.log(userData._id)
            socket.emit("connected")
        })

        // it will create a room (room id from frontend) and join above user in the room when other user give same request with same chatid then it will also join the room
        socket.on('join-chat', (room) => {
            socket.join(room);
            console.log("user joined Room :" + room)
        })

        socket.on("typing", (room) => socket.in(room).emit("typing"))
        socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"))

        socket.on('new-message', (newMessagerecieve) => {
            var chat = newMessagerecieve.chat

            if (!chat.users) return console.log("chat.users not defined")

            chat.users.forEach((user) => {
                if (user._id == newMessagerecieve.sender._id) return //  sender id and user id(login) same do nothing

                socket.in(user._id).emit("message-received", newMessagerecieve)  //socket.in(room).emit(...) is used to send a message to everyone in a room, except the sender.
            });


        })

        socket.off("setup", () => {
            console.log("USER DISCONNECTED");
            socket.leave(userData._id);
        })

    })
}