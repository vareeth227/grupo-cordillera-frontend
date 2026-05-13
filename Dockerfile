# Etapa 1: Build con Node.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Variables de entorno de build se pasan como build-args
ARG VITE_API_GATEWAY_URL=http://localhost:9090
ENV VITE_API_GATEWAY_URL=$VITE_API_GATEWAY_URL
RUN npm run build

# Etapa 2: Servir archivos estáticos con Nginx
FROM nginx:alpine
# Copiar los archivos compilados al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Configuración de Nginx para SPA (redirige 404 al index.html)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
