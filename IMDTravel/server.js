import express from "express";
import axios from "axios"; // para fazer requisições aos outros serviços
import {
  buscarVoo,
  buscarTaxa,
  venderPassagem,
  bonificar
} from "./RecuperacaoDeFalhas.js";

const app = express();
app.use(express.json());



app.get("/", (req, res) => {
  res.send("IMDTravel funcionando!");
});


// Endpoint principal - Request 0
app.post("/buyTicket", async (req, res) => {
  const { flight, day, user, ft } = req.body;

  if (!flight || !day || !user) {
    return res.status(400).json({ error: "Parâmetros 'flight', 'day' e 'user' são obrigatórios." });
  }

  try {
    console.log(`${user} está comprando a passagem ${flight} para o dia ${day}`);

    // 1️⃣ Consultar o voo no AirlinesHub
    const flightData = await buscarVoo(flight, day, ft);

    // 2️⃣ Buscar taxa de câmbio no Exchange
    const rate = await buscarTaxa(ft);

    // 3️⃣ Calcular valor final em reais
    const valueInReais = (flightData.value * rate).toFixed(2);

    // 4️⃣ Registrar a venda no AirlinesHub
    const transactionId = await venderPassagem(flightData.flight, flightData.day, ft);

    // 5️⃣ Enviar bônus para o Fidelity
    const bonus = Math.round(flightData.value); // bônus é o valor em dólar arredondado
    await bonificar(user, bonus, ft);

    // ✅ Resposta final
    res.status(200).json({
      message: "Compra realizada com sucesso!",
      transactionId,
      details: {
        flight,
        day,
        user,
        dollarValue: flightData.value,
        exchangeRate: rate,
        valueInReais
      }
    });

  } catch (error) {
    console.error(`Erro durante a compra de ${user}:`, error.message);
    res.status(500).json({ error: "Falha ao processar a compra." });
  }
});

app.listen(3001, () => console.log("🟢 IMDTravel rodando na porta 3001"));
