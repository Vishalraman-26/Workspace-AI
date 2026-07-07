import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import { authenticate } from "../../middleware/auth.middleware.js";
import * as Controller from "./rag.controller.js";

const router = express.Router();

const UPLOAD_DIR = "uploads";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Create uploads folder if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, UPLOAD_DIR);

    },

    filename(req, file, cb) {

        cb(

            null,

            `${Date.now()}${path.extname(file.originalname)}`

        );

    }

});

const allowedMimeTypes = [

    "application/pdf",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "text/plain"

];

const upload = multer({

    storage,

    limits: {

        fileSize: MAX_FILE_SIZE

    },

    fileFilter(req, file, cb) {

        if (!allowedMimeTypes.includes(file.mimetype)) {

            return cb(

                new Error(
                    "Only PDF, DOCX and TXT files are supported."
                )
            );

        }

        cb(null, true);

    }

});

router.post(

    "/upload",

    authenticate,

    (req, res, next) => {

        upload.single("document")(req, res, function (err) {

            if (err instanceof multer.MulterError) {

                return res.status(400).json({

                    success: false,

                    message:
                        err.code === "LIMIT_FILE_SIZE"
                            ? "File size exceeds 10 MB."
                            : err.message

                });

            }

            if (err) {

                return res.status(400).json({

                    success: false,

                    message: err.message

                });

            }

            next();

        });

    },

    Controller.upload

);

router.post(

    "/ask",

    authenticate,

    Controller.ask

);
router.get(
    "/documents",
    authenticate,
    Controller.listDocuments
)
router.delete(
    "/documents/:title",
    authenticate,
    (req, res, next) => {
        console.log("DELETE ROUTE HIT:", req.params.title);
        next();
    },
    
    Controller.deleteDocument
);

export default router;