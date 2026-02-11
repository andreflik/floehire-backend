import { Router } from "express";
import { candidateAuthMiddleware } from "../middlewares/candidateAuthMiddleware";
import { recruiterAuthMiddleware } from "@/interfaces/https/middlewares/recruiterAuthMIddleware";
import { ApplicationController } from "../controllers/ApplicationController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Gerenciamento de candidaturas
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Candidatar-se a uma vaga
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_id
 *             properties:
 *               job_id:
 *                 type: string
 *                 format: uuid
 *                 example: "b3b1c7f2-3e1a-4c9d-9c1a-123456789abc"
 *     responses:
 *       201:
 *         description: Candidatura criada com sucesso
 *       400:
 *         description: Dados inválidos ou já candidato à vaga
 *       401:
 *         description: Não autorizado
 */
router.post("/", candidateAuthMiddleware, ApplicationController.apply);

/**
 * @swagger
 * /applications/me:
 *   get:
 *     summary: Listar minhas candidaturas (candidato)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de candidaturas do candidato
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Não autorizado
 */
router.get("/me", candidateAuthMiddleware, ApplicationController.listMine);

/**
 * @swagger
 * /applications/jobs/{jobId}/applications:
 *   get:
 *     summary: Listar candidaturas de uma vaga (recrutador)
 *     tags: [Applications]
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
 *         description: Lista de candidaturas da vaga
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Vaga não encontrada
 */
router.get(
  "/jobs/:jobId/applications",
  recruiterAuthMiddleware,
  ApplicationController.listByJob,
);

/**
 * @swagger
 * /applications/{applicationId}/move:
 *   patch:
 *     summary: Mover candidato de etapa no pipeline
 *     tags: [Applications]
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
 *               - toStageId
 *             properties:
 *               toStageId:
 *                 type: string
 *                 format: uuid
 *                 example: "a1b2c3d4-1234-5678-9012-abcdefabcdef"
 *     responses:
 *       200:
 *         description: Candidato movido com sucesso
 *       400:
 *         description: Transição de etapa inválida
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Candidatura ou etapa não encontrada
 */
router.patch(
  "/:applicationId/move",
  recruiterAuthMiddleware,
  ApplicationController.move,
);

/**
 * @swagger
 * /applications/{applicationId}/evaluate:
 *   patch:
 *     summary: Avaliar candidato
 *     tags: [Applications]
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
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               notes:
 *                 type: string
 *                 example: "Bom desempenho na entrevista técnica"
 *     responses:
 *       200:
 *         description: Avaliação salva com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Candidatura não encontrada
 */
router.patch(
  "/:applicationId/evaluate",
  recruiterAuthMiddleware,
  ApplicationController.evaluate,
);

/**
 * @swagger
 * /applications/{applicationId}/history:
 *   get:
 *     summary: Ver histórico da candidatura
 *     tags: [Applications]
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
 *     responses:
 *       200:
 *         description: Histórico da candidatura
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Candidatura não encontrada
 */
router.get(
  "/:applicationId/history",
  recruiterAuthMiddleware,
  ApplicationController.history,
);

/**
 * @swagger
 * /applications/{applicationId}:
 *   delete:
 *     summary: Remover candidatura
 *     tags: [Applications]
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
 *     responses:
 *       204:
 *         description: Candidatura removida com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Candidatura não encontrada
 */
router.delete(
  "/:applicationId",
  recruiterAuthMiddleware,
  ApplicationController.remove,
);

export default router;
