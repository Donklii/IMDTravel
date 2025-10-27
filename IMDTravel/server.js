const express = require("express");
const axios = require("axios"); // para fazer requisições aos outros serviços
const app = express();
app.use(express.json());


app.get("/", (req, res) => {
  res.send("IMDTravel funcionando!");
});


// Endpoint principal - Request 0
app.post("/buyTicket", async (req, res) => {
  const { flight, day, user } = req.body;

  if (!flight || !day || !user) {
    return res.status(400).json({ error: "Parâmetros 'flight', 'day' e 'user' são obrigatórios." });
  }

  try {
    // 1️⃣ Consultar o voo no AirlinesHub
    const flightResponse = await axios.get("http://airlineshub:3002/flight", { params: { flight, day } });
    const flightData = flightResponse.data;

    // 2️⃣ Buscar taxa de câmbio no Exchange
    const exchangeResponse = await axios.get("http://exchange:3003/convert");
    const rate = exchangeResponse.data.rate;

    // 3️⃣ Calcular valor final em reais
    const valueInReais = (flightData.value * rate).toFixed(2);

    // 4️⃣ Registrar a venda no AirlinesHub
    const sellResponse = await axios.post("http://airlineshub:3002/sell", { flight, day });
    const transactionId = sellResponse.data.transactionId;

    // 5️⃣ Enviar bônus para o Fidelity
    const bonus = Math.round(flightData.value); // bônus é o valor em dólar arredondado
    await axios.post("http://fidelity:3004/bonus", { user, bonus });

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
    console.error("Erro durante a compra:", error.message);
    res.status(500).json({ error: "Falha ao processar a compra." });
  }
});

app.listen(3001, () => console.log("🟢 IMDTravel rodando na porta 3001"));
