#!/usr/bin/env bash
# ============================================================
# InterviewBuddy — EC2 user-data bootstrap (Amazon Linux 2023)
# Runs ONCE on first boot:
#   - installs Docker + Compose
#   - fetches app source (Git clone OR S3 bundle)
#   - writes .env and starts the full docker-compose stack
#
# This script runs as PLAIN bash (no Terraform templating): terraform/main.tf
# prepends env.tftpl (which exports the external config) to this file and
# passes it to AWS as-is, so every ${VAR:-default} below is normal bash.
#
# External inputs can also be provided as environment variables, e.g.:
#   GIT_REPO=... DB_PASSWORD=... ./user-data.sh
# ============================================================
set -euo pipefail

# ---- External config (Terraform injects these; defaults are bash-safe) ----
GIT_REPO="${GIT_REPO:-}"
GIT_BRANCH="${GIT_BRANCH:-main}"
GIT_TOKEN="${GIT_TOKEN:-}"
S3_BUNDLE_URL="${S3_BUNDLE_URL:-}"
# Supabase (hosted PostgreSQL) connection
DB_HOST="${DB_HOST:-}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-postgres}"
DB_USERNAME="${DB_USERNAME:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-change-me-now}"
DB_SSLMODE="${DB_SSLMODE:-require}"
JWT_SECRET="${JWT_SECRET:-}"
GEMINI_API_KEY="${GEMINI_API_KEY:-}"
CODE_EXECUTION_SERVICE_URL="${CODE_EXECUTION_SERVICE_URL:-}"
FRONTEND_PORT="${FRONTEND_PORT:-80}"
# Email verification via Brevo (optional: leave BREVO_API_KEY empty to disable)
MAIL_ENABLED="${MAIL_ENABLED:-false}"
BREVO_API_KEY="${BREVO_API_KEY:-}"
BREVO_BASE_URL="${BREVO_BASE_URL:-https://api.brevo.com/v3}"
MAIL_FROM="${MAIL_FROM:-noreply@interviewbuddy.com}"
MAIL_FROM_NAME="${MAIL_FROM_NAME:-InterviewBuddy}"
APP_FRONTEND_URL="${APP_FRONTEND_URL:-}"

log() { echo "[deploy] $*"; }

# ------------------------------------------------------------------
log "Installing Docker engine (Amazon Linux 2023)..."
dnf install -y docker
systemctl enable --now docker
usermod -aG docker ec2-user || true

# Compose v2 plugin (AL2023 ships it; fallback to a standalone binary).
if ! docker compose version >/dev/null 2>&1; then
  log "Installing docker-compose plugin..."
  ARCH=$(uname -m)
  mkdir -p /usr/local/lib/docker/cli-plugins
  curl -sSL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-${ARCH}" \
    -o /usr/local/lib/docker/cli-plugins/docker-compose
  chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
fi
docker compose version

# Generate a JWT secret if none was provided.
if [ -z "${JWT_SECRET}" ]; then
  JWT_SECRET="$(head -c 48 /dev/urandom | base64)"
fi

# ------------------------------------------------------------------
if [ -n "${GIT_REPO}" ]; then
  log "Cloning ${GIT_REPO} (branch ${GIT_BRANCH}) ..."
  APP_DIR="/opt/interviewbuddy"
  if [ -n "$(ls -A "${APP_DIR}" 2>/dev/null)" ]; then
    git -C "${APP_DIR}" pull --ff-only || true
  else
    url="${GIT_REPO}"
    if [ -n "${GIT_TOKEN}" ]; then
      url="${url#https://}"
      url="https://${GIT_TOKEN}@${url}"
    fi
    git clone --depth 1 --branch "${GIT_BRANCH}" "${url}" "${APP_DIR}" || {
      log "git clone failed. If the repo is private, set GIT_TOKEN."
      exit 1
    }
  fi
  APP_DIR="${APP_DIR}/interviewbuddy"
elif [ -n "${S3_BUNDLE_URL}" ]; then
  log "Pulling source from ${S3_BUNDLE_URL} ..."
  mkdir -p /opt/src
  aws s3 cp "${S3_BUNDLE_URL}" /opt/src/bundle.tar.gz
  tar -xzf /opt/src/bundle.tar.gz -C /opt/src
  APP_DIR="$(find /opt/src -maxdepth 2 -name docker-compose.yml -printf '%h\n' | head -1)"
else
  log "ERROR: neither GIT_REPO nor S3_BUNDLE_URL is set."
  exit 1
fi

cd "${APP_DIR}"
log "Compose file at: ${APP_DIR}/docker-compose.yml"

# Public SPA URL used to build email verification links.
if [ -z "${APP_FRONTEND_URL}" ]; then
  APP_FRONTEND_URL="http://localhost:${FRONTEND_PORT}"
fi

# ------------------------------------------------------------------
log "Writing .env ..."
cat > .env <<EOF
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_NAME=${DB_NAME}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_SSLMODE=${DB_SSLMODE}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=http://localhost:${FRONTEND_PORT}
GEMINI_API_KEY=${GEMINI_API_KEY}
GEMINI_MODEL=gemini-3.6-flash
CODE_EXECUTION_SERVICE_URL=${CODE_EXECUTION_SERVICE_URL}
SEED_DEMO_USERS=false
MAIL_ENABLED=${MAIL_ENABLED}
BREVO_API_KEY=${BREVO_API_KEY}
BREVO_BASE_URL=${BREVO_BASE_URL}
MAIL_FROM=${MAIL_FROM}
MAIL_FROM_NAME=${MAIL_FROM_NAME}
APP_FRONTEND_URL=${APP_FRONTEND_URL}
FRONTEND_PORT=${FRONTEND_PORT}
EOF

# ------------------------------------------------------------------
log "Building and starting the stack..."
docker compose up -d --build

log "Done. The app listens on port ${FRONTEND_PORT} on this instance."
