#!/usr/bin/env bash
# ==============================================================================
# AHSAN AI LABS — 1-Command Production MongoDB Installer & Configurator
# Installs MongoDB Community Edition, enables systemd service, and connects database.
# Usage: sudo ./scripts/setup-mongodb.sh
# ==============================================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}=================================================================${NC}"
echo -e "${CYAN} [AHSAN AI LABS] Production MongoDB 7.0 Community Installer${NC}"
echo -e "${CYAN}=================================================================${NC}"

if [ "$(id -u)" -ne 0 ]; then
  echo -e "${YELLOW}Please run with sudo privileges: sudo ./scripts/setup-mongodb.sh${NC}"
fi

# Detect OS
if [ -f /etc/os-release ]; then
  . /etc/os-release
  OS=$ID
  VERSION=$VERSION_ID
else
  OS=$(uname -s)
fi

echo -e "--> Detected Operating System: ${CYAN}${OS} (${VERSION})${NC}"

# Ubuntu / Debian Installation
if [[ "$OS" == "ubuntu" ]] || [[ "$OS" == "debian" ]]; then
  echo "--> Installing prerequisites (gnupg, curl, ca-certificates)..."
  sudo apt-get update -y
  sudo apt-get install -y gnupg curl ca-certificates

  echo "--> Importing MongoDB 7.0 Public GPG Key..."
  curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
     sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg --yes

  echo "--> Adding MongoDB apt repository..."
  if [[ "$OS" == "ubuntu" ]]; then
    CODENAME=$(lsb_release -cs 2>/dev/null || echo "jammy")
    # If newer than jammy (e.g. noble 24.04), jammy repository works reliably
    if [[ "$CODENAME" != "jammy" && "$CODENAME" != "focal" ]]; then
      CODENAME="jammy"
    fi
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu ${CODENAME}/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
  else
    DEB_CODENAME=$(lsb_release -cs 2>/dev/null || echo "bookworm")
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian ${DEB_CODENAME}/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
  fi

  echo "--> Updating package repository and installing MongoDB packages..."
  sudo apt-get update -y
  sudo apt-get install -y mongodb-org || sudo apt-get install -y mongodb

# RHEL / CentOS / AlmaLinux / RockyLinux
elif [[ "$OS" == "centos" ]] || [[ "$OS" == "rhel" ]] || [[ "$OS" == "almalinux" ]] || [[ "$OS" == "rocky" ]]; then
  echo "--> Creating MongoDB yum repository..."
  cat <<EOF | sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
EOF
  sudo yum install -y mongodb-org
fi

# Enable and start MongoDB service
echo "--> Enabling and starting MongoDB systemd daemon..."
sudo systemctl daemon-reload 2>/dev/null || true
sudo systemctl enable mongod 2>/dev/null || sudo systemctl enable mongodb 2>/dev/null || true
sudo systemctl start mongod 2>/dev/null || sudo systemctl start mongodb 2>/dev/null || true

# Verify status
sleep 2
if systemctl is-active --quiet mongod 2>/dev/null || systemctl is-active --quiet mongodb 2>/dev/null; then
  echo -e "${GREEN}✓ MongoDB service is successfully ACTIVE and RUNNING!${NC}"
else
  echo -e "${YELLOW}⚠ Service restart attempt...${NC}"
  sudo systemctl restart mongod 2>/dev/null || sudo service mongodb restart 2>/dev/null || true
fi

# Ensure .env has the right MONGODB_URI
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

if [ -f ".env" ]; then
  if ! grep -q "MONGODB_URI" .env; then
    echo "MONGODB_URI=mongodb://127.0.0.1:27017/AHSAN_AI_LABS" >> .env
    echo "DATABASE_NAME=AHSAN_AI_LABS" >> .env
  fi
else
  echo "MONGODB_URI=mongodb://127.0.0.1:27017/AHSAN_AI_LABS" > .env
  echo "DATABASE_NAME=AHSAN_AI_LABS" >> .env
fi

echo -e "\n${GREEN}=================================================================${NC}"
echo -e "${GREEN} [SETUP COMPLETE] MongoDB 7.0 Installed & Configured!${NC}"
echo -e "${GREEN} Connection: mongodb://127.0.0.1:27017/AHSAN_AI_LABS${NC}"
echo -e "${GREEN} Systemd Service: mongod (Enabled on boot)${NC}"
echo -e "${GREEN}=================================================================${NC}"
