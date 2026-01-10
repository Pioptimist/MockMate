import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3001";

const GUEST_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjI1MjQ3Y2U1ZWU2NDc2OGI4ZGQ2MSIsImlhdCI6MTc2ODA1MTI3MSwiZXhwIjoxNzY4NjU2MDcxfQ.FY5CWOXchLa2hmjKOVXKRSBQ6NN1TaVxR_1_9bDW3n8";
const SESSION_ID = "6962528dce5ee64768b8dd64";

const socket = io(SERVER_URL, {
    auth: {
        token: GUEST_JWT,
    },
});

socket.on("connect", () => {
    console.log("✅ GUEST connected:", socket.id);
    socket.emit("join-room", { sessionId: SESSION_ID });
});

socket.on("join-success", (data) => {
    console.log("🎯 GUEST joined room:", data);
    socket.emit("send-message", {
        message: "Hello from GUEST 😄",
    });
});

socket.on("chat-history", (messages) => {
    console.log("📜 GUEST chat history:", messages);
});

socket.on("receive-message", (msg) => {
    console.log("💬 GUEST received:", msg);
});

socket.on("user-joined", (data) => {
    console.log("👤 GUEST sees user joined:", data);
});

socket.on("join-error", (err) => {
    console.error("❌ GUEST join error:", err);
});
socket.on("session-ended", (data) => {
  console.log("🚨 SESSION ENDED:", data);
});




