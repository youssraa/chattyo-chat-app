import {Server} from "socket.io";
import express from 'express' ;
import http  from "http";



const app =express();
const server= http.createServer(app);
const io = new Server(server, {
    cors : {
        origin : ["http://localhost:5173"]
    },
}) ;



 export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
 }
 const userSocketMap = {} ;// {userId._id : socketId }
io.on("connection", (socket)=>{
    console.log(" A user is connected ", socket.id);
    const userId = socket.handshake.query.userId ;
    if(userId) userSocketMap[userId] = socket.id ;
    io.emit("getOnLineUsers",Object.keys(userSocketMap))
    socket.on("disconnect",()=>{
        console.log(" A user disconnected ", socket.id)
        delete userSocketMap[userId];
        io.emit("getOnLineUsers",Object.keys(userSocketMap))
    } );
})
export {io , app, server}