const express = require("express");
const app = express();
app.use(express.json());


let fimDaFalha = 0;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

app.get("/", (req, res) => {
  res.send("AirlinesHub funcionando!");
});


// 🧭 Endpoint para consultar voo (Request 1)
app.get("/flight", (req, res) => {
  if (Math.random() < 0.2) {
    console.log("⚠️  Falha de Omission: ignorando resposta do /flight ⚠️"); // falhar
    return; // simplesmente não responde
  }

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
app.post("/sell", async (req, res) => {

  const momentoAtual = Date.now();
  if (momentoAtual < fimDaFalha) {
    console.log("⏳ /sell em falha: adicionando +5s de latência ⏳");
    await sleep(5000);
  } else {
    // Estado saudável: 10% de chance de entrar em modo de falha por 10s
    if (Math.random() < 0.1) {
      fimDaFalha = momentoAtual + 10_000;
      console.log("\n\n⚠️⏳ Ativando falha de tempo no /sell por 10s (aumentando latencia) ⚠️⏳\n\n");
      
      await sleep(5000);
    }
  }

  const { flight, day } = req.body;

  if (!flight || !day) {
    return res.status(400).json({ error: "Parâmetros 'flight' e 'day' são obrigatórios." });
  }

  const transactionId = Math.random().toString(36).substring(2, 10);  // Gera ID único simples

  res.json({ transactionId });
});

app.listen(3002, () => console.log("🟢 AirlinesHub rodando na porta 3002"));
