import chatService from "./chat.service.js";

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

            console.error("========== ERROR ==========");
            console.error(err);

            res.status(500).json({
                success: false,
                message: error.message,
                stack: error.stack
            });

        }

    }

}

export default new ChatController();