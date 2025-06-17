# Etapa de compilación
FROM node:20.11.1-alpine3.19 AS builder

WORKDIR /app

# Instalar dependencias del sistema necesarias para Prisma (por ejemplo: openssl)
RUN apk add --no-cache libc6-compat openssl

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm i

# Copiar el resto del código
COPY . .

# Generar cliente de Prisma y compilar TypeScript
RUN npx prisma generate
RUN npm run build

# Etapa de ejecución
FROM node:20.11.1-alpine3.19

WORKDIR /app

# Instalar dependencias del sistema necesarias en producción
RUN apk add --no-cache libc6-compat openssl

# Copiar solo lo necesario desde la etapa de compilación
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Establecer variables de entorno si es necesario
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

