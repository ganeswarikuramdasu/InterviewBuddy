# ============================================================
# InterviewBuddy Frontend — production Docker image
# Multi-stage build:
#   stage 1: build the React/Vite SPA (Node 22)
#   stage 2: serve the static build with nginx,
#            which also reverse-proxies /api -> backend service
# ============================================================

# ---- Stage 1: build ----
FROM node:22-alpine AS build
WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Stage 2: serve ----
FROM nginx:1.27-alpine

# Reverse-proxy + SPA config (see nginx.conf).
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://localhost/ || exit 1
