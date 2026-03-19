import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

console.log("Environment variables loaded and DNS configured.");
