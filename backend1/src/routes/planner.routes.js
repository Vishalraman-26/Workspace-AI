import express from "express";
import { planner  } from "../controllers/planner.controller.js";

const router = express.Router();

router.post("/", planner);

export default router;