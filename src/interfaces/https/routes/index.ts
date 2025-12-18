import { Router } from "express";

import recruiterRoutes from "./recruiter.routes";
import candidateRoutes from "./candidate.routes";
import jobRoutes from "./job.routes";
import applicationRoutes from "./application.routes";

const router = Router();

// rotas públicas / auth
router.use("/", candidateRoutes);
router.use("/", recruiterRoutes);

// rotas protegidas
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);

export default router;
