import express from "express";

import recruiterRoutes from "./recruiter.routes";
import candidateRoutes from "./candidate.routes";
import jobRoutes from "./job.routes";
import applicationRoutes from "./application.routes";
import pipelineRoutes from "./pipeline.routes";
import publicJobsRoutes from "./public.jobs.routes";

const router = express.Router();

/**
 * ============================
 * 🌍 ROTAS PÚBLICAS
 * ============================
 */
router.use("/jobs", jobRoutes);
router.use("/", publicJobsRoutes);

/**
 * ============================
 * 🔐 ROTAS AUTHENTICADAS
 * ============================
 */
router.use("/", candidateRoutes);
router.use("/", recruiterRoutes);
router.use("/applications", applicationRoutes);
router.use("/", pipelineRoutes);

export default router;
