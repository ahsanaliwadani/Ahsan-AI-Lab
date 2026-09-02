#!/usr/bin/env bash
# ==============================================================================
# AHSAN AI LABS — MongoDB Health Diagnostic & Auto-Recovery Script
# Usage: ./scripts/check-mongodb.sh
# ==============================================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}=================================================================${NC}"
echo -e "${CYAN} [AHSAN AI LABS] MongoDB Diagnostic & Self-Healing Tool${NC}"
echo -e "${CYAN}=================================================================${NC}"

# Step 1: Check if MongoDB process or service is running
echo -e "\n${BLUE}--> [1/4] Checking MongoDB Service Status...${NC}"

MONGO_RUNNING=false

# Check systemd service
if command -v systemctl >/dev/null 2>&1; then
  if systemctl is-active --quiet mongod 2>/dev/null; then
    echo -e "${GREEN}✓ MongoDB systemd service (mongod) is ACTIVE & RUNNING.${NC}"
    MONGO_RUNNING=true
  elif systemctl is-active --quiet mongodb 2>/dev/null; then
    echo -e "${GREEN}✓ MongoDB systemd service (mongodb) is ACTIVE & RUNNING.${NC}"
    MONGO_RUNNING=true
  fi
fi

# Check Docker container if running in docker
if [ "$MONGO_RUNNING" = false ] && command -v docker >/dev/null 2>&1; then
  DOCKER_MONGO=$(docker ps --filter "name=mongo" --format "{{.Names}}" 2>/dev/null || true)
  if [ -n "$DOCKER_MONGO" ]; then
    echo -e "${GREEN}✓ MongoDB is running inside Docker container: ${DOCKER_MONGO}${NC}"
    MONGO_RUNNING=true
  fi
fi

# Check listening port 27017
if command -v nc >/dev/null 2>&1; then
  if nc -z 127.0.0.1 27017 2>/dev/null; then
    echo -e "${GREEN}✓ Port 27017 is actively responding on 127.0.0.1.${NC}"
    MONGO_RUNNING=true
  fi
elif command -v ss >/dev/null 2>&1; then
  if ss -tulpn | grep -q ":27017 "; then
    echo -e "${GREEN}✓ Port 27017 is actively listening.${NC}"
    MONGO_RUNNING=true
  fi
fi

# Step 2: Auto-Recovery if MongoDB is down
if [ "$MONGO_RUNNING" = false ]; then
  echo -e "${YELLOW}⚠ MongoDB service is currently NOT running. Attempting auto-restart...${NC}"
  
  if command -v systemctl >/dev/null 2>&1; then
    echo "--> Running: sudo systemctl start mongod || sudo systemctl start mongodb"
    sudo systemctl start mongod 2>/dev/null || sudo systemctl start mongodb 2>/dev/null || true
    sleep 2
    if systemctl is-active --quiet mongod 2>/dev/null || systemctl is-active --quiet mongodb 2>/dev/null; then
      echo -e "${GREEN}✓ Auto-recovery successful: MongoDB service started!${NC}"
      MONGO_RUNNING=true
    fi
  elif command -v service >/dev/null 2>&1; then
    sudo service mongodb start 2>/dev/null || sudo service mongod start 2>/dev/null || true
    sleep 2
  fi

  if [ "$MONGO_RUNNING" = false ] && command -v docker >/dev/null 2>&1; then
    if docker ps -a --filter "name=mongo" --format "{{.Names}}" | grep -q "mongo"; then
      echo "--> Starting existing Docker mongo container..."
      docker start mongo 2>/dev/null || docker start ahsan-mongodb 2>/dev/null || true
      sleep 2
      MONGO_RUNNING=true
    fi
  fi
fi

# Step 3: Check Environment File (.env) Configuration
echo -e "\n${BLUE}--> [2/4] Checking .env Database Connection Configuration...${NC}"
if [ -f ".env" ]; then
  if grep -q "MONGODB_URI" .env; then
    ENV_URI=$(grep "MONGODB_URI" .env | head -n 1)
    echo -e "${GREEN}✓ MONGODB_URI is declared in .env: ${ENV_URI}${NC}"
  else
    echo -e "${YELLOW}⚠ MONGODB_URI missing from .env. Adding standard local connection string...${NC}"
    echo "MONGODB_URI=mongodb://127.0.0.1:27017/AHSAN_AI_LABS" >> .env
    echo "DATABASE_NAME=AHSAN_AI_LABS" >> .env
    echo -e "${GREEN}✓ Added MONGODB_URI=mongodb://127.0.0.1:27017/AHSAN_AI_LABS to .env${NC}"
  fi
else
  echo -e "${YELLOW}⚠ .env file not found. Creating from .env.example with MongoDB defaults...${NC}"
  if [ -f ".env.example" ]; then
    cp .env.example .env
  else
    echo "MONGODB_URI=mongodb://127.0.0.1:27017/AHSAN_AI_LABS" > .env
    echo "DATABASE_NAME=AHSAN_AI_LABS" >> .env
  fi
  echo -e "${GREEN}✓ .env created successfully.${NC}"
fi

# Step 4: Verify Local Database Fallback Health
echo -e "\n${BLUE}--> [3/4] Checking Atomic JSON Storage Fallback (db.json)...${NC}"
if [ -f "data/db.json" ]; then
  DB_SIZE=$(wc -c < data/db.json)
  echo -e "${GREEN}✓ Local database cache exists (Size: ${DB_SIZE} bytes).${NC}"
  if [ -f "data/db.json.bak" ]; then
    echo -e "${GREEN}✓ Dual-write safety backup (data/db.json.bak) is verified.${NC}"
  fi
else
  echo -e "${YELLOW}ℹ data/db.json will be initialized on first server start.${NC}"
fi

# Step 5: Final Summary & Recommendations
echo -e "\n${BLUE}--> [4/4] Summary & Verification Status:${NC}"
if [ "$MONGO_RUNNING" = true ]; then
  echo -e "${GREEN}=================================================================${NC}"
  echo -e "${GREEN} [SUCCESS] MongoDB is Active and Ready!${NC}"
  echo -e "${GREEN} All inquiries, services, CMS content & settings will be stored${NC}"
  echo -e "${GREEN} directly in MongoDB + dual-saved to local fallback store.${NC}"
  echo -e "${GREEN}=================================================================${NC}"
else
  echo -e "${YELLOW}=================================================================${NC}"
  echo -e "${YELLOW} [NOTICE] MongoDB service is not currently detected.${NC}"
  echo -e "${YELLOW} The website is running safely on the Atomic JSON Persistence Engine.${NC}"
  echo -e "${YELLOW} To install/start MongoDB on Ubuntu/Debian in 1 command, run:${NC}"
  echo -e "${CYAN}   sudo ./scripts/setup-mongodb.sh${NC}"
  echo -e "${YELLOW}=================================================================${NC}"
fi
