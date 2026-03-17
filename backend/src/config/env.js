import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

// Force Google DNS for SRV lookup (fixes querySrv ECONNREFUSED on some networks)
dns.setServers(['8.8.8.8', '8.8.4.4']);

console.log("Environment variables loaded and DNS configured.");
