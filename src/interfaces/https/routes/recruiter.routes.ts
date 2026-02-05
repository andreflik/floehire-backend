import { Router } from "express";
import RecruiterController from "../controllers/RecruiterController";
import { validateBody } from "../middlewares/validateBody";
import {
  recruiterRegisterSchema,
  recruiterLoginSchema,
  recruiterRefreshSchema,
} from "@/application/validators/recruiterSchema";

const router = Router();

router.post(
  "/recruiter/register",
  validateBody(recruiterRegisterSchema),
  RecruiterController.register,
);

router.post(
  "/recruiter/login",
  validateBody(recruiterLoginSchema),
  RecruiterController.login,
);

router.post(
  "/recruiter/refresh",
  validateBody(recruiterRefreshSchema),
  RecruiterController.refresh,
);

export default router;
