import express from "express";
import chatController from "./chat.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, chatController.chat);

export default router;