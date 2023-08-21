import React, { useState } from "react";

import { RoomContext } from "../contexts/RoomContext";
import { Link, Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

const Root = () => {
  const [room, setRoom] = useState("");

  return (
    <>
      <Box color="white" height="100vh" width="100%" background={"gray.800"}>
        <RoomContext.Provider value={{ room: room, setRoom: setRoom }}>
          Root {room}
          <Link to="join">Join Room</Link>
          <Outlet />
        </RoomContext.Provider>
      </Box>
    </>
  );
};

export default Root;
