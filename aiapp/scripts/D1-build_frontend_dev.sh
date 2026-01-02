#!/usr/bin/env bash
set -euo pipefail

# ===============================
# D1-build_frontend_dev.sh
# - Build Vite/React du frontend
# - Déploie vers /var/www/aiapp/dev
# - AUCUN sudo dans ce script
# ===============================

FRONTEND_DIR="${FRONTEND_DIR:-/home/ubuntu/aiapp/frontend}"
DEVROOT="${DEVROOT:-/var/www/aiapp/dev}"
RELEASES_DIR_DEV="${RELEASES_DIR_DEV:-/var/www/aiapp_releases_dev}"
TS="$(date +%Y%m%d-%H%M%S)"
RELEASE_DIR="${RELEASES_DIR_DEV}/release-${TS}"

info(){ echo -e "[\e[34mINFO\e[0m] $*"; }
warn(){ echo -e "[\e[33mWARN\e[0m] $*"; }
err() { echo -e "[\e[31mERR \e[0m] $*" >&2; }

command -v node >/dev/null 2>&1 || { err "node introuvable"; exit 1; }
command -v npm  >/dev/null 2>&1 || { err "npm introuvable"; exit 1; }
command -v rsync >/dev/null 2>&1 || { err "rsync introuvable"; exit 1; }

[[ -d "$FRONTEND_DIR" ]] || { err "FRONTEND_DIR introuvable: $FRONTEND_DIR"; exit 1; }
cd "$FRONTEND_DIR"

info "Node: $(node -v)  npm: $(npm -v)"
[[ -f package.json ]] || { err "package.json manquant dans $FRONTEND_DIR"; exit 1; }

if [[ -f package-lock.json ]]; then
  info "Installation deps (npm ci)…"
  npm ci
else
  warn "package-lock.json absent → npm install"
  npm install
fi

info "Build du frontend (npm run build)…"
npm run build:dev
[[ -d dist ]] || { err "Build terminé mais dossier dist/ introuvable"; exit 1; }

info "Préparation release: $RELEASE_DIR"
mkdir -p "$RELEASES_DIR_DEV"
mkdir -p "$RELEASE_DIR"
rsync -a --delete "dist/" "$RELEASE_DIR/"

info "Déploiement vers $DEVROOT"
mkdir -p "$DEVROOT"
rsync -a --delete "$RELEASE_DIR/" "$DEVROOT/"

index_file="$DEVROOT/index.html"
if [[ -f "$index_file" ]]; then
  info "Index présent: $index_file"
else
  warn "index.html introuvable sous $DEVROOT — vérifier la conf Vite/base/ Nginx"
fi

echo
info "✅ Dev déployé"
echo " - Release : $RELEASE_DIR"
echo " - Devroot : $DEVROOT"
echo > /var/log/new-manager/live.jsonl
