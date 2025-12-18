import { Router } from "express";
import RecruiterController from "../controllers/RecruiterController";

const router = Router();

router.post("/recruiter/register", RecruiterController.register);
router.post("/recruiter/login", RecruiterController.login);

export default router;
