const { io } = require("./serverInstance");

const emitHandler = (socket, eventName, message) => {
  socket.emit(eventName, message);
};

// boradcast to all the sockets in a room
const broadcastHandler = (roomName, eventName, message) => {
  io.to(roomName).emit(eventName, message);
};

module.exports = { emitHandler, broadcastHandler };
