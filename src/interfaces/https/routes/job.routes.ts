import { Router } from "express";
import { recruiterAuthMiddleware } from "@/interfaces/https/middlewares/recruiterAuthMIddleware";
import JobController from "../controllers/JobController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Gerenciamento de vagas
 */

/**
 * @swagger
 * /jobs/public:
 *   get:
 *     summary: Listar vagas públicas
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Lista de vagas públicas
 */
router.get("/public", JobController.listPublic);

/**
 * @swagger
 * /jobs/public/{id}:
 *   get:
 *     summary: Detalhar vaga pública
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detalhes da vaga
 *       404:
 *         description: Vaga não encontrada
 */
router.get("/public/:id", JobController.showPublic);

router.use(recruiterAuthMiddleware);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Criar vaga
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Desenvolvedor Backend"
 *               description:
 *                 type: string
 *                 example: "Vaga para Node.js + TypeScript"
 *               city:
 *                 type: string
 *                 example: "Salvador"
 *               state:
 *                 type: string
 *                 example: "BA"
 *     responses:
 *       201:
 *         description: Vaga criada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post("/", JobController.create);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Listar vagas do recruiter
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vagas do recruiter
 *       401:
 *         description: Não autorizado
 */
router.get("/", JobController.list);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Detalhar vaga (privado)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detalhes da vaga
 *       404:
 *         description: Vaga não encontrada
 */
router.get("/:id", JobController.show);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Atualizar vaga
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vaga atualizada com sucesso
 *       404:
 *         description: Vaga não encontrada
 */
router.put("/:id", JobController.update);

/**
 * @swagger
 * /jobs/{id}/status:
 *   patch:
 *     summary: Atualizar status da vaga
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: "CLOSED"
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 */
router.patch("/:id/status", JobController.updateStatus);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Arquivar vaga
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Vaga arquivada com sucesso
 *       404:
 *         description: Vaga não encontrada
 */
router.delete("/:id", JobController.delete);

export default router;
