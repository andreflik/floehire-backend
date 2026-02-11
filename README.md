# FloeHire Backend

API backend do sistema **FloeHire** para gestão de vagas, candidatos,
recrutadores e pipeline de contratação.

------------------------------------------------------------------------

## 🚀 Tecnologias

-   Node.js + TypeScript\
-   Express\
-   Prisma ORM\
-   PostgreSQL\
-   JWT (Access + Refresh Token)\
-   Nodemailer (SMTP Gmail)\
-   Swagger (OpenAPI)\
-   Jest (testes)\
-   Docker / Docker Compose

------------------------------------------------------------------------

## 📦 Pré-requisitos

-   Docker e Docker Compose **ou**
-   Node.js 18+
-   PostgreSQL

------------------------------------------------------------------------

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto:

``` env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/floehire"

JWT_SECRET=super-secret-key

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=floehire16@gmail.com
MAIL_PASS=SEU_APP_PASSWORD_DO_GMAIL
MAIL_FROM=floehire16@gmail.com

FRONTEND_URL=http://localhost:5173
```

> ⚠️ Para Gmail, use **App Password** (não a senha normal da conta).

------------------------------------------------------------------------

## 🐳 Rodando com Docker

``` bash
docker compose up -d --build
```

Depois execute as migrations + seed:

``` bash
npm run db:setup
```

A API ficará disponível em:

    http://localhost:3333

------------------------------------------------------------------------

## ▶️ Rodando localmente (sem Docker)

``` bash
npm install
npm run db:setup
npm run dev
```

------------------------------------------------------------------------

## 🗄️ Prisma & Banco de Dados

### Comandos úteis

Gerar client:

``` bash
npm run db:generate
```

Rodar migrations:

``` bash
npm run db:migrate
```

Rodar seed:

``` bash
npm run db:seed
```

Resetar o banco (⚠️ apaga tudo):

``` bash
npm run db:reset
```

Setup completo (generate + migrate + seed):

``` bash
npm run db:setup
```

------------------------------------------------------------------------

## 🌱 Dados de Seed (contas de demo)

Após rodar o seed, você terá:

**Recruiter** - Email: `recruiter@floehire.com` - Senha: `123456`

**Candidates** - Email: `alice@floehire.com` --- Senha: `123456`\
- Email: `bob@floehire.com` --- Senha: `123456`

Também serão criados: - Vagas de exemplo - Stages de pipeline (Applied,
Interview, Hired) - Candidaturas com histórico

------------------------------------------------------------------------

## 📚 Documentação (Swagger)

Após subir o backend, acesse:

    http://localhost:3333/docs

Lá você pode: - Ver todas as rotas - Testar endpoints - Autenticar via
JWT (botão **Authorize**)

------------------------------------------------------------------------

## 🔐 Autenticação

-   **Access Token**: JWT curto (ex: 15 minutos)
-   **Refresh Token**: salvo no banco (ex: 7 dias)

### Perfis:

-   `candidate`
-   `recruiter`

Os tokens devem ser enviados no header:

    Authorization: Bearer SEU_TOKEN

------------------------------------------------------------------------

## ✉️ Reset de senha

Fluxo:

1.  `POST /candidates/forgot-password` com `{ email }`
2.  Usuário recebe e-mail com link
3.  Frontend abre tela `/resetar-senha/:token`
4.  Envia nova senha para `POST /candidates/reset-password`

------------------------------------------------------------------------

## 🧪 Testes

Rodar todos os testes:

``` bash
npm test
```

Cobertura atual inclui: - CandidateService\
- RecruiterService\
- JobService\
- ApplicationService

------------------------------------------------------------------------

## 📂 Estrutura do projeto

    src/
     ├─ application/
     │   ├─ services/
     │   ├─ validators/
     │   └─ dtos/
     ├─ domain/
     │   └─ repositories/
     ├─ infra/
     │   ├─ mail/
     │   ├─ security/
     │   └─ docs/
     ├─ interfaces/
     │   └─ https/
     │       ├─ controllers/
     │       ├─ routes/
     │       └─ middlewares/
     ├─ prisma/
     └─ server.ts

------------------------------------------------------------------------

## ✅ Funcionalidades principais

-   Cadastro e login de candidatos\
-   Cadastro e login de recrutadores\
-   CRUD de vagas\
-   Listagem pública de vagas\
-   Aplicação em vagas\
-   Pipeline de candidatos por vaga\
-   Avaliação de candidatos\
-   Histórico de movimentações\
-   Refresh token (candidate e recruiter)\
-   Reset de senha por e-mail

------------------------------------------------------------------------

## 🛣️ Próximos passos (roadmap)

-   Login social (Google / LinkedIn)\
-   Perfis públicos de candidatos\
-   Upload de currículo\
-   Notificações por e-mail\
-   Permissões mais granulares

------------------------------------------------------------------------

## 🧑‍💻 Desenvolvimento

Projeto desenvolvido com foco em:

-   Clean Architecture\
-   Services isolados\
-   Validações com Zod\
-   Testes automatizados\
-   Padronização de erros

------------------------------------------------------------------------

## 📄 Licença

Projeto privado --- uso interno do FloeHire.
