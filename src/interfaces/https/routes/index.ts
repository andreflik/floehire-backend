import express from "express";

import recruiterRoutes from "./recruiter.routes";
import candidateRoutes from "./candidate.routes";
import jobRoutes from "./job.routes";
import applicationRoutes from "./application.routes";
import pipelineRoutes from "./pipeline.routes";
import publicJobsRoutes from "./public.jobs.routes";
import socialAuthRoutes from "./socialAuth.routes";

const router = express.Router();

router.use("/jobs", jobRoutes);
router.use("/", publicJobsRoutes);

router.use("/", candidateRoutes);
router.use("/", recruiterRoutes);
router.use("/applications", applicationRoutes);
router.use("/", pipelineRoutes);

router.use(socialAuthRoutes);

export default router;
