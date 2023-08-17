import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

import { RoomContext } from "../contexts/RoomContext";

const MeetingRoomPage = () => {
  const { room, setRoom } = useContext(RoomContext);
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!room) {
      navigate("/join");
    }

    const onMessage = (msg) => {
      console.log("received : ", msg);
    };

    const onServerMessage = (message) => {
      console.log(message);
    };

    const onCurrentParticipants = (participants) => {
      console.log("Current Participants in the room : " + participants);
    };

    socket.on("send:msg", onMessage);
    socket.on("server-message", onServerMessage);
    socket.on("current-participants", onCurrentParticipants);

    return () => {
      socket.off("send:msg", onMessage);
      socket.off("server-message", onServerMessage);
      socket.off("current-participants", onCurrentParticipants);
    };
  });

  const formHandler = (e) => {
    e.preventDefault();
    socket.emit("send:msg", { room, msg }, () => {
      console.log("message send.");
    });
  };

  return (
    <div>
      MeetingRoomPage room id ({room})
      <form onSubmit={formHandler}>
        <input
          type="text"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
      </form>
      <button
        onClick={() => {
          socket.emit("leave", room);
          navigate("/join");
        }}
      >
        Leave Room
      </button>
    </div>
  );
};

export default MeetingRoomPage;
