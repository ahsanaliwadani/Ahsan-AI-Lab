#!/usr/bin/env bash
# ==============================================================================
# AHSAN AI LABS — 1-Command SSL Certificate & Domain Fix Tool
# Automates Certbot SSL generation, Nginx SSL configuration, and domain routing.
# Usage: sudo ./scripts/setup-ssl.sh [your-domain.com]
# Example: sudo ./scripts/setup-ssl.sh ahsanailab.bond
# ==============================================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}=================================================================${NC}"
echo -e "${CYAN} [AHSAN AI LABS] Automated SSL Certificate & Domain Manager${NC}"
echo -e "${CYAN}=================================================================${NC}"

if [ "$(id -u)" -ne 0 ]; then
  echo -e "${RED}Error: This script must be run as root or with sudo!${NC}"
  echo -e "Usage: sudo ./scripts/setup-ssl.sh ahsanailab.bond"
  exit 1
fi

DOMAIN="${1:-ahsanailab.bond}"
EMAIL="${2:-contact@ahsanailabs.com}"

echo -e "--> Target Domain: ${CYAN}${DOMAIN}${NC}"
echo -e "--> Admin Email:   ${CYAN}${EMAIL}${NC}"

# 1. Install Certbot & Nginx plugin
echo -e "\n${BLUE}--> [1/4] Installing Certbot and dependencies...${NC}"
if command -v apt-get >/dev/null 2>&1; then
  apt-get update -y
  apt-get install -y certbot python3-certbot-nginx nginx
elif command -v yum >/dev/null 2>&1; then
  yum install -y certbot python3-certbot-nginx nginx
fi

# 2. Update Nginx server_name
echo -e "\n${BLUE}--> [2/4] Configuring Nginx for domain ${DOMAIN}...${NC}"
NGINX_CONF="/etc/nginx/sites-available/ahsan-ai-labs"
if [ ! -f "$NGINX_CONF" ]; then
  NGINX_CONF="/etc/nginx/conf.d/ahsan-ai-labs.conf"
fi

cat <<EOF > "$NGINX_CONF"
# AHSAN AI LABS — Nginx Reverse Proxy
limit_req_zone \$binary_remote_addr zone=inquiry_limit:10m rate=10r/m;
limit_req_zone \$binary_remote_addr zone=general_limit:10m rate=60r/m;

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN} _;

    client_max_body_size 100M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml application/json application/javascript image/svg+xml;

    location / {
        limit_req zone=general_limit burst=20 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 120s;
        proxy_connect_timeout 60s;
    }
}
EOF

# Enable site if Debian/Ubuntu
if [ -d "/etc/nginx/sites-enabled" ]; then
  ln -sf /etc/nginx/sites-available/ahsan-ai-labs /etc/nginx/sites-enabled/ahsan-ai-labs
  rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
fi

# Test Nginx syntax
nginx -t

# Reload Nginx
systemctl reload nginx || systemctl restart nginx

# 3. Obtain Let's Encrypt SSL Certificate
echo -e "\n${BLUE}--> [3/4] Requesting Let's Encrypt SSL certificate for ${DOMAIN}...${NC}"
echo "Running Certbot..."

if certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos -m "${EMAIL}" --redirect; then
  echo -e "${GREEN}✓ SSL Certificate successfully issued and configured for ${DOMAIN}!${NC}"
else
  echo -e "${YELLOW}⚠ Standard Certbot attempt encountered an issue.${NC}"
  echo -e "${YELLOW}If you are using Cloudflare Proxy (Orange Cloud), ensure:${NC}"
  echo -e "  1. Cloudflare SSL/TLS encryption mode is set to 'Flexible' or 'Full'"
  echo -e "  2. Or obtain certificate standalone: certbot certonly --standalone -d ${DOMAIN}"
fi

# 4. Auto-Renewal Configuration
echo -e "\n${BLUE}--> [4/4] Setting up automatic SSL certificate renewal...${NC}"
systemctl enable certbot.timer 2>/dev/null || true
systemctl start certbot.timer 2>/dev/null || true

echo -e "\n${GREEN}=================================================================${NC}"
echo -e "${GREEN} [SUCCESS] Domain & SSL Configuration Completed!${NC}"
echo -e "${GREEN} Website URL: https://${DOMAIN}${NC}"
echo -e "${GREEN} Admin Portal: https://${DOMAIN}/admin${NC}"
echo -e "${GREEN}=================================================================${NC}"
