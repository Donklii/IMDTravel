const express = require("express");
const app = express();
app.use(express.json());

let fimDaFalha = 0;

app.get("/", (req, res) => {
  res.send("Exchange funcionando!");
});


// Endpoint para conversão (Request 2)
app.get("/convert", async (req, res) => {

  const momentoAtual = Date.now();
  if (momentoAtual < fimDaFalha) {
    console.log("❌  /convert em modo de falha: retornando erro  ❌");
    return res.status(500).json({ error: "Falha simulada no serviço de conversão" })
  } else {
    if (Math.random() < 0.1) {
      fimDaFalha = momentoAtual + 5_000;
      console.log("\n\n⚠️❌  Falhando /convert  ❌⚠️\n\n");
     
      return res.status(500).json({ error: "Falha simulada no serviço de conversão" })
    }
  }

  
  const rate = (5 + Math.random()).toFixed(2); // Taxa aleatória entre 5 e 6
  res.json({ rate: Number(rate) });
});

app.listen(3003, () => console.log("🟢 Exchange rodando na porta 3003"));
