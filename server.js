const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "FloeHire Backend rodando 🚀" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`🔥 Backend rodando em http://localhost:${PORT}`);
});
