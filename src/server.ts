import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import candidateRoutes from "./interfaces/https/routes/candidate.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ===========================
//   🔥 ROTAS DO CANDIDATO
// ===========================
console.log("📌 Rotas de candidato carregadas!");
app.use("/", candidateRoutes);

// ROTA DE TESTE
app.get("/", (req, res) => {
  res.send("API FloeHire rodando 🚀");
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🔥 Backend rodando em http://localhost:${PORT}`);
});
