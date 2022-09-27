const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});
   
  let users = []

  const removeUser = (socketId) => {
    users = users.filter((user) =>
     user.socketId !== socketId);
  };

  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  };
  
  const getUser = (userId) => {
    return users.find((user) => 
    user.userId === userId);
  };
  
  io.on("connection", (socket) => {
    //when connection happens
    console.log("a user connected.");
    io.emit("welcome","this is socket server duh")
    
      //take userId and socketId from user
  socket.on("addUser", (userId) => {
    console.log(userId)
    addUser(userId, socket.id);
    console.log(users)
    console.log(users.length)
    io.emit("getUsers", users);
  });
  
  //send and get message
  socket.on("sendMessage", 
  ({ sender, receiverId, text }) => {
    console.log({sender,receiverId,text})
    const user = getUser(receiverId);
    console.log(user)
    io.to(user.socketId).emit("getMessage", {
      sender,
      text,
    });
  });

  //send and get notification
  socket.on("sendnotification",
  ({message,individualpic,receiverid}) => {
    console.log({message,individualpic,receiverid})
    const user = getUser(receiverid);
    console.log(user)
    io.to(user.socketId).emit("getnotifications", {
      message,
      individualpic,
    })
  })

   //when disconnect
   socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  })
  })


