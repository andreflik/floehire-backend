import { Router } from "express";
import { candidateAuthMiddleware } from "../middlewares/candidateAuthMiddleware";
import { recruiterAuthMiddleware } from "@/interfaces/https/middlewares/recruiterAuthMiddleware";
import { ApplicationController } from "../controllers/ApplicationController";

const router = Router();

router.post("/", candidateAuthMiddleware, ApplicationController.apply);

router.get(
  "/jobs/:jobId/applications",
  recruiterAuthMiddleware,
  ApplicationController.listByJob
);

export default router;
