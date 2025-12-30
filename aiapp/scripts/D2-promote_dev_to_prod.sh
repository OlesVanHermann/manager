#!/usr/bin/env bash
set -euo pipefail

# ==========================================
# D2-promote_dev_to_prod.sh
# - Mode 1 (défaut): copie la dernière release DEV vers PROD
# - Mode 2 (--from-dist): copie le contenu du frontend/dist courant vers PROD
# - Sauvegarde l'ancien PROD en backup
# - AUCUN sudo dans ce script
# ==========================================

WEBROOT="${WEBROOT:-/var/www/aiapp/prod}"                    # racine prod (servie sur /)
DEVROOT="${DEVROOT:-/var/www/aiapp/dev}"                # racine dev (servie sur /dev/)
RELEASES_DIR_DEV="${RELEASES_DIR_DEV:-/var/www/aiapp_releases_dev}"
RELEASES_DIR_PROD="${RELEASES_DIR_PROD:-/var/www/aiapp_releases_prod}"
FRONTEND_DIR="${FRONTEND_DIR:-/home/ubuntu/aiapp/frontend}"
TS="$(date +%Y%m%d-%H%M%S)"
PROMO_DIR="${RELEASES_DIR_PROD}/promoted-${TS}"

info(){ echo -e "[\e[34mINFO\e[0m] $*"; }
warn(){ echo -e "[\e[33mWARN\e[0m] $*"; }
err() { echo -e "[\e[31mERR \e[0m] $*" >&2; }

command -v rsync >/dev/null 2>&1 || { err "rsync introuvable"; exit 1; }

USE_DIST=0
if [[ "${1:-}" == "--from-dist" ]]; then
  USE_DIST=1
fi

# ---- Source à promouvoir ----
if [[ "$USE_DIST" == "1" ]]; then
  SRC="${FRONTEND_DIR}/dist"
  [[ -d "$SRC" ]] || { err "dist introuvable: $SRC (lancez 'npm run build:prod')"; exit 1; }
  info "Source = build courant (dist): $SRC"
else
  latest_dev_release=""
  if [[ -d "$RELEASES_DIR_DEV" ]]; then
    latest_dev_release="$(ls -1dt "${RELEASES_DIR_DEV}"/release-* 2>/dev/null | head -n1 || true)"
  fi
  if [[ -n "$latest_dev_release" && -d "$latest_dev_release" ]]; then
    SRC="$latest_dev_release"
    info "Source = dernière release DEV: $SRC"
  else
    [[ -d "$DEVROOT" ]] || { err "Ni release DEV trouvée, ni DEVROOT: $DEVROOT"; exit 1; }
    SRC="$DEVROOT"
    warn "Aucune release DEV trouvée — promotion directe du contenu de $DEVROOT"
  fi
fi

# ---- Snapshot de promotion ----
mkdir -p "$RELEASES_DIR_PROD" "$PROMO_DIR"
info "Snapshot → $PROMO_DIR"
rsync -a --delete "$SRC/" "$PROMO_DIR/"

# ---- Backup PROD actuel ----
if [[ -d "$WEBROOT" ]]; then
  BACKUP="${WEBROOT%/}._backup-${TS}"
  info "Backup de l'ancien PROD → $BACKUP"
  mv "$WEBROOT" "$BACKUP"
fi

# ---- Déploiement atomique vers PROD ----
info "Déploiement vers PROD ($WEBROOT)"
mkdir -p "$WEBROOT"
# IMPORTANT: copier le CONTENU, pas le dossier
rsync -a --delete "$PROMO_DIR/" "$WEBROOT/"

index_file="$WEBROOT/index.html"
if [[ -f "$index_file" ]]; then
  info "Index présent: $index_file"
else
  warn "index.html introuvable sous $WEBROOT — vérifier la conf Vite/base/ Nginx"
fi

echo
info "✅ Promotion terminée"
echo " - Source   : $SRC"
echo " - Prod     : $WEBROOT"
echo " - Backup   : ${BACKUP:-<aucun>}"
echo " - Snapshot : $PROMO_DIR"
