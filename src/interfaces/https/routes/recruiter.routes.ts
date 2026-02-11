import { Router } from "express";
import RecruiterController from "../controllers/RecruiterController";
import { validateBody } from "../middlewares/validateBody";
import {
  recruiterRegisterSchema,
  recruiterLoginSchema,
  recruiterRefreshSchema,
} from "@/application/validators/recruiterSchema";

const router = Router();

/**
 * @swagger
 * /recruiter/register:
 *   post:
 *     tags:
 *       - Recruiter
 *     summary: Cadastrar uma empresa (recruiter)
 *     description: Cria uma nova conta de recruiter (empresa).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company_name
 *               - email
 *               - password
 *             properties:
 *               company_name:
 *                 type: string
 *                 example: "Minha Empresa LTDA"
 *               email:
 *                 type: string
 *                 example: "empresa@teste.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Recruiter criado com sucesso
 *       409:
 *         description: Empresa já cadastrada
 *       400:
 *         description: Erro de validação
 */
router.post(
  "/recruiter/register",
  validateBody(recruiterRegisterSchema),
  RecruiterController.register,
);

/**
 * @swagger
 * /recruiter/login:
 *   post:
 *     tags:
 *       - Recruiter
 *     summary: Login do recruiter
 *     description: Autentica a empresa e retorna access token e refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "empresa@teste.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 *       400:
 *         description: Erro de validação
 */
router.post(
  "/recruiter/login",
  validateBody(recruiterLoginSchema),
  RecruiterController.login,
);

/**
 * @swagger
 * /recruiter/refresh:
 *   post:
 *     tags:
 *       - Recruiter
 *     summary: Renovar access token do recruiter
 *     description: Gera um novo access token a partir de um refresh token válido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Novo access token gerado
 *       401:
 *         description: Refresh token inválido ou expirado
 *       400:
 *         description: Erro de validação
 */
router.post(
  "/recruiter/refresh",
  validateBody(recruiterRefreshSchema),
  RecruiterController.refresh,
);

export default router;
