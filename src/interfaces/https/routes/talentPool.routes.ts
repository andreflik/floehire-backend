import { Router } from "express";
import TalentPoolController from "../controllers/TalentPoolController";
import { recruiterAuthMiddleware } from "../middlewares/recruiterAuthMIddleware";
import {
  recruiterActionsRateLimiter,
  recruiterAuthRateLimiter,
} from "../middlewares/rateLimitMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

/**
 * @swagger
 * /talent-pool/candidates:
 *   post:
 *     tags: [Talent Pool]
 *     summary: Cadastrar candidato no banco de talentos
 *     description: Permite ao recruiter cadastrar manualmente um candidato no banco de talentos.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               phone:
 *                 type: string
 *                 example: 71999999999
 *               linkedin_url:
 *                 type: string
 *                 example: https://linkedin.com/in/joaosilva
 *               github_url:
 *                 type: string
 *                 example: https://github.com/joaosilva
 *               portfolio_url:
 *                 type: string
 *                 example: https://joaosilva.dev
 *     responses:
 *       201:
 *         description: Candidato cadastrado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 *       409:
 *         description: Candidato já existe
 */
router.post(
  "/candidates",
  recruiterAuthMiddleware,
  recruiterActionsRateLimiter,
  TalentPoolController.create,
);

/**
 * @swagger
 * /talent-pool/candidates:
 *   get:
 *     tags: [Talent Pool]
 *     summary: Listar candidatos do banco de talentos
 *     description: Retorna os candidatos cadastrados pela empresa no banco de talentos.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de candidatos
 *       401:
 *         description: Não autorizado
 */
router.get(
  "/candidates",
  recruiterAuthMiddleware,
  recruiterActionsRateLimiter,
  TalentPoolController.list,
);

/**
 * @swagger
 * /talent-pool/candidates/{candidateId}:
 *   get:
 *     tags: [Talent Pool]
 *     summary: Detalhar candidato do banco de talentos
 *     description: Retorna os detalhes de um candidato específico.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do candidato
 *     responses:
 *       200:
 *         description: Detalhes do candidato
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Candidato não encontrado
 */
router.get(
  "/candidates/:candidateId",
  recruiterAuthMiddleware,
  recruiterActionsRateLimiter,
  TalentPoolController.show,
);

/**
 * @swagger
 * /talent-pool/candidates/{candidateId}/apply:
 *   post:
 *     tags: [Talent Pool]
 *     summary: Enviar candidato do banco de talentos para uma vaga
 *     description: Associa um candidato existente a uma vaga e o coloca na primeira etapa do pipeline.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do candidato
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
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       201:
 *         description: Candidato enviado para a vaga com sucesso
 *       400:
 *         description: Erro de validação ou candidatura já existente
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Candidato ou vaga não encontrados
 */
router.post(
  "/candidates/:candidateId/apply",
  recruiterAuthMiddleware,
  recruiterActionsRateLimiter,
  TalentPoolController.applyToJob,
);

/**
 * @swagger
 * /talent-pool/upload-cv:
 *   post:
 *     tags: [Talent Pool]
 *     summary: Upload de CV (PDF) para criar candidato automaticamente
 *     description: Permite ao recruiter enviar um currículo em PDF e o sistema cria automaticamente um candidato no banco de talentos.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cv
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Candidato criado a partir do CV
 *       400:
 *         description: Arquivo inválido ou email não encontrado no CV
 *       401:
 *         description: Não autorizado
 */
router.post(
  "/upload-cv",
  recruiterAuthMiddleware,
  recruiterAuthRateLimiter,
  upload.single("cv"),
  (req, res, next) => {
    console.log("MULTER FILE:", req.file);
    next();
  },
  TalentPoolController.uploadCV,
);

export default router;
