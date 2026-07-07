import chatService from "./chat.service.js";
import ChatSessionService from "./chatSession.service.js";
import ConversationService from "../conversation/conversation.service.js";

class ChatController {

    async chat(req, res) {

        try {

            const { message, sessionId } = req.body;

            const result = await chatService.chat(
                req.user.id,
                sessionId,
                message
            );

            return res.json({
                success: true,
                reply: result
            });

        }

        catch (error) {

            console.error("========== CHAT ERROR ==========");
            console.error(error);

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    async createSession(req, res) {

        try {

            const session = await ChatSessionService.create(
                req.user.id
            );

            return res.status(201).json(session);

        }

        catch (error) {

            console.error("========== CREATE SESSION ERROR ==========");
            console.error(error);

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    async listSessions(req, res) {

        try {

            const sessions = await ChatSessionService.list(
                req.user.id
            );

            return res.json(sessions);

        }

        catch (error) {

            console.error("========== LIST SESSION ERROR ==========");
            console.error(error);

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    async renameSession(req, res) {

        try {

            const session = await ChatSessionService.rename(

                req.user.id,

                req.params.id,

                req.body.title

            );

            return res.json(session);

        }

        catch (error) {

            console.error("========== RENAME SESSION ERROR ==========");
            console.error(error);

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    async deleteSession(req, res) {

        try {

            await ChatSessionService.delete(

                req.user.id,

                req.params.id

            );

            return res.json({
                success: true
            });

        }

        catch (error) {

            console.error("========== DELETE SESSION ERROR ==========");
            console.error(error);

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }
    async getMessages(req, res) {

        try {
    
            const messages = await ConversationService.history(
                req.user.id,
                req.params.sessionId,
                1000
            );
    
            return res.json(messages);
    
        } catch (error) {
    
            console.error(error);
    
            return res.status(500).json({
                success: false,
                message: error.message
            });
    
        }
    
    }
}

export default new ChatController();