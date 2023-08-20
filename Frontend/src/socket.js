import { io } from "socket.io-client";
const URL = "https://golive-rtcconnect.onrender.com/";

export const socket = io(URL, {
  autoConnect: false,
});
