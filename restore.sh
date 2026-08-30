#!/usr/bin/env bash
# ==============================================================================
# AHSAN AI LABS — Automated Database Restore Script
# Restores a MongoDB and local JSON database backup from an archive file
# Usage: ./restore.sh /path/to/ahsan_backup_YYYYMMDD_HHMMSS.tar.gz
# ==============================================================================

set -e

BACKUP_FILE="$1"

if [ -z "${BACKUP_FILE}" ] || [ ! -f "${BACKUP_FILE}" ]; then
  echo "Usage: $0 <path_to_backup_archive.tar.gz>"
  exit 1
fi

TEMP_RESTORE_DIR="/tmp/ahsan_restore_$(date +%s)"
mkdir -p "${TEMP_RESTORE_DIR}"

echo "========================================================"
echo " [AHSAN AI LABS] Restoring Database from: ${BACKUP_FILE}"
echo "========================================================"

tar -xzf "${BACKUP_FILE}" -C "${TEMP_RESTORE_DIR}"

# 1. Restore local data files if present
if ls "${TEMP_RESTORE_DIR}"/*_data 1>/dev/null 2>&1; then
  mkdir -p data
  cp -r "${TEMP_RESTORE_DIR}"/*_data/* data/ 2>/dev/null || true
  echo "--> Local data files restored."
fi

# 2. Restore MongoDB container if active
if ls "${TEMP_RESTORE_DIR}"/*_mongo 1>/dev/null 2>&1 && docker ps | grep -q ahsan_mongodb; then
  echo "--> Restoring MongoDB collections..."
  docker cp "${TEMP_RESTORE_DIR}"/*_mongo ahsan_mongodb:/tmp/restore_dump
  docker exec ahsan_mongodb mongorestore --db AHSAN_AI_LABS --drop /tmp/restore_dump/AHSAN_AI_LABS
  docker exec ahsan_mongodb rm -rf /tmp/restore_dump
  echo "--> MongoDB collections restored."
fi

rm -rf "${TEMP_RESTORE_DIR}"

echo "========================================================"
echo " [AHSAN AI LABS] Restoration Complete! Please restart PM2."
echo " Command: pm2 restart ahsan-ai-labs"
echo "========================================================"
