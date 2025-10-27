# 💳 API — Sistema de Pagamentos  
**Desafio Backend — Colmeia**

---

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3C873A?style=for-the-badge&logo=zod&logoColor=white)

---

## 🚀 Descrição do Projeto

API RESTful desenvolvida com **NestJS**, **TypeScript** e **Prisma ORM** para gerenciar **clientes** e **cobranças**, com suporte a múltiplos métodos de pagamento (**PIX**, **Cartão de Crédito** e **Boleto Bancário**).  
O sistema implementa controle de **idempotência**, **validação de dados com Zod** e **tratamento de erros estruturado**.

---

## 🧠 Como Rodar o Projeto

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/joaoMicheletti/colmeiaDesafioBackEnd.git
cd colmeiaDesafioBackEnd
cd backend
```

### 2️⃣ Instalar dependências
```bash
npm install
```

### 3️⃣ Gerar o banco e aplicar migrations
```bash
npx prisma migrate dev --name init
```

### 4️⃣ Rodar o servidor
```bash
npm run start:dev
```

### 5️⃣ Acessar o banco visualmente (opcional)
```bash
npx prisma studio
```

✅ Após iniciar o servidor, a API estará disponível em:
```
http://localhost:3000
```

---

## 🧩 Tecnologias Utilizadas

- 🧱 [NestJS](https://nestjs.com/) — Framework Node.js modular e escalável  
- 🧠 [TypeScript](https://www.typescriptlang.org/) — Tipagem estática  
- 🧰 [Prisma ORM](https://www.prisma.io/) — ORM para banco de dados relacional  
- 💾 [SQLite](https://www.sqlite.org/) — Banco de dados leve e relacional  
- 🔎 [Zod](https://zod.dev/) — Validação de dados e tipagem inferida  
- ⚙️ [Class Validator / Http Exceptions](https://docs.nestjs.com/exception-filters) — Tratamento de erros e padronização de respostas HTTP  

---

## 🧱 Modelagem do Banco de Dados

### Entidade `Customer`
| Campo | Tipo | Descrição |
|--------|------|------------|
| id | UUID | Identificador único |
| name | String | Nome do cliente |
| email | String | E-mail único |
| document | String | Documento (CPF/CNPJ) único |
| phone | String | Telefone de contato |
| createdAt | DateTime | Data de criação |
| updatedAt | DateTime | Atualizado automaticamente |

---

### Entidade `Charge`
| Campo | Tipo | Descrição |
|--------|------|------------|
| id | UUID | Identificador único |
| amount | Float | Valor da cobrança |
| currency | String | Moeda (BRL por padrão) |
| paymentMethod | Enum | PIX / CREDIT_CARD / BOLETO |
| status | Enum | PENDING / PAID / FAILED / EXPIRED |
| customerId | UUID | Relacionamento com Customer |
| idempotencyKey | String | Controle de duplicidade (único) |
| dueDate | DateTime? | Data de vencimento (para boleto) |
| installments | Int? | Parcelas (para cartão) |
| createdAt | DateTime | Data de criação |
| updatedAt | DateTime | Atualização automática |

---

## 🔄 Relacionamentos
- Um **Customer** pode ter várias **Charges** (1:N)  
- Cada **Charge** pertence a um único **Customer**

---

## 🔗 Enums Utilizados

```prisma
enum PaymentMethod {
  PIX
  CREDIT_CARD
  BOLETO
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  EXPIRED
}
```

---

## 🧰 Endpoints Principais

### 👤 **Clientes**

#### `POST /customers`
Cria um novo cliente.

**Body:**
```json
{
  "name": "João MAtheus",
  "email": "joao@matheus.com",
  "document": "12345678901",
  "phone": "11999999999"
}
```

**Resposta:**
```json
{
	"statusCode": 201,
	"message": "Cliente cadastrado com sucesso.",
	"customer": {
		"id": "048add74-b19c-4646-955d-4fe1d88df605",
		"name": "João MAtheus",
		"email": "joao@matheus.com",
		"document": "12345678901",
		"phone": "11999999999",
		"createdAt": "2025-10-27T04:56:31.394Z",
		"updatedAt": "2025-10-27T04:56:31.394Z"
	}
}
```

---

### 💰 **Cobranças**

#### `POST /charges`
Cria uma nova cobrança vinculada a um cliente existente.

**Body:**
```json
{
  "amount": 1500.25,
  "paymentMethod": "BOLETO",
  "customerId": "048add74-b19c-4646-955d-4fe1d88df605",
  "idempotencyKey": "teste-0",
  "dueDate": "2025-10-30T00:00:00Z"
}
```

**Resposta:**
```json
{
	"statusCode": 201,
	"message": "Cobrança criada com sucesso.",
	"charge": {
		"id": "2be1b5b8-f3e3-4a7c-9519-7a3d145fc2e6",
		"amount": 1500.25,
		"currency": "BRL",
		"paymentMethod": "BOLETO",
		"status": "PENDING",
		"customerId": "048add74-b19c-4646-955d-4fe1d88df605",
		"dueDate": "2025-10-30T00:00:00.000Z",
		"installments": null,
		"idempotencyKey": "teste-0",
		"createdAt": "2025-10-27T04:57:28.111Z",
		"updatedAt": "2025-10-27T04:57:28.111Z"
	}
}
```

---

#### `PUT /charges`
Atualiza o status de uma cobrança existente.

**Body:**
```json
{
  "chargeId": "7d71862a-5019-4392-8ac1-436943cbd97c",
  "status": "PAID"
}
```

**Resposta:**
```json
{
	"statusCode": 200,
	"message": "Status do pagamento BOLETO atualizado com sucesso.",
	"charge": {
		"id": "2be1b5b8-f3e3-4a7c-9519-7a3d145fc2e6",
		"amount": 1500.25,
		"currency": "BRL",
		"paymentMethod": "BOLETO",
		"status": "PAID",
		"customerId": "048add74-b19c-4646-955d-4fe1d88df605",
		"dueDate": "2025-10-30T00:00:00.000Z",
		"installments": null,
		"idempotencyKey": "teste-0",
		"createdAt": "2025-10-27T04:57:28.111Z",
		"updatedAt": "2025-10-27T04:59:42.358Z"
	}
}
```

---

## ⚙️ Validações Implementadas (Zod)

- `amount`: número positivo  
- `paymentMethod`: `"PIX" | "CREDIT_CARD" | "BOLETO"`  
- `customerId`: UUID válido  
- `idempotencyKey`: string obrigatória e única  
- `document` e `email`: únicos por cliente  

---

## 🧩 Controle de Idempotência

Cada requisição `POST /charges` deve conter um campo único `idempotencyKey`.  
Se o mesmo valor for reenviado, a API retorna:

```json
{
  "statusCode": 409,
  "message": "Duplicidade detectada: essa cobrança já foi registrada."
}
```

---

## ⚠️ Tratamento de Erros

| Código | Descrição | Exemplo |
|--------|------------|----------|
| `400 Bad Request` | Erro de validação Zod | Campos inválidos |
| `404 Not Found` | Registro não encontrado | Cliente inexistente |
| `409 Conflict` | Conflito de dados | Email/documento duplicado, idempotência |
| `500 Internal Server Error` | Erro inesperado | Falha no servidor |

---

## ✅ Requisitos do Desafio — Checklist

| Requisito | Status |
|------------|--------|
| Cadastro de clientes (Customer) | ✅ Concluído |
| Criação de cobranças (Charge) | ✅ Concluído |
| Relacionamento entre entidades | ✅ Implementado |
| Suporte a Pix, Cartão e Boleto | ✅ Implementado |
| Persistência em banco relacional | ✅ SQLite + Prisma |
| Tratamento de erros e validações | ✅ Zod + Exception Filters |
| Controle de idempotência | ✅ Implementado |
| Organização de módulos e camadas | ✅ Estrutura NestJS |
| Documentação clara e executável | ✅ Incluída neste README |

---

## ✨ Autor

Desenvolvido por **João Micheletti** — Desafio Técnico Backend 🚀  
[GitHub](https://github.com/joaoMicheletti)

---
