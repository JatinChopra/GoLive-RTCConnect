const { app, httpServer, io, PORT } = require("./serverInstance");

const {
  joinRoomHandler,
  leaveRoomHandler,
  socketDisconnectHandler,
} = require("./helperFunctions");

const { rooms } = require("./rooms");

// Connection event Handler
io.on("connection", (socket) => {
  console.log("[+] " + socket.id + " : Connected"); // logs socket id that connects to ther server

  // emitListener : joining a room
  socket.on("join:room", (room, cb) => {
    joinRoomHandler(socket, room, cb);
  });

  // emitListener : for leaving a room
  socket.on("leave", (room) => {
    leaveRoomHandler(socket, room);
  });

  // sending messages
  socket.on("send:msg", ({ room, msg }, cb) => {
    console.log("new msg rec : ", room, msg);
    io.to(room).emit("send:msg", msg);
    cb();
  });

  socket.on("disconnect", () => {
    // remove socket from all the rooms it is inside
    console.log("Before : ", rooms);
    socketDisconnectHandler(socket);
    console.log("After : ", rooms);
    console.log("[-] " + socket.id + " : Disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`[!] Server started listening on port ${PORT}`);
});
