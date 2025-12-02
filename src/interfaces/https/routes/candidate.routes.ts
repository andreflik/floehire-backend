import { Router } from "express";
import CandidateController from "../controllers/CandidateController";

const router = Router();
console.log("📌 [ROUTES] candidate.routes.ts carregado!");
// REGISTER
router.post("/candidate/register", CandidateController.register);

// LOGIN
router.post("/candidate/login", CandidateController.login);

export default router;
