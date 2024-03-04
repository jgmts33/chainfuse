const Server = require("socket.io");

const createSocketServer = (server) => {
  let io = new Server.Server(server);

  const initSocketServer = () => {
    console.log("init socket server");
    io.on("connection", (socket) => {
      console.log("--- connected ---");

      socket.on("disconnect", () => {
        console.log("--- disconnected ---");
      });

      socket.on("join room", (data) => {
        let rmNumStr = data.roomNumber.toString();
        console.log("--- join room ---", rmNumStr);
        socket.join(rmNumStr);
        io.to(rmNumStr).emit("newUser");
      });

      socket.on("create room", (data) => {
        let rmNumStr = data.roomNumber.toString();
        console.log("--- room created ---", rmNumStr);
        socket.join(rmNumStr);
      });

      socket.on("sign request", (data) => {
        let rmNumStr = data.roomNumber.toString();
        console.log("--- sign request ---", rmNumStr);
        io.to(rmNumStr).emit("signRequest");
      });

      socket.on("send sign", (data) => {
        let rmNumStr = data.roomNumber.toString();

        io.to(rmNumStr).emit("sendSign", {
          signature: data.signature.toString(),
        });
      });

      socket.on("result", (data) => {
        let rmNumStr = data.roomNumber.toString();
        console.log("--- result ---", rmNumStr);
        io.to(rmNumStr).emit("result");
      });

      socket.on("test", () => {
        console.log("--- test ---");
        socket.broadcast.emit("test");
      });
    });
  };
  initSocketServer();
};

module.exports = { createSocketServer };
