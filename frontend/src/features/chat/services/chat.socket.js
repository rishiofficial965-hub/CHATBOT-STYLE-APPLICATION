import { io } from "socket.io-client";


export const initializeSocketConnection = () => {
    const SOCKET_URL = import.meta.env.PROD ? "/" : "http://localhost:3000";
    
    const socket = io(SOCKET_URL, {
        withCredentials: true,
    });

    socket.on("connect", () => {
        console.log("Connected to server", socket.id);
    });

    return socket;
}