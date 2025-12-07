import http from "k6/http";
import { check, sleep } from "k6";
import { gerarCompra } from "./gerarCompra.js";

const ToleranteAhFalhas = true;

export const options = {
  scenarios: {
    pico: {
      executor: "ramping-arrival-rate",
      startRate: 20,         
      timeUnit: "1s",
      preAllocatedVUs: 50,   // VUs reservados
      maxVUs: 5000,
      stages: [
        { duration: "10s", target: 20 },

        { duration: "5s", target: 250 },

        { duration: "15s", target: 5 },

        { duration: "5s", target: 250 },

        { duration: "10s", target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<5500"],
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
