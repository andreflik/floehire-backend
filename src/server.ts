import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./interfaces/https/routes";
import { errorHandlerMiddleware } from "./interfaces/https/middlewares/errorHandlerMiddleware";
import { errorHandler } from "@/interfaces/https/middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API FloeHire rodando 🚀");
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🔥 Backend rodando em http://localhost:${PORT}`);
});

app.use(errorHandlerMiddleware);
