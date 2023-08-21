const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const PORT = 5000;

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    // origin: "https://go-live-rtc-connect.vercel.app",
    origin: "http://localhost:5173",
  },
});

module.exports = { app, httpServer, io, PORT };
