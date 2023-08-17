import React, { useState } from "react";

import { RoomContext } from "../contexts/RoomContext";
import { Outlet } from "react-router-dom";

const Root = () => {
  const [room, setRoom] = useState("");

  return (
    <>
      <RoomContext.Provider value={{ room: room, setRoom: setRoom }}>
        Root {room}
        <Outlet />
      </RoomContext.Provider>
    </>
  );
};

export default Root;
