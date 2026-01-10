import mongoose from "mongoose";
import InterviewSession from "../models/interviewS.js";
import Message from "../models/messageS.js";

const setupInterviewSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        /*JOIN INTERVIEW ROOM*/
        socket.on("join-room", async ({ sessionId }) => {
            try {
                if (!mongoose.Types.ObjectId.isValid(sessionId)) {
                    return socket.emit("join-error", { message: "Invalid session ID" });
                }
                const session = await InterviewSession.findById(sessionId);
                if (!session) {
                    return socket.emit("join-error", { message: "Session not found" });
                }

                if (session.status !== "live") {
                    return socket.emit("join-error", {
                        message: "Interview session is not live",
                    });
                }

                const userId = socket.user._id.toString();

                const isHost = session.hostUserId.toString() === userId;
                const isGuest =
                    session.guestUserId &&
                    session.guestUserId.toString() === userId;

                if (!isHost && !isGuest) {
                    return socket.emit("join-error", {
                        message: "Not authorized to join this interview",
                    });
                }

                socket.join(sessionId);

                // Store sessionId on socket (IMPORTANT for disconnect)
                socket.sessionId = sessionId;

                //the joined user or guest can see the past messages
                const messages = await Message.find({
                    sessionId,
                })
                    .sort({ createdAt: 1 })
                    .limit(100);
                socket.emit("chat-history", messages.map((msg) => ({
                    _id: msg._id,
                    message: msg.content,
                    senderId: msg.senderId,
                    timestamp: msg.createdAt,
                })));

                socket.to(sessionId).emit("user-joined", {
                    userId: socket.user._id,
                    name: socket.user.name,
                    role: isHost ? "host" : "guest",
                });

                socket.emit("join-success", {
                    sessionId,
                    role: isHost ? "host" : "guest",
                });
            } catch (err) {
                console.error("join-room error:", err);
                socket.emit("join-error", {
                    message: "Failed to join interview",
                });
            }

        });

        /*CHAT MESSAGE*/
        socket.on("send-message", async ({ message }) => {
            if (!socket.sessionId) {
                console.log("❌ sessionId missing, message dropped");
                return;
            }


            // 1️⃣ Save message to DB
            const savedMessage = await Message.create({
                sessionId: socket.sessionId,
                senderId: socket.user._id,
                content: message,
            });

            // 2️⃣ Emit to other user
            socket.to(socket.sessionId).emit("receive-message", {
                _id: savedMessage._id,
                message: savedMessage.content,
                senderId: socket.user._id,
                senderName: socket.user.name,
                timestamp: savedMessage.createdAt,
            });
        });


        /* USER LEAVES*/
        socket.on("leave-room", ({ sessionId }) => {
            socket.leave(sessionId);

            socket.to(sessionId).emit("user-left", {
                userId: socket.user._id,
            });
        });


        /*DISCONNECT*/
        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });

        socket.on("session-ended", () => {
            if (!socket.sessionId) return;

            socket.leave(socket.sessionId);
            socket.sessionId = null;
        });

        socket.on("webrtc-ready", () => {
            if (!socket.sessionId) return;

            socket.to(socket.sessionId).emit("webrtc-ready");
        });

        // === OFFER ===
        socket.on("webrtc-offer", (offer) => {
            if (!socket.sessionId) return;

            socket.to(socket.sessionId).emit("webrtc-offer", offer);
        });

        // === ANSWER ===
        socket.on("webrtc-answer", (answer) => {
            if (!socket.sessionId) return;

            socket.to(socket.sessionId).emit("webrtc-answer", answer);
        });

        // === ICE CANDIDATE ===
        socket.on("webrtc-ice-candidate", (candidate) => {
            if (!socket.sessionId) return;

            socket.to(socket.sessionId).emit("webrtc-ice-candidate", candidate);
        });

    });
};

export default setupInterviewSocket;
