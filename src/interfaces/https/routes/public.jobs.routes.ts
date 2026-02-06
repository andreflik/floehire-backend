import { Router } from "express";
import JobController from "../controllers/JobController";

const router = Router();

router.get("/public/jobs", JobController.listPublic);

export default router;
