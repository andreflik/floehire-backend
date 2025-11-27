🚀 FloeHire Backend — Guia de Instalação

Este guia explica, passo a passo, como rodar o backend do FloeHire com:

✅ Node.js + TypeScript
✅ Express
✅ Prisma ORM
✅ PostgreSQL via Docker
✅ Ambiente local + Docker

📦 Requisitos

Você precisa ter instalado na sua máquina:

✅ Node.js v18 ou superior
https://nodejs.org

✅ Docker e Docker Compose
https://www.docker.com

✅ Git

✅ VSCode (recomendado)

Verifique:

node -v
docker -v
docker-compose -v

📁 Estrutura do Backend
floehire-backend/
│
├── src/
│ ├── server.ts
│ ├── prisma.ts
│ ├── routes/
│ ├── services/
│ └── controllers/
│
├── prisma/
│ ├── schema.prisma
│ └── migrations/
│
├── dockerfile
├── docker-compose.yml
├── tsconfig.json
├── package.json
└── .env

🧠 Arquivo .env

Crie um arquivo .env na raiz:

DATABASE_URL=postgresql://postgres:postgres@database:5432/floehire

🐘 Banco de Dados com Docker
1️⃣ Subindo o banco Postgres

Use este docker-compose.yml:

services:
backend:
container_name: floehire-backend
build:
context: .
dockerfile: dockerfile
ports: - "3333:3333"
environment: - DATABASE_URL=postgresql://postgres:postgres@database:5432/floehire
depends_on: - database
restart: always

database:
container_name: floehire-db
image: postgres:15
ports: - "5432:5432"
environment:
POSTGRES_DB: floehire
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
volumes: - postgres_data:/var/lib/postgresql/data

volumes:
postgres_data:

Suba tudo com:

docker-compose up -d --build

🐳 Dockerfile do Backend

Seu dockerfile:

FROM node:20-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package\*.json ./
COPY prisma ./prisma

RUN npm install
COPY . .

ENV DATABASE_URL=postgresql://postgres:postgres@database:5432/floehire

RUN npx prisma generate

EXPOSE 3333

CMD ["npm", "run", "dev"]

📦 Instalando dependências (fora do Docker)

Isso é ESSENCIAL para evitar erros no VSCode:

No Windows (fora do container):

npm install

Se der erro de types:

npm install --save-dev @types/node @types/express @types/cors @types/bcrypt

⚙️ Prisma

Se precisar gerar novamente:

docker exec -it floehire-backend npx prisma generate

Verificar migrations:

docker exec -it floehire-backend npx prisma migrate dev

Abrir prisma studio:

docker exec -it floehire-backend npx prisma studio

Acesse:
👉 http://localhost:5555

🔥 Testar se o Backend está online

Abra no navegador:

http://localhost:3333/health

Resposta esperada:

{
"status": "ok",
"time": "2025-11-27T21:49:37.494Z"
}

🔧 Erros comuns e soluções
❌ TypeScript reclamando de express/cors/bcrypt

Você resolveu assim:
👉 Instalando dependências fora do container também:

npm install

❌ Prisma erro: \_\_internal

Você resolveu com:
✅ Usar image node:20-bullseye
✅ Instalar openssl
✅ Garantir que @prisma/client e prisma estão na mesma versão

"@prisma/client": "7.0.1",
"prisma": "7.0.1"

❌ VSCode não reconhece @types/node

Você resolveu:
👉 Instalando Node e dependências na pasta do projeto local.
