#!/bin/bash
# ============================================================
# SCRIPT DE DÉPLOIEMENT - Fichiers générés pour web-cloud
# ============================================================
# Usage: ./deploy.sh /chemin/vers/aiapp/frontend
# ============================================================

set -e

TARGET_DIR="${1:-/home/ubuntu/aiapp/frontend}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TIMESTAMP=$(date +%Y%m%dT%H%M%S)

echo "============================================================"
echo "DÉPLOIEMENT DES FICHIERS DÉFACTORISÉS"
echo "============================================================"
echo "Source: $SCRIPT_DIR"
echo "Cible:  $TARGET_DIR"
echo "============================================================"

# Vérifier que le répertoire cible existe
if [ ! -d "$TARGET_DIR/src/pages/web-cloud" ]; then
  echo "❌ ERREUR: Répertoire cible invalide: $TARGET_DIR"
  exit 1
fi

echo ""
echo "📁 PHASE 1: Création des répertoires manquants..."
mkdir -p "$TARGET_DIR/public/locales/fr/web-cloud/access/pack-xdsl"
mkdir -p "$TARGET_DIR/public/locales/fr/web-cloud/access/overthebox"
mkdir -p "$TARGET_DIR/public/locales/fr/web-cloud/telecom/sms"
mkdir -p "$TARGET_DIR/public/locales/fr/web-cloud/telecom/voip"
mkdir -p "$TARGET_DIR/public/locales/fr/web-cloud/telecom/fax"
mkdir -p "$TARGET_DIR/public/locales/en/web-cloud/access/pack-xdsl"
mkdir -p "$TARGET_DIR/public/locales/en/web-cloud/access/overthebox"
mkdir -p "$TARGET_DIR/public/locales/en/web-cloud/telecom/sms"
mkdir -p "$TARGET_DIR/public/locales/en/web-cloud/telecom/voip"
mkdir -p "$TARGET_DIR/public/locales/en/web-cloud/telecom/fax"
echo "✅ Répertoires créés"

echo ""
echo "📄 PHASE 2: Copie des fichiers CSS..."

# Backup et copie access/index.css
if [ -f "$TARGET_DIR/src/pages/web-cloud/access/index.css" ]; then
  cp "$TARGET_DIR/src/pages/web-cloud/access/index.css" "$TARGET_DIR/src/pages/web-cloud/access/index.css.backup.$TIMESTAMP"
  echo "   → Backup: access/index.css.backup.$TIMESTAMP"
fi
cp "$SCRIPT_DIR/src/pages/web-cloud/access/index.css" "$TARGET_DIR/src/pages/web-cloud/access/index.css"
echo "   ✅ access/index.css"

# Backup et copie telecom/index.css
if [ -f "$TARGET_DIR/src/pages/web-cloud/telecom/index.css" ]; then
  cp "$TARGET_DIR/src/pages/web-cloud/telecom/index.css" "$TARGET_DIR/src/pages/web-cloud/telecom/index.css.backup.$TIMESTAMP"
  echo "   → Backup: telecom/index.css.backup.$TIMESTAMP"
fi
cp "$SCRIPT_DIR/src/pages/web-cloud/telecom/index.css" "$TARGET_DIR/src/pages/web-cloud/telecom/index.css"
echo "   ✅ telecom/index.css"

echo ""
echo "📄 PHASE 3: Copie du service access.service.ts..."
if [ -f "$TARGET_DIR/src/pages/web-cloud/access/access.service.ts" ]; then
  cp "$TARGET_DIR/src/pages/web-cloud/access/access.service.ts" "$TARGET_DIR/src/pages/web-cloud/access/access.service.ts.backup.$TIMESTAMP"
  echo "   → Backup: access.service.ts.backup.$TIMESTAMP"
fi
cp "$SCRIPT_DIR/src/pages/web-cloud/access/access.service.ts" "$TARGET_DIR/src/pages/web-cloud/access/access.service.ts"
echo "   ✅ access/access.service.ts"

echo ""
echo "🌐 PHASE 4: Copie des traductions FR..."
for file in $(find "$SCRIPT_DIR/public/locales/fr" -name "*.json"); do
  rel_path="${file#$SCRIPT_DIR/}"
  cp "$file" "$TARGET_DIR/$rel_path"
  echo "   ✅ $rel_path"
done

echo ""
echo "🌐 PHASE 5: Copie des traductions EN..."
for file in $(find "$SCRIPT_DIR/public/locales/en" -name "*.json"); do
  rel_path="${file#$SCRIPT_DIR/}"
  cp "$file" "$TARGET_DIR/$rel_path"
  echo "   ✅ $rel_path"
done

echo ""
echo "🔧 PHASE 6: Ajout import CSS dans telecom/index.tsx (si manquant)..."
TELECOM_INDEX="$TARGET_DIR/src/pages/web-cloud/telecom/index.tsx"
if ! grep -q "import.*index\.css" "$TELECOM_INDEX" 2>/dev/null; then
  # Ajouter l'import après la dernière ligne d'import
  sed -i '/^import.*from/a import "./index.css";' "$TELECOM_INDEX"
  echo "   ✅ Import ajouté dans telecom/index.tsx"
else
  echo "   → Import déjà présent dans telecom/index.tsx"
fi

echo ""
echo "🗑️  PHASE 7: Nettoyage des fichiers orphelins..."

# Backup styles.css (monolithique) si existe
if [ -f "$TARGET_DIR/src/pages/web-cloud/styles.css" ]; then
  cp "$TARGET_DIR/src/pages/web-cloud/styles.css" "$TARGET_DIR/src/pages/web-cloud/styles.css.backup.$TIMESTAMP"
  echo "   → Backup: styles.css.backup.$TIMESTAMP"
  echo "   ⚠️  styles.css conservé (vérifier manuellement si utilisé)"
fi

# Backup web-cloud.service.ts (monolithique) si existe
if [ -f "$TARGET_DIR/src/pages/web-cloud/web-cloud.service.ts" ]; then
  cp "$TARGET_DIR/src/pages/web-cloud/web-cloud.service.ts" "$TARGET_DIR/src/pages/web-cloud/web-cloud.service.ts.backup.$TIMESTAMP"
  echo "   → Backup: web-cloud.service.ts.backup.$TIMESTAMP"
  echo "   ⚠️  web-cloud.service.ts conservé (vérifier manuellement si utilisé)"
fi

echo ""
echo "============================================================"
echo "✅ DÉPLOIEMENT TERMINÉ"
echo "============================================================"
echo ""
echo "📋 PROCHAINES ÉTAPES:"
echo "   1. cd $TARGET_DIR"
echo "   2. npm run build:dev"
echo "   3. Tester sur https://manager.di2amp.com/dev/"
echo ""
echo "🧹 NETTOYAGE MANUEL (après validation):"
echo "   rm $TARGET_DIR/src/pages/web-cloud/styles.css"
echo "   rm $TARGET_DIR/src/pages/web-cloud/web-cloud.service.ts"
echo ""
