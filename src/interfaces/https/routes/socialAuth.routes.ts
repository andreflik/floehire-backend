import { Router } from "express";
import { SocialAuthController } from "../controllers/SocialAuthController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SocialAuth
 *   description: Autenticação social (LinkedIn) para Candidate
 */

/**
 * @swagger
 * /auth/linkedin/redirect:
 *   get:
 *     summary: Redirecionar para login com LinkedIn
 *     tags: [SocialAuth]
 *     description: Redireciona o usuário para a página de autenticação do LinkedIn.
 *     responses:
 *       302:
 *         description: Redirecionamento para o LinkedIn
 *       500:
 *         description: LinkedIn OAuth não configurado ou erro interno
 */
router.get("/auth/linkedin/redirect", SocialAuthController.redirectToLinkedIn);

/**
 * @swagger
 * /auth/linkedin/callback:
 *   get:
 *     summary: Callback do LinkedIn OAuth (Candidate)
 *     tags: [SocialAuth]
 *     description: Endpoint chamado pelo LinkedIn após autenticação. Recebe o código e processa o login do candidate.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de autorização retornado pelo LinkedIn
 *       - in: query
 *         name: state
 *         required: false
 *         schema:
 *           type: string
 *         description: State enviado no início do fluxo OAuth
 *     responses:
 *       200:
 *         description: Login social processado com sucesso (por enquanto retorna o profile mock)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login com LinkedIn (candidate) recebido com sucesso"
 *                 profile:
 *                   type: object
 *       400:
 *         description: Código não informado ou inválido
 *       500:
 *         description: Erro ao autenticar com LinkedIn
 */
router.get("/auth/linkedin/callback", SocialAuthController.linkedInCallback);

export default router;
