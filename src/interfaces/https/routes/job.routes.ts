import { Router } from "express";
import { recruiterAuthMiddleware } from "@/interfaces/https/middlewares/recruiterAuthMIddleware";
import { JobController } from "../controllers/JobController";

const router = Router();

router.use(recruiterAuthMiddleware);

router.post("/", JobController.create);
router.get("/", JobController.list);
router.get("/:id", JobController.show);

export default router;
