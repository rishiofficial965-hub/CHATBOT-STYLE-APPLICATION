import { Server } from "socket.io";

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  console.log("Socket.io server is running");

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
  });
}

export function getIO() {
  if (!io) throw new Error("Socket not initialized");
  return io;
}
