import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "https://socket-io-frontend.vercel.app/",
  },
});



let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  console.log("connected >>>");

  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
  });

  io.emit("server", "Hello world again");
  socket.on("sendNotification", ({ senderName, receiverName, type }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getNotification", {
      senderName,
      type,
    });
  });

  socket.on("sendText", ({ senderName, receiverName, text }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getText", {
      senderName,
      text,
    });
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("disconnected >>>");
  });
});

io.listen("https://socket-io-for.herokuapp.com/");
