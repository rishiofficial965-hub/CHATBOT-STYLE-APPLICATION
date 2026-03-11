import app from "./src/app.js";
import connectToDb from "./src/config/database.js";
import dotenv from "dotenv";

dotenv.config();
connectToDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}.....`));
