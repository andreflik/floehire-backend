# FloeHire Backend

API backend do sistema **FloeHire** para gestão de vagas, candidatos, recrutadores e pipeline de contratação.

---

## 🚀 Tecnologias

- Node.js + TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT (Access + Refresh Token)
- Nodemailer (SMTP Gmail)
- Swagger (OpenAPI)
- Jest (testes)
- Docker / Docker Compose

---

## 📦 Pré-requisitos

- Docker e Docker Compose **ou**
- Node.js 18+
- PostgreSQL

---

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/floehire"

JWT_SECRET=super-secret-key

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=floehire16@gmail.com
MAIL_PASS=SEU_APP_PASSWORD_DO_GMAIL
MAIL_FROM=floehire16@gmail.com

FRONTEND_URL=http://localhost:5173
```
