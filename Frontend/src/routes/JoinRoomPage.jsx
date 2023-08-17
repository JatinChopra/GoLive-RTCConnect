import React, { useContext } from "react";

import { useNavigate } from "react-router-dom";

import { RoomContext } from "../contexts/RoomContext";

import { socket } from "../socket";

const JoinRoomPage = () => {
  const { room, setRoom } = useContext(RoomContext);

  const navigate = useNavigate();

  // Join room function :
  // 1- creates a connection
  // 2- joinsa room
  // 3- navigate to meeting page
  const joinRoom = () => {
    socket.connect(); // establish a connection

    console.log(socket.id);

    // join room emitter
    socket.emit("join:room", room, () => {
      console.log(
        "[*] " + socket.id + " successfully joined the room : " + room
      );
    });

    navigate("/meeting");
  };

  return (
    <>
      <h3>Join Room page</h3>
      <label htmlFor="roomInput">Room Name : </label>
      <input
        id="roomInput"
        type="text"
        value={room}
        onChange={(e) => {
          setRoom(e.target.value);
        }}
      />
      <button onClick={joinRoom}>Join</button>
    </>
  );
};

export default JoinRoomPage;
