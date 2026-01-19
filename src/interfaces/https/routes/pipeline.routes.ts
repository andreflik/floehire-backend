import express from "express";
import { recruiterAuthMiddleware } from "../middlewares/recruiterAuthMiddleware";
import PipelineController from "../controllers/PipelineController";

const router = express.Router();

router.patch(
  "/applications/:applicationId/move",
  recruiterAuthMiddleware,
  PipelineController.move,
);

export default router;
