import { Router } from "express";
import { candidateAuthMiddleware } from "../middlewares/candidateAuthMiddleware";
import { recruiterAuthMiddleware } from "@/interfaces/https/middlewares/recruiterAuthMiddleware";
import { ApplicationController } from "../controllers/ApplicationController";

const router = Router();

router.post("/", candidateAuthMiddleware, ApplicationController.apply);

router.get("/me", candidateAuthMiddleware, ApplicationController.listMine);

router.get(
  "/jobs/:jobId/applications",
  recruiterAuthMiddleware,
  ApplicationController.listByJob,
);

router.patch(
  "/:applicationId/move",
  recruiterAuthMiddleware,
  ApplicationController.move,
);

router.patch(
  "/:applicationId/evaluate",
  recruiterAuthMiddleware,
  ApplicationController.evaluate,
);

router.get(
  "/:applicationId/history",
  recruiterAuthMiddleware,
  ApplicationController.history,
);

router.delete(
  "/:applicationId",
  recruiterAuthMiddleware,
  ApplicationController.remove,
);

export default router;
