import http from "k6/http";
import { check, sleep } from "k6";
import { gerarCompra} from "./gerarCompra.js"

const ToleranteAhFalhas = true;

// 🧪 CENÁRIO: carga aumentando aos poucos
//  - começa em 5 usuários virtuais
//  - sobe até 40 VUs
//  - depois desce para 0

const tempoStr = "10s";

export const options = {
  scenarios: {
    carga: {
      executor: "ramping-arrival-rate",
      startRate: 5,          // começa com 5 req/s
      timeUnit: "1s",
      preAllocatedVUs: 20,   // VUs pré-alocados
      maxVUs: 10000,          // limite máximo de VUs
      stages: [
        { duration: tempoStr, target: 1 },
        { duration: tempoStr, target: 10 },
        { duration: tempoStr, target: 100 },
        { duration: tempoStr, target: 250 },
        { duration: tempoStr, target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<5500"], // meta: 95% das reqs < 5.5s
    http_req_failed: ["rate<0.05"],    // meta: < 5% de falhas
  },
};

export default function () {
  const url = "http://localhost:3001/buyTicket";
  const payload = gerarCompra(ToleranteAhFalhas);

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status é 200": (r) => r.status === 200,
  });

  sleep(1);
}
