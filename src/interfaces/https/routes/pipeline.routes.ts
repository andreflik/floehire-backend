import { Router } from "express";
import { recruiterAuthMiddleware } from "@/interfaces/https/middlewares/recruiterAuthMIddleware";
import { PipelineController } from "../controllers/PipelineController";

const router = Router();

router.get(
  "/pipeline/jobs/:jobId",
  recruiterAuthMiddleware,
  PipelineController.getJobPipeline,
);

router.patch(
  "/pipeline/applications/:applicationId/move",
  recruiterAuthMiddleware,
  PipelineController.move,
);

export default router;
