const express=require("express");
//nodejs frame work

const mongoose=require("mongoose");
//for database purpose

require("dotenv").config();
//Dotenv is a module that allows us to store private keys 
//and passwords safely, and load them into our code when needed.

const cors=require("cors");
//Cors allows our client to make requests to other origins

const { Server } = require("socket.io");
const server = require("http").createServer();

//importing routes and using it
const userRoutes=require('./routes/auth');
const messageRoutes=require('./routes/messages');
const Errorhandler = require("./middlewares/errorhandler");

const BodyParser=require("body-parser")



const app=express();

app.use(BodyParser.json())

app.use(BodyParser.urlencoded({ extended: true }));

app.use(cors());

//allowing headers from clients
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
      //*:--->it will allow access for all the clients
    res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PUT,PATCH');

    res.setHeader('Access-Control-Allow-Headers','*');
    //allows the headers sent by the client
  next();
})

app.get('/', (req, res) => {
    res.send('Hello world');
  });

  app.use('/user',userRoutes)
  app.use('/message',messageRoutes)


  app.use(Errorhandler)


const connectdataBaseHandler=async()=>{
    try{
        const result=mongoose.connect(`mongodb+srv://smitha:smitha123@cluster0.pmlfv.mongodb.net/chatapp?retryWrites=true&w=majority`);
        if(!result){
            const error=new Error('Failed to connect Database');
            throw error;
        }
        console.log('Database Connected!!')
    }catch(err){
        console.log("Facing Issue:",err)
    }
}

server.listen(process.env.PORT||7070, () => {
  console.log("Listening on *:7070");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

//store all online users inside this map
global.onlineUsers =  new Map();
 
io.on("connection", (socket) => {
  global.chatSocket=socket;
  console.log("A user connected");
    
    socket.on("add-user",(userId)=>{
      console.log("added user")
      onlineUsers.set(userId,socket.id)
    })

    socket.on('add-msg',(data)=>{
      const senderSocket=onlineUsers.get(data.to)
      console.log(data,senderSocket)
      if(senderSocket){
        console.log("emitted")
        socket.to(senderSocket).emit('recv-msg',data.msg)
      }  
    })

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  console.log(onlineUsers)

connectdataBaseHandler()