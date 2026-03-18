import "./src/config/env.js";
import app from "./src/app.js";
import connectToDb from "./src/config/database.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

const httpServer = http.createServer(app);

initSocket(httpServer);

connectToDb().catch((err) => {
  console.error("MongoDB connection failed:", err);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server is running on port ${PORT}.....`),
);
