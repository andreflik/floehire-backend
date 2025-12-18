import { Router } from "express";
import { candidateAuthMiddleware } from "../middlewares/candidateAuthMiddleware";
import { ApplicationController } from "@/interfaces/https/routes/application.routes";

const router = Router();

router.use(candidateAuthMiddleware);

router.post("/", ApplicationController.apply);
