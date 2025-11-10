# Contrato da API: Finance Hub (Sprint 1)

Este documento define os *endpoints* (rotas) que o time de Backend (Node.js) deve construir e que o time de Frontend (React Native) deve consumir.

**Autenticação:** Todas as rotas, exceto `/auth/register` e `/auth/login`, são **protegidas**. Elas devem receber um *token* (JWT) no cabeçalho `Authorization` (ex: `Authorization: Bearer <seu_token>`).

---

## 1. Autenticação (História #1)

### `POST /auth/register`

* **O que faz:** Cadastra um novo usuário.
* **Request Body (JSON):**
    ```json
    {
      "nome": "Nome do Usuário",
      "email": "usuario@email.com",
      "senha": "senhaforte123"
    }
    ```
* **Response (201 Created):** Retorna o usuário criado (sem a senha).
    ```json
    {
      "id": 1,
      "nome": "Nome do Usuário",
      "email": "usuario@email.com"
    }
    ```
* **Response (400 Bad Request):** Caso o email já exista.
    ```json
    { "erro": "Este email já está em uso." }
    ```

### `POST /auth/login`

* **O que faz:** Autentica um usuário e retorna um token de acesso.
* **Request Body (JSON):**
    ```json
    {
      "email": "usuario@email.com",
      "senha": "senhaforte123"
    }
    ```
* **Response (200 OK):** Retorna o token que o app (React Native) deve salvar.
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
* **Response (401 Unauthorized):**
    ```json
    { "erro": "Email ou senha inválidos." }
    ```

---

## 2. Transações (Histórias #2, #3, #5)

### `POST /transactions` (Rota Protegida 🔒)

* **O que faz:** Registra um novo gasto (História #2) ou receita (História #3).
* **Request Body (JSON):**
    ```json
    {
      "titulo": "Almoço no RU",
      "valor": 5.50,
      "tipo": "gasto", // "gasto" ou "receita"
      "categoria": "Alimentação",
      "data": "2025-11-10T12:30:00Z" // Data no formato ISO 8601
    }
    ```
* **Response (201 Created):** Retorna a transação que acabou de ser criada.
    ```json
    {
      "id": 1,
      "usuario_id": 1,
      "titulo": "Almoço no RU",
      "valor": 5.50,
      "tipo": "gasto",
      "categoria": "Alimentação",
      "data": "2025-11-10T12:30:00Z"
    }
    ```

### `GET /transactions` (Rota Protegida 🔒)

* **O que faz:** Lista todas as transações do usuário logado (História #5).
* **Request Body:** N/A
* **Response (200 OK):** Retorna uma lista (array) de transações, ordenadas da mais nova para a mais antiga.
    ```json
    [
      { 
        "id": 2, 
        "titulo": "Salário", 
        "valor": 5000.00, 
        "tipo": "receita", 
        "categoria": "Salário",
        "data": "2025-11-05T09:00:00Z"
      },
      { 
        "id": 1, 
        "titulo": "Almoço no RU", 
        "valor": 5.50, 
        "tipo": "gasto", 
        "categoria": "Alimentação",
        "data": "2025-11-10T12:30:00Z"
      }
    ]
    ```

---

## 3. Dashboard (História #4)

### `GET /dashboard/summary` (Rota Protegida 🔒)

* **O que faz:** Retorna o saldo total (Receitas - Gastos) (História #4).
* **Request Body:** N/A
* **Response (200 OK):**
    ```json
    {
      "saldo_total": 4994.50,
      "total_receitas": 5000.00,
      "total_gastos": 5.50
    }
    ```