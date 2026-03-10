import { Router } from "express";
import RecruiterController from "../controllers/RecruiterController";
import { validateBody } from "../middlewares/validateBody";
import {
  recruiterRegisterSchema,
  recruiterLoginSchema,
  recruiterRefreshSchema,
} from "@/application/validators/recruiterSchema";
import { recruiterAuthRateLimiter } from "../middlewares/rateLimitMiddleware";
import { recruiterAuthMiddleware } from "../middlewares/recruiterAuthMIddleware";

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
  recruiterAuthRateLimiter,
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
  recruiterAuthRateLimiter,
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
  recruiterAuthRateLimiter,
  validateBody(recruiterRefreshSchema),
  RecruiterController.refresh,
);

/**
 * @swagger
 * /recruiter/profile:
 *   get:
 *     tags: [Recruiter]
 *     summary: Buscar perfil da empresa
 *     description: Retorna os dados do recruiter autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil da empresa
 *       401:
 *         description: Não autorizado
 */
router.get(
  "/recruiter/profile",
  recruiterAuthMiddleware,
  RecruiterController.getProfile,
);

/**
 * @swagger
 * /recruiter/profile:
 *   put:
 *     tags: [Recruiter]
 *     summary: Atualizar perfil da empresa
 *     description: Atualiza informações da empresa recrutadora.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_name:
 *                 type: string
 *                 example: OpenAI
 *               website:
 *                 type: string
 *                 example: https://openai.com
 *               linkedin:
 *                 type: string
 *                 example: https://linkedin.com/company/openai
 *               location:
 *                 type: string
 *                 example: Remote
 *               description:
 *                 type: string
 *                 example: Empresa de inteligência artificial
 *               logo_url:
 *                 type: string
 *                 example: https://cdn.site/logo.png
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       401:
 *         description: Não autorizado
 */
router.put(
  "/recruiter/profile",
  recruiterAuthMiddleware,
  RecruiterController.updateProfile,
);

export default router;
