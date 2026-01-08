// the general format for forming express env is require express but here we going to use the modern sysntax of moduls ; check the "type" in package json , it says module

import express from "express";
import { ENV } from "./lib/env.js";

const app = express();
console.log(ENV.PORT);

app.get("/health", (req, res)=>{
    res.status(200).json({msg: "api is up and running"})

})

app.listen(ENV.PORT, ()=> console.log("server is running on port: ",ENV.PORT));