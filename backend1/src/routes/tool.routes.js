import express from "express";

import { executeTool } from "../tools/toolExecutor.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        const result = await executeTool(req.body);

        res.json(result);

    }

    catch (err) {

        res.status(500).json({

            error: err.message

        });

    }

});

export default router;