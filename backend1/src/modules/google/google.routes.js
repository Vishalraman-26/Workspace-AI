import express from "express";
import GoogleController from "./google.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import GmailService from "./gmail.service.js";
import * as CalendarController from "./calendar.controller.js";

const router = express.Router();

router.get(
    "/connect",
    authenticate,
    GoogleController.connect
);

router.get(
    "/callback",
    GoogleController.callback
);
router.get(
    "/gmail/inbox",
    authenticate,
    GoogleController.fetchInbox
);

router.get(
    "/gmail/summary",
    authenticate,
    GoogleController.summarizeInbox
);

router.get("/calendar/test", authenticate, async (req, res) => {

    const profile = await CalendarFetcher.getProfile(req.user.id);

    res.json(profile);

});

router.get("/gmail/test",
    authenticate,
    async (req, res) => {
        try {
            const result = await GmailService.test(req.user.id);
            res.json(result);
        }
        catch (err) {
            res.status(500).json({
                success:false,
                message:err.message
            });
        }
    }
);
export default router;








