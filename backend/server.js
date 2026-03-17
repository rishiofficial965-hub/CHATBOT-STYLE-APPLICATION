import "./src/config/env.js";
import app from "./src/app.js";
import connectToDb from "./src/config/database.js";

connectToDb();
  
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}.....`));

