import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authenticate, async (req, res) => {

    res.json({

        success: true,

        user: req.user

    });

});

export default router;