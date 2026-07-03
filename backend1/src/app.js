import express from "express";
import cors from "cors";
import supabase from "./config/supabase.js";
import plannerRoutes from "./routes/planner.routes.js";
import toolRoutes from "./routes/tool.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import taskRoutes from "./modules/tasks/task.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import googleRoutes from "./modules/google/google.routes.js";
import calendarRoutes from "./modules/google/calendar.routes.js";
import ragRoutes from "./modules/rag/rag.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/tool", toolRoutes);
app.use(errorHandler);
app.use("/api/auth", authRoutes);
app.use("/api/google", googleRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/rag",ragRoutes);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});
export default app;