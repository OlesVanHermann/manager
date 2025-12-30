#!/usr/bin/env bash
set -euo pipefail

# ===============================
# D3-deploy_static.sh
# - Déploie le site statique SVG
# - Source: /home/ubuntu/aiapp/static
# - Dest: /var/www/aiapp/static
# - AUCUN sudo dans ce script
# ===============================

STATIC_SRC="${STATIC_SRC:-/home/ubuntu/aiapp/static}"
STATIC_DEST="${STATIC_DEST:-/var/www/aiapp/static}"
RELEASES_DIR="${RELEASES_DIR:-/var/www/aiapp_releases_static}"
TS="$(date +%Y%m%d-%H%M%S)"
RELEASE_DIR="${RELEASES_DIR}/release-${TS}"

info(){ echo -e "[\e[34mINFO\e[0m] $*"; }
warn(){ echo -e "[\e[33mWARN\e[0m] $*"; }
err() { echo -e "[\e[31mERR \e[0m] $*" >&2; }

command -v rsync >/dev/null 2>&1 || { err "rsync introuvable"; exit 1; }

[[ -d "$STATIC_SRC" ]] || { err "Source introuvable: $STATIC_SRC"; exit 1; }

# Compter les fichiers
FILE_COUNT=$(find "$STATIC_SRC" -type f | wc -l)
HTML_COUNT=$(find "$STATIC_SRC" -type f -name "*.html" | wc -l)

info "Source: $STATIC_SRC"
info "Fichiers: $FILE_COUNT total, $HTML_COUNT HTML"

[[ $FILE_COUNT -gt 0 ]] || { err "Aucun fichier dans $STATIC_SRC"; exit 1; }

# Créer release
info "Préparation release: $RELEASE_DIR"
mkdir -p "$RELEASES_DIR"
mkdir -p "$RELEASE_DIR"
rsync -a --delete "$STATIC_SRC/" "$RELEASE_DIR/"

# Déployer
info "Déploiement vers $STATIC_DEST"
mkdir -p "$STATIC_DEST"
rsync -a --delete "$RELEASE_DIR/" "$STATIC_DEST/"

# Fixer les permissions pour nginx
chmod -R 755 "$STATIC_DEST"
find "$STATIC_DEST" -type f -exec chmod 644 {} \;

# Vérifier index
index_file="$STATIC_DEST/index.html"
if [[ -f "$index_file" ]]; then
  info "Index présent: $index_file"
else
  warn "index.html introuvable sous $STATIC_DEST"
fi

# Lister structure
echo
info "Structure déployée:"
find "$STATIC_DEST" -type f -name "*.html" | head -20 | sed 's|'"$STATIC_DEST"'|/static|g'
if [[ $HTML_COUNT -gt 20 ]]; then
  echo "  ... et $((HTML_COUNT - 20)) autres fichiers HTML"
fi

# Cleanup vieilles releases (garder 5)
cd "$RELEASES_DIR"
RELEASE_COUNT=$(ls -1d release-* 2>/dev/null | wc -l)
if [[ $RELEASE_COUNT -gt 5 ]]; then
  info "Nettoyage anciennes releases (garde 5)..."
  ls -1dt release-* | tail -n +6 | xargs rm -rf
fi

echo
info "✅ Static déployé"
echo " - Release : $RELEASE_DIR"
echo " - Dest    : $STATIC_DEST"
echo " - URL     : https://manager.di2amp.com/static/"
echo " - Pages   : $HTML_COUNT"
