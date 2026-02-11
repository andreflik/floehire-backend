import { Router } from "express";
import JobController from "../controllers/JobController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Vagas públicas e privadas
 */

/**
 * @swagger
 * /public/jobs:
 *   get:
 *     summary: Listar vagas públicas
 *     tags: [Jobs]
 *     description: Retorna uma lista paginada de vagas públicas disponíveis para candidatos.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Página atual
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Quantidade de itens por página
 *     responses:
 *       200:
 *         description: Lista de vagas públicas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 */
router.get("/public/jobs", JobController.listPublic);

export default router;
