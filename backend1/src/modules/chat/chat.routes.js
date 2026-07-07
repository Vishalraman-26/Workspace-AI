import express from "express";
import chatController from "./chat.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import ConversationService from "../conversation/conversation.service.js";
const router = express.Router();

// -----------------------------
// Chat Messages
// -----------------------------

router.post(
    "/",
    authenticate,
    chatController.chat
);

// -----------------------------
// Chat Sessions
// -----------------------------

router.get(
    "/sessions",
    authenticate,
    chatController.listSessions
);

router.get(
    "/:sessionId/messages",
    authenticate,
    chatController.getMessages
);

router.post(
    "/sessions",
    authenticate,
    chatController.createSession
);

router.patch(
    "/sessions/:id",
    authenticate,
    chatController.renameSession
);

router.delete(
    "/sessions/:id",
    authenticate,
    chatController.deleteSession
);

export default router;