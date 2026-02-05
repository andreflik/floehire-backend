import { Router } from "express";
import RecruiterController from "../controllers/RecruiterController";
import { validateBody } from "../middlewares/validateBody";
import {
  recruiterRegisterSchema,
  recruiterLoginSchema,
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

export default router;
