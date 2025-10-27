const express = require("express");
const app = express();
app.use(express.json());

// 🧭 Endpoint para consultar voo (Request 1)
app.get("/", (req, res) => {
  res.send("AirlinesHub funcionando!");
});


app.get("/flight", (req, res) => {
  const { flight, day } = req.query;

  if (!flight || !day) {
    return res.status(400).json({ error: "Parâmetros 'flight' e 'day' são obrigatórios." });
  }

  // Simula um valor de passagem em dólar
  const value = (100 + Math.random() * 400).toFixed(2);

  res.json({
    flight,
    day,
    value: Number(value)
  });
});

// 💸 Endpoint para registrar venda (Request 3)
app.post("/sell", (req, res) => {
  const { flight, day } = req.body;

  if (!flight || !day) {
    return res.status(400).json({ error: "Parâmetros 'flight' e 'day' são obrigatórios." });
  }

  // Gera ID único simples
  const transactionId = Math.random().toString(36).substring(2, 10);

  res.json({ transactionId });
});

app.listen(3002, () => console.log("🟢 AirlinesHub rodando na porta 3002"));
