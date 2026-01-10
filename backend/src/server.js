// the general format for forming express env is require express but here we going to use the modern sysntax of moduls ; check the "type" in package json , it says module

import express from "express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import practiceRoutes from "./routes/practiceRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import interviewRoutes from "./routes/interviewRoutes.js"
import http from "http";
import { Server } from "socket.io";
import setupInterviewSocket from "./socket/interviewSocket.js";
import socketAuth from "./middleware/socketAuth.js";
import { initSocket } from "./lib/socket.js";


const app = express();
console.log(ENV.PORT);

app.get("/", (req, res)=>{
    res.status(200).json({msg: "api s up and running"})

})

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET","PUT","POST","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/practice', practiceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/interview", interviewRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
initSocket(io);
io.use(socketAuth);
setupInterviewSocket(io);

const startServer = async () => {
  try {
    await connectDB();
    //due to socket we need a http server to fall back on so we replace app.listen to server.listen
    server.listen(ENV.PORT, () => console.log("Server(rest + socket) is running on port:", ENV.PORT));
  } catch (error) {
    console.error("Error starting the server", error);
  }
};

startServer();