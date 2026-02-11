import { Router } from "express";
import CandidateController from "../controllers/CandidateController";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Candidate
 *     description: Endpoints do candidato
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CandidateRegister:
 *       type: object
 *       required:
 *         - full_name
 *         - email
 *         - password
 *         - lgpd_consent
 *       properties:
 *         full_name:
 *           type: string
 *           example: "João da Silva"
 *         email:
 *           type: string
 *           example: "joao@email.com"
 *         password:
 *           type: string
 *           example: "123456"
 *         phone:
 *           type: string
 *           example: "71999999999"
 *         city:
 *           type: string
 *           example: "Salvador"
 *         state:
 *           type: string
 *           example: "BA"
 *         linkedin_url:
 *           type: string
 *           example: "https://linkedin.com/in/joao"
 *         github_url:
 *           type: string
 *           example: "https://github.com/joao"
 *         portfolio_url:
 *           type: string
 *           example: "https://meuportfolio.com"
 *         lgpd_consent:
 *           type: boolean
 *           example: true
 *
 *     CandidateLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: "joao@email.com"
 *         password:
 *           type: string
 *           example: "123456"
 *
 *     RefreshToken:
 *       type: object
 *       required:
 *         - refresh_token
 *       properties:
 *         refresh_token:
 *           type: string
 *           example: "uuid-do-refresh-token"
 *
 *     ResetPassword:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           example: "uuid-do-token"
 *         newPassword:
 *           type: string
 *           example: "NovaSenha123"
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           example: "jwt.access.token"
 *         refresh_token:
 *           type: string
 *           example: "uuid-refresh-token"
 *         candidate:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "uuid"
 *             full_name:
 *               type: string
 *               example: "João da Silva"
 *             email:
 *               type: string
 *               example: "joao@email.com"
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Erro de validação"
 */

/**
 * @swagger
 * /candidate/register:
 *   post:
 *     summary: Cadastrar novo candidato
 *     tags: [Candidate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CandidateRegister'
 *     responses:
 *       201:
 *         description: Candidato cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já cadastrado
 */
router.post("/candidate/register", CandidateController.register);

/**
 * @swagger
 * /candidate/login:
 *   post:
 *     summary: Login do candidato
 *     tags: [Candidate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CandidateLogin'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/candidate/login", CandidateController.login);

/**
 * @swagger
 * /candidate/forgot-password:
 *   post:
 *     summary: Solicitar redefinição de senha
 *     tags: [Candidate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "joao@email.com"
 *     responses:
 *       200:
 *         description: E-mail enviado com instruções
 *       404:
 *         description: Email não encontrado
 */
router.post("/candidate/forgot-password", CandidateController.forgotPassword);

/**
 * @swagger
 * /candidate/reset-password:
 *   post:
 *     summary: Redefinir senha do candidato
 *     tags: [Candidate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post("/candidate/reset-password", CandidateController.resetPassword);

/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Renovar access token do candidato
 *     tags: [Candidate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshToken'
 *     responses:
 *       200:
 *         description: Novo access token gerado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   example: "novo.jwt.access.token"
 *       401:
 *         description: Refresh token inválido ou expirado
 */
router.post("/refresh", CandidateController.refresh);

export default router;
