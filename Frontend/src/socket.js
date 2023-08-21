import { io } from "socket.io-client";
const URL = "https://golive-rtcconnect.onrender.com/";
// const URL = "http://localhost:5000";

export const socket = io(URL, {
  autoConnect: false,
});
