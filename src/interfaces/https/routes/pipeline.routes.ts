import { Router } from "express";
import { recruiterAuthMiddleware } from "@/interfaces/https/middlewares/recruiterAuthMiddleware";
import { PipelineController } from "../controllers/PipelineController";

const router = Router();

router.get(
  "/pipeline/jobs/:jobId",
  recruiterAuthMiddleware,
  PipelineController.getJobPipeline,
);

export default router;
