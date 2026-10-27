# Dockerfile Multi-propósito para Backend y Frontend
# -----------------------------------------------------------------------------
# Este Dockerfile utiliza "targets" para permitir la construcción de 
# diferentes servicios desde un solo archivo.
# -----------------------------------------------------------------------------

# --- ETAPA BASE (Compartida) ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# --- ETAPA DE DEPENDENCIAS (Compartida) ---
FROM base AS dependencies
RUN npm install

# --- ETAPA DE CONSTRUCCIÓN BACKEND ---
FROM dependencies AS build-back
COPY . .
COPY prisma ./prisma/
RUN npx prisma generate
RUN npm run build

# --- ETAPA DE CONSTRUCCIÓN FRONTEND ---
FROM dependencies AS build-front
COPY . .
RUN npm run build

# --- TARGET FINAL: BACKEND ---
FROM node:20-alpine AS backend
WORKDIR /app
COPY --from=build-back /app/node_modules ./node_modules
COPY --from=build-back /app/dist ./dist
COPY --from=build-back /app/package*.json ./
COPY --from=build-back /app/prisma ./prisma

EXPOSE 3000
CMD npx prisma migrate deploy && npm run start:prod

# --- TARGET FINAL: FRONTEND ---
FROM nginx:stable-alpine AS frontend
# Ajustar la carpeta 'dist' según el framework (build para React, .next/out para Next.js)
COPY --from=build-front /app/dist /usr/share/nginx/html

# Copiar el script de inicio y darle permisos de ejecución
COPY entrypoint-front.sh /entrypoint-front.sh
RUN chmod +x /entrypoint-front.sh

EXPOSE 80
CMD ["/entrypoint-front.sh"]
