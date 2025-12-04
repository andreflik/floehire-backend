import { Router } from "express";
import CandidateController from "../controllers/CandidateController";

const router = Router();
router.post("/candidate/register", CandidateController.register);
router.post("/candidate/login", CandidateController.login);

router.post("/candidate/forgot-password", CandidateController.forgotPassword);
router.post("/candidate/reset-password", CandidateController.resetPassword);

export default router;
