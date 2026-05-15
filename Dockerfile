# Etapa 1: Build con Node.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# URL vacia = React usa rutas relativas, Nginx proxea /api/ al backend
ARG VITE_API_GATEWAY_URL=
ENV VITE_API_GATEWAY_URL=$VITE_API_GATEWAY_URL
RUN npm run build

# Etapa 2: Nginx sirve el frontend y proxea /api/ al backend
FROM nginx:alpine
RUN apk add --no-cache gettext
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
# BACKEND_HOST se inyecta via docker-compose en la EC2 de frontend
ENV BACKEND_HOST=localhost
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
