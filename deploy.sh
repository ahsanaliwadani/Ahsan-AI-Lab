#!/usr/bin/env bash
# ==============================================================================
# AHSAN AI LABS — Enterprise Production Deployment & Setup Script
# Works on Ubuntu 20.04 / 22.04 / 24.04 LTS, Debian 11/12, Oracle Cloud, AWS, VPS
# Provisions: Node.js 20 LTS, PM2, Docker, MongoDB, Nginx, UFW, and builds app
# ==============================================================================

set -euo pipefail

# Determine if sudo is needed
if [ "$EUID" -ne 0 ]; then
  SUDO="sudo"
else
  SUDO=""
fi

NODE_VERSION="20"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

echo "========================================================================"
echo "    ⚡ AHSAN AI LABS — Production Auto-Deploy & Server Setup"
echo "    INTELLIGENCE. AUTOMATION. INNOVATION."
echo "========================================================================"
echo "--> Working Directory: ${APP_DIR}"
echo "--> User: $(whoami) (Root: $([ "$EUID" -eq 0 ] && echo 'Yes' || echo 'No'))"

# 1. Update system packages and install core build tools
echo "--> [Step 1/8] Updating system packages & installing prerequisites..."
export DEBIAN_FRONTEND=noninteractive
$SUDO apt-get update -y
$SUDO apt-get install -y --no-install-recommends \
  curl \
  git \
  ufw \
  build-essential \
  nginx \
  ca-certificates \
  gnupg \
  lsb-release \
  tar \
  gzip

# 2. Install Node.js LTS (v20) if missing or outdated
echo "--> [Step 2/8] Checking Node.js runtime..."
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d'.' -f1 | tr -d 'v')" -lt 18 ]; then
  echo "--> Installing Node.js LTS v${NODE_VERSION}..."
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | $SUDO -E bash -
  $SUDO apt-get install -y nodejs
fi
echo "--> Node.js: $(node -v) | NPM: $(npm -v)"

# 3. Install PM2 Process Manager globally
echo "--> [Step 3/8] Setting up PM2 process manager..."
if ! command -v pm2 >/dev/null 2>&1; then
  $SUDO npm install -g pm2
fi

# 4. Install Docker & Docker Compose if missing (for isolated MongoDB)
echo "--> [Step 4/8] Checking Docker runtime..."
if ! command -v docker >/dev/null 2>&1; then
  echo "--> Installing Docker CE & Docker Compose plugin..."
  $SUDO install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | $SUDO gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes 2>/dev/null || true
  $SUDO chmod a+r /etc/apt/keyrings/docker.gpg 2>/dev/null || true
  
  UBUNTU_CODENAME="$(lsb_release -cs 2>/dev/null || echo 'jammy')"
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${UBUNTU_CODENAME} stable" | $SUDO tee /etc/apt/sources.list.d/docker.list > /dev/null
  $SUDO apt-get update -y || true
  $SUDO apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin || true
  
  if [ "$EUID" -ne 0 ]; then
    $SUDO usermod -aG docker "$USER" || true
  fi
fi

# 5. Start MongoDB container via Docker Compose (Optional / Fallback to local atomic state)
echo "--> [Step 5/8] Initializing MongoDB database container..."
MONGO_CONTAINER_ACTIVE=false
if command -v docker >/dev/null 2>&1; then
  if $SUDO docker compose up -d mongodb 2>/dev/null || docker compose up -d mongodb 2>/dev/null; then
    MONGO_CONTAINER_ACTIVE=true
    echo "--> MongoDB container running on 127.0.0.1:27017 (Database: AHSAN_AI_LABS)"
  else
    echo "--> Note: Docker compose skipped; local atomic database engine is active."
  fi
else
  echo "--> Docker not active. Using embedded atomic JSON database engine with instant recovery."
fi

# 6. Environment & Dependencies Setup
echo "--> [Step 6/8] Configuring environment & building application..."
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    echo "--> Initializing .env from .env.example..."
    cp .env.example .env
  else
    echo "--> Creating new .env file..."
    touch .env
  fi
fi

# Ensure MONGODB_URI is configured in .env if empty
DEFAULT_MONGO_URI='mongodb://ahsan_admin:AhsanSecureMongoPass2026!@127.0.0.1:27017/AHSAN_AI_LABS?authSource=admin'
if ! grep -q "^MONGODB_URI=" .env 2>/dev/null; then
  echo "MONGODB_URI=\"${DEFAULT_MONGO_URI}\"" >> .env
elif grep -qE '^MONGODB_URI=["'\''"]?$' .env 2>/dev/null || grep -q '^MONGODB_URI=$' .env 2>/dev/null; then
  echo "--> Setting default MongoDB connection string in .env..."
  # Replace empty MONGODB_URI line
  sed -i.bak 's|^MONGODB_URI=.*|MONGODB_URI="mongodb://ahsan_admin:AhsanSecureMongoPass2026!@127.0.0.1:27017/AHSAN_AI_LABS?authSource=admin"|g' .env
  rm -f .env.bak 2>/dev/null || true
fi

# Ensure DATABASE_NAME is present
if ! grep -q "^DATABASE_NAME=" .env 2>/dev/null; then
  echo "DATABASE_NAME=\"AHSAN_AI_LABS\"" >> .env
fi

# Ensure ADMIN_SECRET is present
if ! grep -q "^ADMIN_SECRET=" .env 2>/dev/null; then
  echo "ADMIN_SECRET=\"ahsan_ai_labs_super_secure_jwt_secret_key_2026\"" >> .env
fi

mkdir -p logs data/analytics data/inquiries public/uploads

# Install dependencies and build frontend/backend bundles
npm install
npm run build

# 7. Configure Nginx Reverse Proxy
echo "--> [Step 7/8] Configuring Nginx reverse proxy..."
if [ -f "nginx.conf" ]; then
  $SUDO cp nginx.conf /etc/nginx/sites-available/ahsan-ai-labs
  $SUDO ln -sf /etc/nginx/sites-available/ahsan-ai-labs /etc/nginx/sites-enabled/
  $SUDO rm -f /etc/nginx/sites-enabled/default
  $SUDO nginx -t
  $SUDO systemctl restart nginx || $SUDO service nginx restart
fi

# 8. Start / Reload PM2 Process
echo "--> [Step 8/8] Starting application service with PM2..."
pm2 startOrReload ecosystem.config.cjs --env production || pm2 start dist/server.cjs --name ahsan-ai-labs
pm2 save

# Setup PM2 systemd auto-start on server reboot
if [ "$EUID" -eq 0 ]; then
  env PATH="$PATH:/usr/bin" pm2 startup systemd -u root --hp /root || true
else
  env PATH="$PATH:/usr/bin" $SUDO env PATH="$PATH:/usr/bin" pm2 startup systemd -u "$USER" --hp "$HOME" || true
fi

# 9. Firewall Security Hardening (UFW)
echo "--> Configuring UFW firewall rules..."
$SUDO ufw allow 22/tcp 2>/dev/null || true
$SUDO ufw allow 80/tcp 2>/dev/null || true
$SUDO ufw allow 443/tcp 2>/dev/null || true
$SUDO ufw --force enable 2>/dev/null || true

# 10. Self-Test & Health Verification
echo "--> Performing deployment verification check..."
sleep 2
HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/health || echo "500")

echo ""
echo "========================================================================"
if [ "$HEALTH_CODE" = "200" ]; then
  echo " ✅ [SUCCESS] AHSAN AI LABS IS DEPLOYED AND LIVE!"
else
  echo " ⚠️  [NOTICE] Deployment completed. Health check status: ${HEALTH_CODE}"
fi
echo "========================================================================"
echo " 🌐 Public Entry: Port 80 (HTTP) -> Nginx -> Port 3000 (Node.js)"
echo " 📊 Live Health Check: curl http://localhost:3000/api/health"
echo " 📜 Realtime Logs: pm2 logs ahsan-ai-labs"
echo " 🔄 Restart Service: pm2 restart ahsan-ai-labs"
echo " 🛡️  To enable free SSL (HTTPS): sudo apt install -y certbot python3-certbot-nginx && sudo certbot --nginx"
echo "========================================================================"
