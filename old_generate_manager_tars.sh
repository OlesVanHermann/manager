#!/bin/bash
set -e

# Configuration
OLD_MANAGER_DIR="/home/ubuntu/manager"
OUTPUT_DIR="/home/ubuntu"

echo "=========================================="
echo "Génération des tars old_manager"
echo "=========================================="

# Nettoyage des anciens tars
echo ""
echo "[CLEAN] Suppression des anciens tars old_manager..."
rm -f /home/ubuntu/old_manager_*.tar
echo "[CLEAN] OK"

cd "$OLD_MANAGER_DIR"
echo "[INFO] Répertoire de travail: $(pwd)"

# Fonction pour créer un tar et vérifier qu'il n'est pas vide
create_tar() {
    local tar_name="$1"
    shift
    local paths=("$@")
    
    echo ""
    echo "[TAR] Création de $tar_name..."
    
    # Filtrer les chemins qui existent
    local existing_paths=()
    for p in "${paths[@]}"; do
        if [ -e "$p" ]; then
            existing_paths+=("$p")
        else
            echo "  [WARN] Chemin inexistant ignoré: $p"
        fi
    done
    
    if [ ${#existing_paths[@]} -eq 0 ]; then
        echo "  [ERROR] Aucun chemin valide pour $tar_name"
        return 1
    fi
    
    tar -cf "$OUTPUT_DIR/$tar_name" "${existing_paths[@]}"
    
    local size=$(stat -c%s "$OUTPUT_DIR/$tar_name")
    local count=$(tar -tf "$OUTPUT_DIR/$tar_name" | wc -l)
    
    if [ "$count" -eq 0 ]; then
        echo "  [ERROR] Tar vide: $tar_name"
        rm -f "$OUTPUT_DIR/$tar_name"
        return 1
    fi
    
    echo "  [OK] $tar_name: $count fichiers, $(numfmt --to=iec $size)"
}

# ============================================
# 1. old_manager_core.tar
# ============================================
create_tar "old_manager_core.tar" \
    package.json \
    yarn.lock \
    lerna.json \
    turbo.json \
    babel.config.json \
    playwright.config.ts \
    Makefile \
    README.md \
    CONTRIBUTING.md \
    LICENSE \
    AUTHORS \
    CONTRIBUTORS \
    MAINTAINERS \
    SECURITY.md \
    .eslintrc.js \
    .eslintignore \
    .prettierrc.json \
    .prettierignore \
    .stylelintrc.json \
    .stylelintignore \
    .editorconfig \
    .nvmrc \
    .npmrc \
    .gitignore \
    .gitattributes \
    .huskyrc.json \
    .lintstagedrc.json \
    .commitlintrc.js \
    .htmlhintrc \
    .remarkrc \
    .remarkignore \
    .sonarcloud.properties \
    .husky \
    .github \
    packages/components \
    packages/manager/modules/manager-components \
    packages/manager/modules/common-translations \
    scripts \
    docs \
    jest \
    playwright-helpers

# ============================================
# 2. old_manager_pci.tar (tous les PCI)
# ============================================
create_tar "old_manager_pci.tar" \
    packages/manager/apps/pci \
    packages/manager/apps/pci-ai-endpoints \
    packages/manager/apps/pci-ai-tools \
    packages/manager/apps/pci-billing \
    packages/manager/apps/pci-block-storage \
    packages/manager/apps/pci-cold-archive \
    packages/manager/apps/pci-contacts \
    packages/manager/apps/pci-databases-analytics \
    packages/manager/apps/pci-dataplatform \
    packages/manager/apps/pci-gateway \
    packages/manager/apps/pci-instances \
    packages/manager/apps/pci-kubernetes \
    packages/manager/apps/pci-load-balancer \
    packages/manager/apps/pci-object-storage \
    packages/manager/apps/pci-private-network \
    packages/manager/apps/pci-private-registry \
    packages/manager/apps/pci-public-ip \
    packages/manager/apps/pci-quota \
    packages/manager/apps/pci-rancher \
    packages/manager/apps/pci-savings-plan \
    packages/manager/apps/pci-ssh-keys \
    packages/manager/apps/pci-users \
    packages/manager/apps/pci-volume-backup \
    packages/manager/apps/pci-volume-snapshot \
    packages/manager/apps/pci-vouchers \
    packages/manager/apps/pci-workflow \
    packages/manager/apps/public-cloud \
    packages/manager/modules/pci \
    packages/manager/modules/manager-pci-common

# ============================================
# 3. old_manager_dedicated.tar
# ============================================
create_tar "old_manager_dedicated.tar" \
    packages/manager/apps/dedicated \
    packages/manager/apps/dedicated-servers \
    packages/manager/modules/bm-server-components

# ============================================
# 4. old_manager_telecom.tar
# ============================================
create_tar "old_manager_telecom.tar" \
    packages/manager/apps/telecom \
    packages/manager/apps/telecom-dashboard \
    packages/manager/apps/telecom-task \
    packages/manager/apps/sms \
    packages/manager/apps/freefax \
    packages/manager/apps/overthebox \
    packages/manager/apps/carrier-sip \
    packages/manager/modules/telecom-universe-components \
    packages/manager/modules/sms \
    packages/manager/modules/overthebox

# ============================================
# 5. old_manager_web.tar
# ============================================
create_tar "old_manager_web.tar" \
    packages/manager/apps/web \
    packages/manager/apps/web-domains \
    packages/manager/apps/web-hosting \
    packages/manager/apps/web-office \
    packages/manager/apps/web-ongoing-operations \
    packages/manager/apps/email-domain \
    packages/manager/apps/email-pro \
    packages/manager/apps/exchange \
    packages/manager/apps/zimbra \
    packages/manager/modules/web-universe-components \
    packages/manager/modules/email-domain \
    packages/manager/modules/emailpro \
    packages/manager/modules/exchange

# ============================================
# 6. old_manager_account.tar
# ============================================
create_tar "old_manager_account.tar" \
    packages/manager/apps/account \
    packages/manager/apps/account-creation \
    packages/manager/apps/billing \
    packages/manager/apps/sign-up \
    packages/manager/apps/procedures \
    packages/manager/apps/support \
    packages/manager/apps/order-tracking \
    packages/manager/modules/account \
    packages/manager/modules/billing \
    packages/manager/modules/billing-components \
    packages/manager/modules/support

# ============================================
# 7. old_manager_hub.tar
# ============================================
create_tar "old_manager_hub.tar" \
    packages/manager/apps/hub \
    packages/manager/apps/container \
    packages/manager/apps/catalog \
    packages/manager/apps/carbon-calculator \
    packages/manager/apps/restricted \
    packages/manager/apps/cloud-shell \
    packages/manager/modules/manager-components \
    packages/manager/modules/cloud-styles \
    packages/manager/modules/cloud-universe-components

# ============================================
# 8. old_manager_network.tar
# ============================================
create_tar "old_manager_network.tar" \
    packages/manager/apps/ips \
    packages/manager/apps/vrack \
    packages/manager/apps/vrack-services \
    packages/manager/apps/cloud-connect \
    packages/manager/apps/iplb \
    packages/manager/modules/vrack \
    packages/manager/modules/cloud-connect \
    packages/manager/modules/iplb

# ============================================
# 9. old_manager_pci.kubernetes.tar
# ============================================
create_tar "old_manager_pci.kubernetes.tar" \
    packages/manager/apps/pci-kubernetes \
    packages/manager/apps/pci-rancher

# ============================================
# 10. old_manager_pci.databases.tar
# ============================================
create_tar "old_manager_pci.databases.tar" \
    packages/manager/apps/pci-databases-analytics \
    packages/manager/apps/pci-dataplatform

# ============================================
# 11. old_manager_pci.ai.tar
# ============================================
create_tar "old_manager_pci.ai.tar" \
    packages/manager/apps/pci-ai-tools \
    packages/manager/apps/pci-ai-endpoints

# ============================================
# 12. old_manager_pci.storage.tar
# ============================================
create_tar "old_manager_pci.storage.tar" \
    packages/manager/apps/pci-object-storage \
    packages/manager/apps/pci-block-storage \
    packages/manager/apps/pci-cold-archive \
    packages/manager/apps/pci-volume-backup \
    packages/manager/apps/pci-volume-snapshot

# ============================================
# 13. old_manager_pci.network.tar
# ============================================
create_tar "old_manager_pci.network.tar" \
    packages/manager/apps/pci-load-balancer \
    packages/manager/apps/pci-gateway \
    packages/manager/apps/pci-private-network \
    packages/manager/apps/pci-public-ip

# ============================================
# 14. old_manager_all.tar (TOUT)
# ============================================
echo ""
echo "[TAR] Création de old_manager_all.tar (complet)..."
tar -cf "$OUTPUT_DIR/old_manager_all.tar" .
size=$(stat -c%s "$OUTPUT_DIR/old_manager_all.tar")
count=$(tar -tf "$OUTPUT_DIR/old_manager_all.tar" | wc -l)
echo "  [OK] old_manager_all.tar: $count fichiers, $(numfmt --to=iec $size)"

# ============================================
# Résumé final
# ============================================
echo ""
echo "=========================================="
echo "RÉSUMÉ"
echo "=========================================="
ls -lh /home/ubuntu/old_manager_*.tar | awk '{print $9 ": " $5}'
echo ""
echo "Total: $(ls /home/ubuntu/old_manager_*.tar | wc -l) tars créés"
echo "=========================================="
