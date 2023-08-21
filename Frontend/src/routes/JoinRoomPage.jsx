import React, { useContext } from "react";

import { useNavigate } from "react-router-dom";

import { RoomContext } from "../contexts/RoomContext";

import { socket } from "../socket";

import { Input, Button } from "@chakra-ui/react";

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
      <Input
        width={"200px"}
        size={"sm"}
        id="roomInput"
        type="text"
        value={room}
        onChange={(e) => {
          setRoom(e.target.value);
        }}
      />
      <Button size="sm" ml="5" onClick={joinRoom}>
        Join
      </Button>
    </>
  );
};

export default JoinRoomPage;
