# AHSAN AI LABS — Enterprise AI & Automation Platform

> **Intelligence. Automation. Innovation.**

A production-grade, full-stack AI technology agency platform engineered with React 19, Tailwind CSS, Express, MongoDB, PM2, and n8n webhook automation integration.

---

## 🌟 Core Pillars & Services

1. **AI Agents**: Autonomous multi-step reasoning, contextual memory, document triage, and automated tool execution.
2. **AI Voice Agents**: Telephony-integrated (<450ms turnaround) conversational phone assistants for reception, patient booking, and lead triage.
3. **AI Chatbots**: Custom knowledge-grounded website chatbots for instant conversion, interactive pricing, and support.
4. **Business Automation**: End-to-end API orchestration, n8n workflows, CRM synchronization, and automated document generation.
5. **WhatsApp Automation**: Official Meta WhatsApp Business Cloud API funnels, interactive quick-replies, and customer re-engagement.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion, Canvas Confetti
- **Backend**: Node.js LTS, Express 4.x, TypeScript (`tsx` in dev, `esbuild` bundled CJS in production)
- **Database**: MongoDB 7.x (with automated atomic local storage fallback)
- **Automation Pipeline**: n8n Webhook Dispatcher + WhatsApp / Email multi-channel alerting
- **Process Management**: PM2 Cluster Mode with automatic reboot restart (`pm2 startup`)
- **Web Server / Reverse Proxy**: Nginx with SSL/TLS termination, rate limiting, and gzip compression
- **Security**: JWT Authentication, bcrypt password hashing, honeypot anti-spam defense, strict CORS & security headers

---

## 🚀 Quick Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run in development mode (starts on http://localhost:3000)
npm run dev

# 3. Compile production build
npm run build

# 4. Start production server
npm start
```

---

## ☁️ Oracle Cloud Ubuntu VM Deployment Guide

### Automated 1-Step Deployment
```bash
# Clone or upload repository to /var/www/ahsan-ai-labs
cd /var/www/ahsan-ai-labs

# Make scripts executable
chmod +x deploy.sh update.sh backup.sh restore.sh

# Run automated deployment
sudo ./deploy.sh
```

### Manual Deployment Steps

#### 1. System Requirements & Packages
```bash
sudo apt-get update -y
sudo apt-get install -y curl git build-essential nginx ufw ca-certificates gnupg lsb-release
```

#### 2. Install Node.js LTS & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

#### 3. Start MongoDB via Docker Compose
```bash
sudo docker compose up -d mongodb
```

#### 4. Configure Environment Variables
```bash
cp .env.example .env
nano .env # Set your MONGODB_URI, ADMIN_SECRET, and N8N_WEBHOOK_URL
```

#### 5. Build and Launch with PM2
```bash
npm install
npm run build
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

#### 6. Configure Nginx Reverse Proxy
```bash
sudo cp nginx.conf /etc/nginx/sites-available/ahsan-ai-labs
sudo ln -sf /etc/nginx/sites-available/ahsan-ai-labs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. Configure Firewall (UFW)
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 🔒 SSL / HTTPS Configuration with Let's Encrypt

Once your domain (e.g. `ahsanailabs.com`) points to your VM's public IP:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ahsanailabs.com -d www.ahsanailabs.com
```

Certbot will automatically configure HTTPS redirects and certificate renewals.

---

## 🛠️ Management & Maintenance Commands

| Action | Command |
|---|---|
| **View Logs** | `pm2 logs ahsan-ai-labs` |
| **Restart Application** | `pm2 restart ahsan-ai-labs` |
| **Zero-Downtime Reload** | `pm2 reload ecosystem.config.cjs --env production` |
| **Check App Health** | `curl http://localhost:3000/api/health` |
| **Check Storage & Uptime** | `curl http://localhost:3000/api/ready` |
| **Create Database Backup** | `./backup.sh` |
| **Restore Database** | `./restore.sh /var/backups/ahsan-ai-labs/ahsan_backup_*.tar.gz` |
| **1-Click Application Update** | `./update.sh` |

---

## 🔐 Administrative Portal

- **URL**: `/admin`
- **Default Super Admin**: `admin@ahsanailabs.com`
- **Default Password**: `admin_password_123` *(Change immediately upon first login via Admin Settings)*

---

© 2026 AHSAN AI LABS. All rights reserved.
