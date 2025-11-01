import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10, // número de usuários virtuais
  duration: '10s', // tempo total do teste
};

function gerarData() {
  const hoje = new Date();
  const diasFuturos = Math.floor(Math.random() * 30);
  const data = new Date(hoje);
  data.setDate(hoje.getDate() + diasFuturos);
  return data.toISOString().split('T')[0]; // formato YYYY-MM-DD
}

function gerarVoo() {
  const prefixos = ['AZ', 'BR', 'IMD', 'AF', 'UA', 'LH', 'JJ', 'AA'];
  const prefixo = prefixos[Math.floor(Math.random() * prefixos.length)];
  const numero = Math.floor(Math.random() * 900 + 100);
  return `${prefixo}${numero}`;
}

function gerarUserId() {
  const random = Math.random().toString(36).substring(2, 8);
  return `user-${random}`;
}

function gerarToleranciaAhFalhas() {
  return Math.random() >= 0.5? true : false
}
export default function () {
  const url = 'http://localhost:3001/buyTicket';
  const payload = JSON.stringify({
    flight: gerarVoo(),
    day: gerarData(),
    user: gerarUserId(),
    ft: gerarToleranciaAhFalhas(),
  });

  const params = { headers: { 'Content-Type': 'application/json' } };

  const res = http.post(url, payload, params);

  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(1);
}
