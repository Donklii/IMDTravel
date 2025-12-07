export function gerarCompra(ftAtivo) {
  // voos e prefixos apenas para variar
  const prefixos = ["AZ", "BR", "IMD", "AF", "UA"];
  const prefixo = prefixos[Math.floor(Math.random() * prefixos.length)];
  const numero = Math.floor(Math.random() * 900 + 100); // 100–999
  const flight = `${prefixo}${numero}`;

  // data nos próximos 30 dias
  const hoje = new Date();
  const diasFuturos = Math.floor(Math.random() * 30);
  const data = new Date(hoje);
  data.setDate(hoje.getDate() + diasFuturos);
  const day = data.toISOString().split("T")[0];

  const user = `user-${Math.random().toString(36).substring(2, 8)}`;

  return JSON.stringify({
    flight,
    day,
    user,
    ft: ftAtivo,
  });
}
