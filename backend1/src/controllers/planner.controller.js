import { chatService } from "../services/planner.service.js";

export async function planner(req, res) {


    try {

        const { message } = req.body;

        const response = await chatService(message);


        return res.json(response);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message
        });

    }

}