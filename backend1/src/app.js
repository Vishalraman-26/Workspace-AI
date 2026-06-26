import express from "express";
import cors from "cors";
import supabase from "./config/supabase.js";
import healthRoutes from "./routes/health.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import plannerRoutes from "./routes/planner.routes.js";
const app = express();
import toolRoutes from "./routes/tool.routes.js";
import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
app.use(cors());

app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/chat", aiRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/tool", toolRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});
export default app;