import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors" ;
import path from "path" ;
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import {app , server } from "./lib/socket.js";


// Increase payload limit (e.g. 5MB)
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
dotenv.config();
const PORT = process.env.PORT ; 
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173" ,
    credentials : true 
}));
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("/*splat", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }

server.listen(PORT, ()=>{
    console.log("server is runing on port="+ PORT)
    connectDB()
})
