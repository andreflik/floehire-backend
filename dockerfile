FROM node:20-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

ENV DATABASE_URL=postgresql://postgres:postgres@database:5432/floehire

RUN npx prisma generate

EXPOSE 3333

CMD ["npm", "run", "dev"]
