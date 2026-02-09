import { Router } from "express";
import { recruiterAuthMiddleware } from "@/interfaces/https/middlewares/recruiterAuthMIddleware";
import JobController from "../controllers/JobController";

const router = Router();

router.get("/public", JobController.listPublic);
router.get("/public/:id", JobController.showPublic);

router.use(recruiterAuthMiddleware);

router.post("/", JobController.create);
router.get("/", JobController.list);
router.get("/:id", JobController.show);
router.put("/:id", JobController.update);
router.patch("/:id/status", JobController.updateStatus);
router.delete("/:id", JobController.delete);

export default router;
