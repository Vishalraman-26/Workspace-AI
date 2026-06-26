import dotenv from "dotenv";
import app from "./app.js";

import env from "./config/env.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
app.listen(env.PORT, () => {
    console.log("=================================");
    console.log("🚀 Workspace AI Backend Started");
    console.log(`🌍 http://localhost:${PORT}`);
    console.log("=================================");

});

