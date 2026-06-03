# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_APP_ENV=production
ARG VITE_API_BASE
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_API_BASE=$VITE_API_BASE
RUN npm run build

# ── Stage 2: serve ────────────────────────────────────────────────────────────
FROM nginx:alpine
COPY --from=builder /app/dist    /usr/share/nginx/html
COPY nginx.conf                  /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
