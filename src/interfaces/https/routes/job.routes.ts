import { Router } from "express";
import { recruiterAuthMiddleware } from "@/interfaces/https/middlewares/recruiterAuthMiddleware";
import JobController from "../controllers/JobController";

const router = Router();

router.get("/public", JobController.listPublic);

router.use(recruiterAuthMiddleware);

router.post("/", JobController.create);
router.get("/", JobController.list);
router.get("/:id", JobController.show);

export default router;
