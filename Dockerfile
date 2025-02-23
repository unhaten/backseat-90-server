FROM node:20-alpine AS base

WORKDIR /usr/src/app/server

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps

COPY . .

EXPOSE 2000

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]
