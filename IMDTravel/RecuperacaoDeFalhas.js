import axios from "axios";

let ultimasTaxas = [];

export async function buscarTaxa(tolerante) {
  if (!tolerante) {
    const response = await axios.get("http://exchange:3003/convert");
    const taxa = parseFloat(response.data.rate);
    console.log(`💱 Taxa obtida: ${taxa.toFixed(2)}`);
    return taxa;
  }

  try {
    const response = await axios.get("http://exchange:3003/convert", { timeout: 3000 });
    const taxa = parseFloat(response.data.rate);

    
    ultimasTaxas.push(taxa);        // adiciona ao histórico
    if (ultimasTaxas.length > 10) {
      ultimasTaxas.shift();
    }

    console.log(`💱 Taxa obtida: ${taxa.toFixed(2)}`);
    return taxa;

  } catch (error) {
    console.warn("Obtendo conversão por fallback:", error.message);
    
    if (ultimasTaxas.length > 0) {
      const soma = ultimasTaxas.reduce((a, b) => a + b, 0);
      const media = soma / ultimasTaxas.length;
      console.log(`📉 Usando média das últimas taxas: ${media.toFixed(2)}`);
      return media;
    } else {
      console.log("⚙️ Nenhuma taxa anterior disponível, usando valor padrão (5.5)");
      return 5.5;
    }
  }

}


export async function buscarVoo(flight, day, tolerante) {
  const maxTentativas = tolerante? 4 : 1;
  const tempoParaTimeout = tolerante? 1000 : 0; // 1 segundo(s)

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      console.log(`✈️ Tentando buscar voo ${flight} (${tentativa}ª tentativa)...`);

      const response = await axios.get("http://airlineshub:3002/flight", {
        params: { flight, day },
        timeout: tempoParaTimeout
      });

      console.log(`✅ Voo encontrado: ${response.data.flight} - ${response.data.day}`);
      return response.data; // sucesso

    } catch (error) {

      if (tentativa < maxTentativas) {
        console.log("🔁 Tentando novamente...");
      } else {
        throw new Error(`Falha ao obter informações do voo ${flight} após ${maxTentativas} tentativas.`);
      }
    }
  }
}



export async function venderPassagem(flight, day, tolerante) {
  // 🟢 Modo NÃO tolerante
  if (!tolerante) {
    const response = await axios.post("http://airlineshub:3002/sell", { flight, day });
    return response.data;
  }

  // 🟡 Modo tolerante
  try {
    const inicio = Date.now();

    const response = await axios.post(
      "http://airlineshub:3002/sell",
      { flight, day },
      { timeout: 2000 } // 2 segundos de limite
    );

    const duracao = (Date.now() - inicio) / 1000;

    if (duracao > 2) {
      throw new Error(`Latência acima do limite permitido (${duracao.toFixed(2)}s/2s).`);
    }

    console.log("✅ Venda registrada com sucesso!");
    return response.data;

  } catch (error) {
    const JOGARERRO = false;
    
    if (JOGARERRO) throw error; // propaga o erro para o nível superior

    if (error.code === "ECONNABORTED") {
        console.error("⏱️ Timeout ao tentar registrar a venda (2s).");
      } else {
        console.error(`❌ Erro no /sell: ${error.message}`);
      }

    return 0;
  }
}


let listaParaBonificacoes = [];

export async function bonificar(user, bonus, tolerante) {

  if (!tolerante) {
    await axios.post("http://fidelity:3004/bonus", { user, bonus});
    return;
  }

  try {
    await axios.post("http://fidelity:3004/bonus", { user, bonus}, { timeout: 3000 });
    
  } catch (error) {
    console.warn(`⚠️ Ainda não foi possível bonificar ${user}: ${error.message}`);

    const bonusId = `${user}-${listaParaBonificacoes.length}-${Date.now()}`;

    listaParaBonificacoes.push({ id: bonusId, user, bonus });
  }
}

// ------------------------------
// Loop de recuperação automática
// ------------------------------
setInterval(async () => {
  if (listaParaBonificacoes.length === 0) return;

  const listaAtual = [...listaParaBonificacoes];

  await Promise.all(listaAtual.map(async (item) => {
    const { id, user, bonus } = item;

    try {
      await axios.post("http://fidelity:3004/bonus", { user, bonus }, { timeout: 3000 });

      console.log(`🔁 [${id}] Bônus de ${bonus} reenviado com sucesso para ${user}`);

      listaParaBonificacoes = listaParaBonificacoes.filter((b) => b.id !== id);

    } catch (error) {
    }
  }));
}, 5000);

