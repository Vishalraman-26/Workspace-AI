import chatService from "./chat.service.js";

class ChatController {

    async chat(req, res) {

        try {

            const { message } = req.body;

            const result = await chatService.chat(

                req.user.id,

                message

            );

            return res.json({

                success: true,

                reply: result

            });

        }

        catch (err) {

            console.error("========== ERROR ==========");
            console.error(err);

            res.status(500).json({
                success: false,
                message: err.message,
                stack: err.stack
            });

        }

    }

}

export default new ChatController();