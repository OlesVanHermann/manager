#!/bin/bash
set -e

# ============================================================================
# new_generate_manager_tars.sh
# Génère des archives tar granulaires du new_manager (React/Vite)
# Répertoire de travail : /home/ubuntu/aiapp/frontend
# ============================================================================

cd /home/ubuntu/aiapp/frontend

echo "=== Suppression des anciens tars new_manager ==="
rm -f /home/ubuntu/new_manager.*.tar

echo "=== Génération des tars new_manager ==="

# ----------------------------------------------------------------------------
# CORE - Config globale, design-system, lib, services
# ----------------------------------------------------------------------------
echo "[CORE] new_manager.core.tar"
tar -cf /home/ubuntu/new_manager.core.tar \
  ./src/design-system \
  ./src/lib \
  ./src/services \
  ./src/contexts \
  ./src/hooks \
  ./src/types \
  ./src/i18n \
  ./src/App.tsx \
  ./src/main.tsx \
  ./src/index.css \
  ./vite.config.ts \
  ./package.json

# ----------------------------------------------------------------------------
# HOME
# ----------------------------------------------------------------------------
echo "[HOME] new_manager.home.core.tar"
tar -cf /home/ubuntu/new_manager.home.core.tar \
  ./src/pages/home/index.tsx \
  ./src/pages/home/styles.css \
  ./src/pages/home/utils.ts \
  ./src/pages/home/useHomeData.ts \
  ./src/pages/home/components

echo "[HOME] new_manager.home.account.tar"
tar -cf /home/ubuntu/new_manager.home.account.tar \
  ./src/pages/home/account

echo "[HOME] new_manager.home.api.tar"
tar -cf /home/ubuntu/new_manager.home.api.tar \
  ./src/pages/home/api

echo "[HOME] new_manager.home.billing.tar"
tar -cf /home/ubuntu/new_manager.home.billing.tar \
  ./src/pages/home/billing

echo "[HOME] new_manager.home.carbon.tar"
tar -cf /home/ubuntu/new_manager.home.carbon.tar \
  ./src/pages/home/carbon

echo "[HOME] new_manager.home.support.tar"
tar -cf /home/ubuntu/new_manager.home.support.tar \
  ./src/pages/home/support

# ----------------------------------------------------------------------------
# BARE-METAL
# ----------------------------------------------------------------------------
echo "[BARE-METAL] new_manager.bare-metal.core.tar"
tar -cf /home/ubuntu/new_manager.bare-metal.core.tar \
  ./src/pages/bare-metal/index.tsx \
  ./src/pages/bare-metal/styles.css

echo "[BARE-METAL] new_manager.bare-metal.dedicated.tar"
tar -cf /home/ubuntu/new_manager.bare-metal.dedicated.tar \
  ./src/pages/bare-metal/dedicated

echo "[BARE-METAL] new_manager.bare-metal.housing.tar"
tar -cf /home/ubuntu/new_manager.bare-metal.housing.tar \
  ./src/pages/bare-metal/housing

echo "[BARE-METAL] new_manager.bare-metal.vps.tar"
tar -cf /home/ubuntu/new_manager.bare-metal.vps.tar \
  ./src/pages/bare-metal/vps

echo "[BARE-METAL] new_manager.bare-metal.nasha.tar"
tar -cf /home/ubuntu/new_manager.bare-metal.nasha.tar \
  ./src/pages/bare-metal/nasha

echo "[BARE-METAL] new_manager.bare-metal.netapp.tar"
tar -cf /home/ubuntu/new_manager.bare-metal.netapp.tar \
  ./src/pages/bare-metal/netapp

# ----------------------------------------------------------------------------
# PRIVATE-CLOUD
# ----------------------------------------------------------------------------
echo "[PRIVATE-CLOUD] new_manager.private-cloud.core.tar"
tar -cf /home/ubuntu/new_manager.private-cloud.core.tar \
  ./src/pages/private-cloud/index.tsx \
  ./src/pages/private-cloud/styles.css

echo "[PRIVATE-CLOUD] new_manager.private-cloud.nutanix.tar"
tar -cf /home/ubuntu/new_manager.private-cloud.nutanix.tar \
  ./src/pages/private-cloud/nutanix

echo "[PRIVATE-CLOUD] new_manager.private-cloud.vmware.tar"
tar -cf /home/ubuntu/new_manager.private-cloud.vmware.tar \
  ./src/pages/private-cloud/vmware

echo "[PRIVATE-CLOUD] new_manager.private-cloud.veeam.tar"
tar -cf /home/ubuntu/new_manager.private-cloud.veeam.tar \
  ./src/pages/private-cloud/veeam

echo "[PRIVATE-CLOUD] new_manager.private-cloud.sap.tar"
tar -cf /home/ubuntu/new_manager.private-cloud.sap.tar \
  ./src/pages/private-cloud/sap

echo "[PRIVATE-CLOUD] new_manager.private-cloud.managed-baremetal.tar"
tar -cf /home/ubuntu/new_manager.private-cloud.managed-baremetal.tar \
  ./src/pages/private-cloud/managed-baremetal

# ----------------------------------------------------------------------------
# PUBLIC-CLOUD
# ----------------------------------------------------------------------------
echo "[PUBLIC-CLOUD] new_manager.public-cloud.core.tar"
tar -cf /home/ubuntu/new_manager.public-cloud.core.tar \
  ./src/pages/public-cloud/index.tsx \
  ./src/pages/public-cloud/styles.css

echo "[PUBLIC-CLOUD] new_manager.public-cloud.project.tar"
tar -cf /home/ubuntu/new_manager.public-cloud.project.tar \
  ./src/pages/public-cloud/project

echo "[PUBLIC-CLOUD] new_manager.public-cloud.instances.tar"
tar -cf /home/ubuntu/new_manager.public-cloud.instances.tar \
  ./src/pages/public-cloud/instances

echo "[PUBLIC-CLOUD] new_manager.public-cloud.kubernetes.tar"
tar -cf /home/ubuntu/new_manager.public-cloud.kubernetes.tar \
  ./src/pages/public-cloud/kubernetes

echo "[PUBLIC-CLOUD] new_manager.public-cloud.databases.tar"
tar -cf /home/ubuntu/new_manager.public-cloud.databases.tar \
  ./src/pages/public-cloud/databases

echo "[PUBLIC-CLOUD] new_manager.public-cloud.block-storage.tar"
tar -cf /home/ubuntu/new_manager.public-cloud.block-storage.tar \
  ./src/pages/public-cloud/block-storage

echo "[PUBLIC-CLOUD] new_manager.public-cloud.object-storage.tar"
tar -cf /home/ubuntu/new_manager.public-cloud.object-storage.tar \
  ./src/pages/public-cloud/object-storage

echo "[PUBLIC-CLOUD] new_manager.public-cloud.registry.tar"
tar -cf /home/ubuntu/new_manager.public-cloud.registry.tar \
  ./src/pages/public-cloud/registry

echo "[PUBLIC-CLOUD] new_manager.public-cloud.load-balancer.tar"
tar -cf /home/ubuntu/new_manager.public-cloud.load-balancer.tar \
  ./src/pages/public-cloud/load-balancer

echo "[PUBLIC-CLOUD] new_manager.public-cloud.ai.tar"
tar -cf /home/ubuntu/new_manager.public-cloud.ai.tar \
  ./src/pages/public-cloud/ai

# ----------------------------------------------------------------------------
# WEB-CLOUD (inclut shared du domaine parent)
# ----------------------------------------------------------------------------
echo "[WEB-CLOUD] new_manager.web-cloud.core.tar"
tar -cf /home/ubuntu/new_manager.web-cloud.core.tar \
  ./src/pages/web-cloud/index.tsx \
  ./src/pages/web-cloud/styles.css \
  ./src/pages/web-cloud/shared

echo "[WEB-CLOUD] new_manager.web-cloud.domains.tar"
tar -cf /home/ubuntu/new_manager.web-cloud.domains.tar \
  ./src/pages/web-cloud/domains \
  ./src/pages/web-cloud/shared

echo "[WEB-CLOUD] new_manager.web-cloud.hebergement.tar"
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.tar \
  ./src/pages/web-cloud/hebergement \
  ./src/pages/web-cloud/shared

echo "[WEB-CLOUD] new_manager.web-cloud.emails.tar"
tar -cf /home/ubuntu/new_manager.web-cloud.emails.tar \
  ./src/pages/web-cloud/emails \
  ./src/pages/web-cloud/shared

echo "[WEB-CLOUD] new_manager.web-cloud.telecom.tar"
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.tar \
  ./src/pages/web-cloud/telecom \
  ./src/pages/web-cloud/shared

echo "[WEB-CLOUD] new_manager.web-cloud.access.tar"
tar -cf /home/ubuntu/new_manager.web-cloud.access.tar \
  ./src/pages/web-cloud/access \
  ./src/pages/web-cloud/shared

# ----------------------------------------------------------------------------
# NETWORK
# ----------------------------------------------------------------------------
echo "[NETWORK] new_manager.network.core.tar"
tar -cf /home/ubuntu/new_manager.network.core.tar \
  ./src/pages/network/index.tsx \
  ./src/pages/network/styles.css

echo "[NETWORK] new_manager.network.vrack.tar"
tar -cf /home/ubuntu/new_manager.network.vrack.tar \
  ./src/pages/network/vrack

echo "[NETWORK] new_manager.network.vrack-services.tar"
tar -cf /home/ubuntu/new_manager.network.vrack-services.tar \
  ./src/pages/network/vrack-services

echo "[NETWORK] new_manager.network.cloud-connect.tar"
tar -cf /home/ubuntu/new_manager.network.cloud-connect.tar \
  ./src/pages/network/cloud-connect

echo "[NETWORK] new_manager.network.ip.tar"
tar -cf /home/ubuntu/new_manager.network.ip.tar \
  ./src/pages/network/ip

echo "[NETWORK] new_manager.network.load-balancer.tar"
tar -cf /home/ubuntu/new_manager.network.load-balancer.tar \
  ./src/pages/network/load-balancer

echo "[NETWORK] new_manager.network.cdn.tar"
tar -cf /home/ubuntu/new_manager.network.cdn.tar \
  ./src/pages/network/cdn

echo "[NETWORK] new_manager.network.security.tar"
tar -cf /home/ubuntu/new_manager.network.security.tar \
  ./src/pages/network/security

# ----------------------------------------------------------------------------
# IAM
# ----------------------------------------------------------------------------
echo "[IAM] new_manager.iam.core.tar"
tar -cf /home/ubuntu/new_manager.iam.core.tar \
  ./src/pages/iam/index.tsx \
  ./src/pages/iam/styles.css \
  ./src/pages/iam/utils.tsx \
  ./src/pages/iam/components \
  ./src/pages/iam/tabs

echo "[IAM] new_manager.iam.okms.tar"
tar -cf /home/ubuntu/new_manager.iam.okms.tar \
  ./src/pages/iam/okms

echo "[IAM] new_manager.iam.dbaas-logs.tar"
tar -cf /home/ubuntu/new_manager.iam.dbaas-logs.tar \
  ./src/pages/iam/dbaas-logs

echo "[IAM] new_manager.iam.metrics.tar"
tar -cf /home/ubuntu/new_manager.iam.metrics.tar \
  ./src/pages/iam/metrics

echo "[IAM] new_manager.iam.hsm.tar"
tar -cf /home/ubuntu/new_manager.iam.hsm.tar \
  ./src/pages/iam/hsm

echo "[IAM] new_manager.iam.secret.tar"
tar -cf /home/ubuntu/new_manager.iam.secret.tar \
  ./src/pages/iam/secret

echo "[IAM] new_manager.iam.logs.tar"
tar -cf /home/ubuntu/new_manager.iam.logs.tar \
  ./src/pages/iam/logs

# ----------------------------------------------------------------------------
# LICENSE
# ----------------------------------------------------------------------------
echo "[LICENSE] new_manager.license.core.tar"
tar -cf /home/ubuntu/new_manager.license.core.tar \
  ./src/pages/license/index.tsx \
  ./src/pages/license/styles.css

echo "[LICENSE] new_manager.license.cloudlinux.tar"
tar -cf /home/ubuntu/new_manager.license.cloudlinux.tar \
  ./src/pages/license/cloudlinux

echo "[LICENSE] new_manager.license.cpanel.tar"
tar -cf /home/ubuntu/new_manager.license.cpanel.tar \
  ./src/pages/license/cpanel

echo "[LICENSE] new_manager.license.directadmin.tar"
tar -cf /home/ubuntu/new_manager.license.directadmin.tar \
  ./src/pages/license/directadmin

echo "[LICENSE] new_manager.license.plesk.tar"
tar -cf /home/ubuntu/new_manager.license.plesk.tar \
  ./src/pages/license/plesk

echo "[LICENSE] new_manager.license.sqlserver.tar"
tar -cf /home/ubuntu/new_manager.license.sqlserver.tar \
  ./src/pages/license/sqlserver

echo "[LICENSE] new_manager.license.virtuozzo.tar"
tar -cf /home/ubuntu/new_manager.license.virtuozzo.tar \
  ./src/pages/license/virtuozzo

echo "[LICENSE] new_manager.license.windows.tar"
tar -cf /home/ubuntu/new_manager.license.windows.tar \
  ./src/pages/license/windows

# ----------------------------------------------------------------------------
# ALL - Archive complète
# ----------------------------------------------------------------------------
echo "[ALL] new_manager.all.tar"
tar -cf /home/ubuntu/new_manager.all.tar \
  ./src \
  ./public \
  ./vite.config.ts \
  ./package.json

# ----------------------------------------------------------------------------
# Résumé
# ----------------------------------------------------------------------------
echo ""
echo "=== Tars générés ==="
ls -lh /home/ubuntu/new_manager.*.tar | awk '{print $9, $5}'
echo ""
echo "Total: $(ls /home/ubuntu/new_manager.*.tar | wc -l) archives"
