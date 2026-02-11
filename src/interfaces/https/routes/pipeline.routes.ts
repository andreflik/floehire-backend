import { Router } from "express";
import { recruiterAuthMiddleware } from "@/interfaces/https/middlewares/recruiterAuthMIddleware";
import { PipelineController } from "../controllers/PipelineController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pipeline
 *   description: Pipeline de candidaturas
 */

/**
 * @swagger
 * /pipeline/jobs/{jobId}:
 *   get:
 *     summary: Obter pipeline da vaga
 *     tags: [Pipeline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da vaga
 *     responses:
 *       200:
 *         description: Pipeline da vaga retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobId:
 *                   type: string
 *                   format: uuid
 *                 stages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       stage:
 *                         type: string
 *                         example: APPLIED
 *                       applications:
 *                         type: array
 *                         items:
 *                           type: object
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Vaga não encontrada
 */
router.get(
  "/pipeline/jobs/:jobId",
  recruiterAuthMiddleware,
  PipelineController.getJobPipeline,
);

/**
 * @swagger
 * /pipeline/applications/{applicationId}/move:
 *   patch:
 *     summary: Mover candidatura no pipeline
 *     tags: [Pipeline]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da candidatura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toStage
 *             properties:
 *               toStage:
 *                 type: string
 *                 example: INTERVIEW
 *     responses:
 *       200:
 *         description: Candidatura movida com sucesso
 *       400:
 *         description: Transição de estágio inválida
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Candidatura não encontrada
 */
router.patch(
  "/pipeline/applications/:applicationId/move",
  recruiterAuthMiddleware,
  PipelineController.move,
);

export default router;
