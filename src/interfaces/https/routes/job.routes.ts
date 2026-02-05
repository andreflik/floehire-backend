import { Router } from "express";
import { recruiterAuthMiddleware } from "@/interfaces/https/middlewares/recruiterAuthMiddleware";
import JobController from "../controllers/JobController";

const router = Router();

router.get("/public", JobController.listPublic);

router.use(recruiterAuthMiddleware);

router.post("/", JobController.create);
router.get("/", JobController.list);
router.get("/:id", JobController.show);
router.get("/public/:id", JobController.showPublic);

router.put("/:id", JobController.update);
router.delete("/:id", JobController.delete);
router.patch("/:id/status", JobController.updateStatus);

export default router;
