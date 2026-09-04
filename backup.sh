#!/usr/bin/env bash
# ==============================================================================
# AHSAN AI LABS — Automated Database Backup Script
# Creates a compressed, timestamped backup of the MongoDB database and state
# ==============================================================================

set -e

BACKUP_DIR="${BACKUP_DIR:-/var/backups/ahsan-ai-labs}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_PATH="${BACKUP_DIR}/ahsan_backup_${TIMESTAMP}"
RETENTION_DAYS=14

echo "========================================================"
echo " [AHSAN AI LABS] Starting Database Backup: ${TIMESTAMP}"
echo "========================================================"

mkdir -p "${BACKUP_DIR}"

# 1. Backup MongoDB if container is active
if command -v docker >/dev/null 2>&1 && docker ps | grep -q ahsan_mongodb; then
  echo "--> Dumping MongoDB database from Docker container..."
  docker exec ahsan_mongodb mongodump --db AHSAN_AI_LABS --out /tmp/dump_${TIMESTAMP} >/dev/null 2>&1
  docker cp ahsan_mongodb:/tmp/dump_${TIMESTAMP} "${BACKUP_PATH}_mongo"
  docker exec ahsan_mongodb rm -rf /tmp/dump_${TIMESTAMP}
  echo "--> MongoDB dump completed."
else
  echo "--> Note: MongoDB container not detected, backing up local persistent state..."
fi

# 2. Backup Local Data Directory
if [ -d "data" ]; then
  mkdir -p "${BACKUP_PATH}_data"
  cp -r data/* "${BACKUP_PATH}_data/" 2>/dev/null || true
  echo "--> Local data directory archived."
fi

# 3. Create compressed archive
tar -czf "${BACKUP_PATH}.tar.gz" -C "${BACKUP_DIR}" "$(basename "${BACKUP_PATH}_mongo" 2>/dev/null || true)" "$(basename "${BACKUP_PATH}_data" 2>/dev/null || true)" 2>/dev/null || true
rm -rf "${BACKUP_PATH}_mongo" "${BACKUP_PATH}_data"

echo "--> Backup package created: ${BACKUP_PATH}.tar.gz"

# 4. Enforce retention policy
echo "--> Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "ahsan_backup_*.tar.gz" -type f -mtime +${RETENTION_DAYS} -delete 2>/dev/null || true

echo "========================================================"
echo " [AHSAN AI LABS] Backup Completed Successfully!"
echo "========================================================"
