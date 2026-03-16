import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./interfaces/https/routes";
import { errorHandlerMiddleware } from "./interfaces/https/middlewares/errorHandlerMiddleware";
import { errorHandler } from "@/interfaces/https/middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "@/infra/docs/swagger";
import { globalRateLimiter } from "./interfaces/https/middlewares/rateLimitMiddleware";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

app.use(globalRateLimiter);

app.use(routes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("API FloeHire rodando 🚀");
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🔥 Backend rodando em http://localhost:${PORT}`);
});

app.use(errorHandler);
