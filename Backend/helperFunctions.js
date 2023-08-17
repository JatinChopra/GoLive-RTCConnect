const { emitHandler, broadcastHandler } = require("./emitHandlers");
const { rooms } = require("./rooms");

// joinRoomHandler
const joinRoomHandler = (socket, room, cb) => {
  console.log(`[!] Rooms right now : ${rooms}`); // log the rooms that are currently present
  let roomFound = false; // set room found to false ( will create a new room if stayed false )

  // iterate over each room
  // item[0] : room name
  // item[1] : [members array] ( maximum 2 members )
  Object.entries(rooms).forEach((item) => {
    if (item[0] === room) {
      // loof if the room already exists or not
      console.log(room, item[0]);
      roomFound = true; // set the room found to true ( no need to create a new room )

      // tells the joining user that room already exists
      emitHandler(
        socket,
        "server-message",
        `[Info] Room [${room}] already exists.`
      );

      // check if the number of memers in room is gt or equal to 2
      if (item[1].length >= 2) {
        // tells the joining user that room is already full
        emitHandler(
          socket,
          "server-message",
          `[Info] Room [${room}] is already full`
        );
      } else {
        // if room is not already full
        socket.join(room); // join the socket to room
        item[1].push(socket.id); // add the user socket.id to the members array
        broadcastHandler(room, "current-participants", item[1]); // send the list of current participants to all the members in room

        cb(); // call the callback function for verification
      }
    }
  });

  // create a new room if room already doesnt exist
  if (!roomFound) {
    rooms[room] = [];
    rooms[room].push(socket.id); // push the socket id into the members array
    socket.join(room); // join the room
    broadcastHandler(room, "current-participants", rooms[room]); // send the list of current participants
    cb(); // call the callback functionfor verification
  }
};

// leave room handler
const leaveRoomHandler = (socket, room) => {
  socket.leave(room); // remove the socket id from the room

  // remove the item from memory
  Object.entries(rooms).forEach((item) => {
    // iterate over rooms
    if (item[0] === room) {
      if (item[1].length === 1) {
        // if only one user left
        console.log(`[!] Removing last user ${socket.id} from ${room}`);
        delete rooms[item[0]]; // delete the room
        console.log(`[!] [${room}] room deleted  : `, rooms);
      } else {
        console.log(`[!] Removing ${socket.id} from ${room} :  `, rooms);
        rooms[item[0]] = item[1].filter((item) => {
          return item != socket.id;
        });
        broadcastHandler(room, "current-participants", rooms[item[0]]);
        console.log("[!] Remaining participants in room : ", rooms[item[0]]);
      }
    }
  });
};

const socketDisconnectHandler = (socket) => {
  Object.entries(rooms).forEach((item) => {
    if (item[1].includes(socket.id)) {
      rooms[item[0]] = item[1].filter((socketId) => {
        return socketId != socket.id;
      });
    }
  });
};

module.exports = {
  joinRoomHandler,
  leaveRoomHandler,
  socketDisconnectHandler,
};
