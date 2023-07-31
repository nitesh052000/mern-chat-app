const path = require('path')
require('dotenv').config({path:path.resolve(__dirname,'./.env')})

const express = require("express");


const {chats} = require("./data/data");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/ChatRoutes");
const messageRoutes = require("./routes/messageRoutes");


const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { Socket } = require('socket.io');


connectDB();

console.log(mongoose.connection.readyState)

const app = express();

app.use(express.json());  // to accept Json data 

app.get("/",(req,res)=>{
    res.send("Api is runinggg");
});

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use("/api/message",messageRoutes);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT|| 5000;

const Server = app.listen(5000,console.log(`server started on port 5000 ${PORT}`));

const io = require("socket.io")(Server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000",
    },
});

io.on("connection",(socket)=>{
    console.log("connected to socket.io");

    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });

     socket.on("join chat",(room) =>{
        socket.join(room);
        console.log("User Joined Room:" + room);
     });
          
     socket.on("typing" , (room) => socket.in(room).emit("typing"));
     socket.on("stop typing" ,(room) => socket.in(room).emit("stop typing"));

     socket.on("new message",(newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if(!chat.users)return console.log("chat.users not defined");
        

        chat.users.forEach(user => {
            if(user._id == newMessageRecieved.sender._id)return;

            socket.in(user._id).emit("message recieved" , newMessageRecieved);
        });
        
    });

socket.off("setup",()=>{
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
});

});