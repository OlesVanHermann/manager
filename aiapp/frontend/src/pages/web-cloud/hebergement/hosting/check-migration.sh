#!/bin/bash
# ============================================================
# CHECK MIGRATION - Vérifie la migration des services hosting
# ============================================================

HOSTING_DIR="/home/ubuntu/aiapp/frontend/src/pages/web-cloud/hebergement/hosting"
OLD_SERVICE="/home/ubuntu/aiapp/frontend/src/services/web-cloud.hosting.ts"

echo "=============================================="
echo "CHECK MIGRATION HOSTING SERVICES"
echo "=============================================="
echo ""

# --- ÉTAPE 1 : Vérifier les nouveaux fichiers .ts ---
echo "📁 ÉTAPE 1 : Vérifier les nouveaux fichiers .ts"
echo "----------------------------------------------"

FILES_TS=(
  "hosting.types.ts"
  "tabs/general/GeneralTab.ts"
  "tabs/multisite/MultisiteTab.ts"
  "tabs/ftp/FtpTab.ts"
  "tabs/database/DatabaseTab.ts"
  "tabs/modules/ModulesTab.ts"
  "tabs/cron/CronTab.ts"
  "tabs/envvars/EnvvarsTab.ts"
  "tabs/runtimes/RuntimesTab.ts"
  "tabs/ssl/SslTab.ts"
  "tabs/cdn/CdnTab.ts"
  "tabs/boost/BoostTab.ts"
  "tabs/localseo/LocalSeoTab.ts"
  "tabs/emails/EmailsTab.ts"
  "tabs/logs/LogsTab.ts"
  "tabs/tasks/TasksTab.ts"
)

MISSING_TS=0
for f in "${FILES_TS[@]}"; do
  if [ -f "$HOSTING_DIR/$f" ]; then
    echo "  ✓ $f"
  else
    echo "  ✗ MANQUANT: $f"
    MISSING_TS=$((MISSING_TS + 1))
  fi
done

echo ""
if [ $MISSING_TS -eq 0 ]; then
  echo "  ✅ 16/16 fichiers .ts présents"
else
  echo "  ❌ $MISSING_TS fichier(s) manquant(s)"
fi

# --- ÉTAPE 2 : Vérifier les imports de l'ancien service ---
echo ""
echo "🔍 ÉTAPE 2 : Vérifier les imports de l'ancien service"
echo "----------------------------------------------"

# Chercher spécifiquement les imports du service (pas les clés i18n)
OLD_IMPORTS=$(grep -rn "from.*services/web-cloud.hosting" "$HOSTING_DIR" --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "check-migration.sh")

if [ -z "$OLD_IMPORTS" ]; then
  echo "  ✅ Aucun import de 'services/web-cloud.hosting' dans hosting/"
else
  echo "  ❌ Imports restants trouvés :"
  echo "$OLD_IMPORTS" | while read line; do
    echo "    → $line"
  done
fi

# --- ÉTAPE 3 : Vérifier les nouveaux imports par tab ---
echo ""
echo "🔗 ÉTAPE 3 : Vérifier les nouveaux imports par tab"
echo "----------------------------------------------"

declare -A TAB_SERVICES=(
  ["general"]="generalService"
  ["multisite"]="multisiteService"
  ["ftp"]="ftpService"
  ["database"]="databaseService"
  ["modules"]="modulesService"
  ["cron"]="cronService"
  ["envvars"]="envvarsService"
  ["runtimes"]="runtimesService"
  ["ssl"]="sslService"
  ["cdn"]="cdnService"
  ["boost"]="boostService"
  ["localseo"]="localseoService"
  ["emails"]="emailsService"
  ["logs"]="logsService"
  ["tasks"]="tasksService"
)

for tab in "${!TAB_SERVICES[@]}"; do
  service="${TAB_SERVICES[$tab]}"
  
  # Trouver le fichier .tsx principal du tab
  shopt -s nullglob
  tab_files=("$HOSTING_DIR/tabs/$tab/"*Tab.tsx)
  shopt -u nullglob
  
  if [ ${#tab_files[@]} -gt 0 ]; then
    tab_file="${tab_files[0]}"
    if grep -q "$service" "$tab_file" 2>/dev/null; then
      echo "  ✓ $tab → $service"
    else
      echo "  ✗ $tab → $service NON TROUVÉ dans $(basename $tab_file)"
    fi
  else
    echo "  ? $tab → fichier .tsx non trouvé"
  fi
done

# --- ÉTAPE 4 : Vérifier l'ancien service ---
echo ""
echo "🗑️  ÉTAPE 4 : Statut de l'ancien service"
echo "----------------------------------------------"

if [ -f "$OLD_SERVICE" ]; then
  echo "  ⚠️  L'ancien service existe encore: $OLD_SERVICE"
  echo "     Supprimer après validation du build"
else
  echo "  ✅ L'ancien service a été supprimé"
fi

# --- ÉTAPE 5 : Vérifier hostingService résiduel ---
echo ""
echo "🔎 ÉTAPE 5 : Recherche de 'hostingService.' résiduel"
echo "----------------------------------------------"

HOSTING_SERVICE_REFS=$(grep -rn "hostingService\." "$HOSTING_DIR" --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "check-migration.sh")

if [ -z "$HOSTING_SERVICE_REFS" ]; then
  echo "  ✅ Aucune référence à 'hostingService.' trouvée"
else
  echo "  ❌ Références résiduelles trouvées :"
  echo "$HOSTING_SERVICE_REFS" | while read line; do
    echo "    → $line"
  done
fi

# --- RÉSUMÉ ---
echo ""
echo "=============================================="
echo "RÉSUMÉ"
echo "=============================================="

ERRORS=0

if [ $MISSING_TS -gt 0 ]; then
  echo "  ❌ Fichiers .ts manquants: $MISSING_TS"
  ERRORS=$((ERRORS + 1))
fi

if [ -n "$OLD_IMPORTS" ]; then
  echo "  ❌ Imports anciens restants"
  ERRORS=$((ERRORS + 1))
fi

if [ -n "$HOSTING_SERVICE_REFS" ]; then
  echo "  ❌ Références hostingService résiduelles"
  ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -eq 0 ]; then
  echo "  ✅ Migration OK - Prêt pour le build"
  echo ""
  echo "  Prochaines étapes:"
  echo "    1. cd /home/ubuntu/aiapp/frontend && npm run build:dev"
  echo "    2. /home/ubuntu/aiapp/scripts/D1-build_frontend_dev.sh"
  echo "    3. Tester sur https://manager.di2amp.com/dev/"
  echo "    4. Supprimer l'ancien service:"
  echo "       rm $OLD_SERVICE"
else
  echo ""
  echo "  ⚠️  $ERRORS problème(s) à corriger avant le build"
fi

echo "=============================================="
