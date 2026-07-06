import express from "express";
import { authenticate } from "../../middleware/auth.middleware.js";

import multer from "multer";
import path from "path";
import * as Controller from "./rag.controller.js";

const router=express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    }
});

const upload = multer({ storage });

router.post(

    "/upload",
    authenticate,
    upload.single("document"),
    (req, res, next) => {
        console.log("FILE:", req.file);
        next();
    },
    
    Controller.upload

);

router.post(

    "/ask",
    authenticate,

    Controller.ask

);

export default router;