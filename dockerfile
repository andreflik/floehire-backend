FROM node:20-bullseye

WORKDIR /app

# Dependências necessárias
RUN apt-get update && apt-get install -y openssl

# Copia apenas package.json e package-lock.json para instalar dependências
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Garante instalar exatamente Prisma 5.19.1
RUN npm install --legacy-peer-deps

# Copia o restante do código
COPY . .

# Usa variável correta do Prisma 5
ENV DATABASE_URL=postgresql://postgres:postgres@database:5432/floehire

# Gera o client
RUN npx prisma generate

EXPOSE 3333

CMD ["npm", "run", "dev"]
