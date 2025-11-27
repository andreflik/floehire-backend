import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "FloeHire Backend rodando 🚀" });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`🔥 Backend rodando em http://localhost:${PORT}`);
});
