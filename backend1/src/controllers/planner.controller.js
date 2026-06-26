import { chatService } from "../services/planner.service.js";

export async function planner(req, res) {

    console.log("Controller Started");

    try {

        const { message } = req.body;

        const response = await chatService(message);

        console.log("Response =", response);

        return res.json(response);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message
        });

    }

}