const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Fidelity funcionando!");
});


// Endpoint para registrar bônus (Request 4)
app.post("/bonus", (req, res) => {
  const { user, bonus } = req.body;

  if (!user || bonus === undefined) {
    return res.status(400).json({ error: "Parâmetros 'user' e 'bonus' são obrigatórios." });
  }

  console.log(`Bônus de ${bonus} pontos enviado para o usuário ${user}.`);
  res.status(200).json({ message: "Bônus aplicado com sucesso!" });
});

app.listen(3004, () => console.log("🟢 Fidelity rodando na porta 3004"));
