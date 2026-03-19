import dotenv from "dotenv";
import dns from "dns";

// Fix for MongoDB Atlas DNS resolution issues on certain networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();
