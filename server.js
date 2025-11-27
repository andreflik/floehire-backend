const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "ok",
      db: "Conectado",
      time: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: "erro",
      mensagem: err.message
    });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "🔥 FloeHire Backend rodando" });
});

const PORT = 3333;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Backend rodando em http://0.0.0.0:${PORT}`);
});
