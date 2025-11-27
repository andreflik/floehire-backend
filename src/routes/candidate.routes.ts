import { Router } from "express";
import CandidateController from "../controllers/CandidateController";

const router = Router();

router.post("/register", CandidateController.register);

export default router;
