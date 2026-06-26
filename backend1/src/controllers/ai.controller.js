import { chatService } from "../services/ai.service.js";

export async function chat(req, res) {

    try {

        const { message } = req.body;

        const response = await chatService(message);

        res.status(200).json(response);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

}