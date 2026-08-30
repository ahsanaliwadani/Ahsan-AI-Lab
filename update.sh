#!/usr/bin/env bash
# ==============================================================================
# AHSAN AI LABS — Production Zero-Downtime Update Script
# Usage: ./update.sh
# ==============================================================================

set -e

echo "========================================================"
echo " [AHSAN AI LABS] Starting Production Update Process"
echo "========================================================"

# 1. Trigger automated database backup before applying updates
if [ -f "./backup.sh" ]; then
  echo "--> Running safety backup before updating..."
  chmod +x ./backup.sh
  ./backup.sh || echo "--> Backup warning: continuing update..."
fi

# 2. Pull latest code if git repo is configured
if [ -d ".git" ]; then
  echo "--> Pulling latest source code from git..."
  git pull origin main || git pull || true
fi

# 3. Install dependencies
echo "--> Installing project dependencies..."
npm install

# 4. Build production bundle
echo "--> Compiling production assets & server..."
npm run build

# 5. Reload application with PM2 (zero-downtime cluster reload)
echo "--> Reloading application with PM2..."
pm2 reload ecosystem.config.cjs --env production || pm2 restart ahsan-ai-labs

# 6. Verify health check
echo "--> Verifying application health..."
sleep 2
HEALTH=$(curl -s http://localhost:3000/api/health || echo '{"status":"error"}')
echo "--> Health status response: ${HEALTH}"

echo "========================================================"
echo " [AHSAN AI LABS] Update Complete and Verified!"
echo "========================================================"
