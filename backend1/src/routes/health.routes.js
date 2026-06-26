import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Workspace AI Backend Running",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
});

export default router;