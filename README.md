# IMDTravel – Projeto de Tolerância a Falhas
Projeto de tópicos especiais em egenharia de software IV (Tolerância a Falhas em Sistemas de Software) - Unidade 2

## 🧾 Resumo

- **Linguagem:** JavaScript (Node.js)  
- **Framework:** Express.js  
- **Comunicação:** REST (Axios)  
- **Containers:** Docker / Docker Compose  
- **Testes:** REST Client (VS Code)  

## 🎯 Descrição
Projeto avaliativo especificado na disciplina de TÓPICOS ESPECIAIS EM ENGENHARIA DE SOFTWARE IV. Este projeto implementa uma versão simplificada de um sistema de compra de passagens aéreas (**IMDTravel**), dividido em **microserviços** independentes que se comunicam via **REST API**.  
Cada serviço é executado em um **container Docker** separado e orquestrado por **Docker Compose**.

O sistema foi desenvolvido em **JavaScript (Node.js + Express)**.

---

## 🧩 Arquitetura do Sistema

```
├── IMDTravel/       → Serviço principal (coordena as requisições)
├── AirlinesHub/     → Serviço de voos e vendas
├── Exchange/        → Serviço de conversão de moeda
├── Fidelity/        → Serviço de pontos de fidelidade
├── docker-compose.yml
└── testes.http      → Requisições REST para testes
```

Cada serviço contém:
- `server.js` → código principal
- `package.json` → dependências
- `Dockerfile` → configuração de container

---

## ⚙️ Como Executar o Projeto

### ▶️ Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [VS Code](https://code.visualstudio.com/) com extensão **REST Client** (opcional)
- (Opcional) Node.js instalado localmente para testes fora do container
- (Opcional) Extensão REST Client para o VSCode

---

### 🐋 Executando com Docker Compose

1. Abra o **Docker Desktop** e aguarde até aparecer “Docker Desktop is running”.
2. No terminal, dentro da pasta raiz do projeto, execute:

   ```bash
   docker compose up --build
   ```

3. O Docker irá:
   - Construir os 4 serviços.
   - Executar todos automaticamente.
   - Mostrar logs no terminal, como:
     ```
     🟢 IMDTravel rodando na porta 3001
     🟢 AirlinesHub rodando na porta 3002
     🟢 Exchange rodando na porta 3003
     🟢 Fidelity rodando na porta 3004
     ```

4. Para parar o sistema:
   ```bash
   docker compose down
   ```

---

## 🌐 Endpoints e Serviços

| Serviço | Porta | Endpoint | Método | Descrição |
|----------|--------|-----------|----------|-------------|
| 🧭 IMDTravel | 3001 | `/buyTicket` | POST | Coordena todo o fluxo de compra |
| ✈️ AirlinesHub | 3002 | `/flight` | GET | Retorna informações de voo |
| ✈️ AirlinesHub | 3002 | `/sell` | POST | Registra uma venda de passagem |
| 💱 Exchange | 3003 | `/convert` | GET | Retorna taxa de câmbio aleatória (USD → BRL) |
| 🎁 Fidelity | 3004 | `/bonus` | POST | Adiciona bônus ao usuário |

---

## 🧪 Testes

O arquivo `testes.http` contém todas as requisições REST para testar o sistema diretamente pelo VS Code (com a extensão REST Client).

---

## 👥 Discentes
- **Hélio Lima Carvalho**
