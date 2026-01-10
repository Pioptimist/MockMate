import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3001"; // change if needed

const HOST_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjExN2IzYzkzNjgxYmI1ZTY0NWJhYyIsImlhdCI6MTc2ODA1MTIxNSwiZXhwIjoxNzY4NjU2MDE1fQ.DJZ9D4hops0PRCOrPmebgHgMSOAYxvvOE2vk5l-IPoc";
const SESSION_ID = "6962528dce5ee64768b8dd64";

const socket = io(SERVER_URL, {
    auth: {
        token: HOST_JWT,
    },
});

// connection
socket.on("connect", () => {
    console.log("✅ HOST connected:", socket.id);

    // join interview room
    socket.emit("join-room", { sessionId: SESSION_ID });
});

// join success
socket.on("join-success", (data) => {
    console.log("🎯 HOST joined room:", data);
    socket.emit("send-message", {
        message: "Hello from HOST 👋",
    });
});

// chat history
socket.on("chat-history", (messages) => {
    console.log("📜 HOST chat history:", messages);
});

// receive message
socket.on("receive-message", (msg) => {
    console.log("💬 HOST received:", msg);
});

// user joined
socket.on("user-joined", (data) => {
    console.log("👤 HOST sees user joined:", data);
});

// errors
socket.on("join-error", (err) => {
    console.error("❌ HOST join error:", err);
});


socket.on("connect_error", (err) => {
    console.error("❌ CONNECT ERROR:", err.message);
});

socket.on("error", (err) => {
    console.error("❌ SOCKET ERROR:", err);
});

socket.on("session-ended", (data) => {
  console.log("🚨 SESSION ENDED:", data);
});
