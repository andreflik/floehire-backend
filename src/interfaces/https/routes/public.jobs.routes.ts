import { Router } from "express";
import JobController from "../controllers/JobController";

const router = Router();

// Rota pública para candidatos
router.get("/public/jobs", JobController.publicList);

export default router;
