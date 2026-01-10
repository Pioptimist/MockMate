import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import User from "../models/user.js";

const socketAuth = async (socket, next) => {
  try {
    // Extract token from handshake
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    // Verify JWT
    const decoded = jwt.verify(token, ENV.JWT_SECRET);  //this decoded has the payloader we passed in jwt sign ie the id created at and expiry

    // Fetch user (optional but recommended)
    const user = await User.findById(decoded.id).select("_id name email");

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // Attach user to socket
    socket.user = user;

    // Allow connection
    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
};

export default socketAuth;
