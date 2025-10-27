const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Exchange funcionando!");
});

// Endpoint para conversão (Request 2)
app.get("/convert", (req, res) => {
  // Gera taxa aleatória entre 5 e 6
  const rate = (5 + Math.random()).toFixed(2);
  res.json({ rate: Number(rate) });
});

app.listen(3003, () => console.log("🟢 Exchange rodando na porta 3003"));
