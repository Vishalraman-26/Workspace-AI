import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";

import {

    test,

    createMeeting,

    updateMeeting,

    deleteMeeting

} from "./calendar.controller.js";

const router = Router();

router.get(

    "/test",

    authenticate,

    test

);

router.post(

    "/create",

    authenticate,

    createMeeting

);

router.put(

    "/update",

    authenticate,

    updateMeeting

);

router.delete(

    "/delete",

    authenticate,

    deleteMeeting

);

export default router;