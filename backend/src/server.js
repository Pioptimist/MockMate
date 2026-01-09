// the general format for forming express env is require express but here we going to use the modern sysntax of moduls ; check the "type" in package json , it says module

import express from "express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";


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

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("Error starting the server", error);
  }
};

startServer();