import { Router } from "express";
import RecruiterController from "../controllers/RecruiterController";

const router = Router();

router.post("/recruiter/register", RecruiterController.register);
router.post("/recruiter/login", RecruiterController.login);
router.post("/recruiter/refresh", RecruiterController.refresh);

export default router;
