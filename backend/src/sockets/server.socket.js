import { Server } from "socket.io";

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  console.log("Socket.io server is running");

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("send-message", (message) => {
      console.log("Message received:", message);
      setTimeout(() => {
        socket.emit("receive-message", `I received your message: "${message}". How can I help you further?`);
      }, 500);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

export function getIO() {
  if (!io) throw new Error("Socket not initialized");
  return io;
}
