#!/bin/bash
# ============================================================
# ROLLBACK - Restauration en cas d'erreur
# ============================================================

set -e

FRONTEND_DIR="/home/ubuntu/aiapp/frontend"

echo "=============================================="
echo "=== ROLLBACK DÉFACTORISATION EMAILS ==="
echo "=============================================="

cd "$FRONTEND_DIR"

# Trouver le dernier backup des services
BACKUP_DIR=$(ls -d src/services/backup.* 2>/dev/null | tail -1)

if [ -z "$BACKUP_DIR" ]; then
  echo "❌ Aucun backup de services trouvé dans src/services/"
else
  echo "Restauration des services depuis: $BACKUP_DIR"
  for svc in web-cloud.email-domain web-cloud.email-pro web-cloud.exchange web-cloud.office web-cloud.zimbra; do
    if [ -f "$BACKUP_DIR/${svc}.ts" ]; then
      cp "$BACKUP_DIR/${svc}.ts" "src/services/${svc}.ts"
      echo "✅ Restauré: src/services/${svc}.ts"
    fi
  done
fi

# Restaurer les index.tsx
echo ""
echo "Restauration des index.tsx..."

for mod in email-domain email-pro exchange office zimbra; do
  BACKUP=$(ls src/pages/web-cloud/emails/${mod}/index.tsx.* 2>/dev/null | tail -1)
  if [ -n "$BACKUP" ]; then
    cp "$BACKUP" "src/pages/web-cloud/emails/${mod}/index.tsx"
    echo "✅ Restauré: emails/${mod}/index.tsx"
  fi
done

# Page parente
BACKUP=$(ls src/pages/web-cloud/emails/index.tsx.* 2>/dev/null | tail -1)
if [ -n "$BACKUP" ]; then
  cp "$BACKUP" "src/pages/web-cloud/emails/index.tsx"
  echo "✅ Restauré: emails/index.tsx"
fi

# Supprimer les nouveaux services de page
echo ""
echo "Suppression des services de page créés..."
rm -f src/pages/web-cloud/emails/emailsPage.service.ts
rm -f src/pages/web-cloud/emails/email-domain/emailDomainPage.service.ts
rm -f src/pages/web-cloud/emails/email-pro/emailProPage.service.ts
rm -f src/pages/web-cloud/emails/exchange/exchangePage.service.ts
rm -f src/pages/web-cloud/emails/office/officePage.service.ts
rm -f src/pages/web-cloud/emails/zimbra/zimbraPage.service.ts
echo "✅ Services de page supprimés"

echo ""
echo "=============================================="
echo "=== ROLLBACK TERMINÉ ==="
echo "=============================================="
echo ""
echo "Lancer le build pour vérifier:"
echo "  cd $FRONTEND_DIR && npm run build:dev"
