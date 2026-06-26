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

        catch(error){

            return res.status(500).json({

                success:false,

                message:error.message

            });

        }

    }

}

export default new ChatController();