#!/bin/bash
set -e

# ============================================================================
# old_generate_manager_tars.sh
# Génère des archives tar granulaires du old_manager (Angular monorepo)
# Répertoire de travail : /home/ubuntu/manager
# ============================================================================

cd /home/ubuntu/manager

# Exclusions communes pour réduire la taille des archives
EXCLUDES="--exclude=node_modules --exclude=.git --exclude=dist --exclude=coverage --exclude=*.lock --exclude=yarn.lock --exclude=package-lock.json --exclude=*.map --exclude=.cache"

echo "=== Suppression des anciens tars old_manager ==="
rm -f /home/ubuntu/old_manager.*.tar

echo "=== Génération des tars old_manager ==="

# ----------------------------------------------------------------------------
# CORE - Modules communs, composants, config
# ----------------------------------------------------------------------------
echo "[CORE] old_manager.core.tar"
tar -cf /home/ubuntu/old_manager.core.tar $EXCLUDES \
  ./packages/manager/modules/core \
  ./packages/manager/modules/config \
  ./packages/manager/modules/manager-components \
  ./packages/manager/modules/common-api \
  ./packages/manager/modules/common-translations \
  ./packages/components/ovh-reket \
  ./packages/components/ovh-at-internet

# ----------------------------------------------------------------------------
# HOME
# ----------------------------------------------------------------------------
echo "[HOME] old_manager.home.core.tar"
tar -cf /home/ubuntu/old_manager.home.core.tar $EXCLUDES \
  ./packages/manager/apps/hub

echo "[HOME] old_manager.home.account.tar"
tar -cf /home/ubuntu/old_manager.home.account.tar $EXCLUDES \
  ./packages/manager/apps/account \
  ./packages/manager/modules/account

echo "[HOME] old_manager.home.api.tar"
tar -cf /home/ubuntu/old_manager.home.api.tar $EXCLUDES \
  ./packages/manager/apps/hub

echo "[HOME] old_manager.home.billing.tar"
tar -cf /home/ubuntu/old_manager.home.billing.tar $EXCLUDES \
  ./packages/manager/apps/billing \
  ./packages/manager/modules/billing \
  ./packages/manager/modules/billing-components

echo "[HOME] old_manager.home.carbon.tar"
tar -cf /home/ubuntu/old_manager.home.carbon.tar $EXCLUDES \
  ./packages/manager/apps/carbon-calculator \
  ./packages/manager/modules/carbon-calculator

echo "[HOME] old_manager.home.support.tar"
tar -cf /home/ubuntu/old_manager.home.support.tar $EXCLUDES \
  ./packages/manager/apps/support \
  ./packages/manager/modules/support

# ----------------------------------------------------------------------------
# BARE-METAL
# ----------------------------------------------------------------------------
echo "[BARE-METAL] old_manager.bare-metal.core.tar"
tar -cf /home/ubuntu/old_manager.bare-metal.core.tar $EXCLUDES \
  ./packages/manager/apps/dedicated \
  ./packages/manager/modules/bm-server-components

echo "[BARE-METAL] old_manager.bare-metal.dedicated.tar"
tar -cf /home/ubuntu/old_manager.bare-metal.dedicated.tar $EXCLUDES \
  ./packages/manager/apps/dedicated \
  ./packages/manager/apps/dedicated-servers \
  ./packages/manager/modules/bm-server-components

echo "[BARE-METAL] old_manager.bare-metal.housing.tar"
tar -cf /home/ubuntu/old_manager.bare-metal.housing.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "[BARE-METAL] old_manager.bare-metal.vps.tar"
tar -cf /home/ubuntu/old_manager.bare-metal.vps.tar $EXCLUDES \
  ./packages/manager/apps/vps \
  ./packages/manager/modules/vps

echo "[BARE-METAL] old_manager.bare-metal.nasha.tar"
tar -cf /home/ubuntu/old_manager.bare-metal.nasha.tar $EXCLUDES \
  ./packages/manager/apps/nasha \
  ./packages/manager/modules/nasha

echo "[BARE-METAL] old_manager.bare-metal.netapp.tar"
tar -cf /home/ubuntu/old_manager.bare-metal.netapp.tar $EXCLUDES \
  ./packages/manager/apps/netapp \
  ./packages/manager/modules/netapp

# ----------------------------------------------------------------------------
# PRIVATE-CLOUD
# ----------------------------------------------------------------------------
echo "[PRIVATE-CLOUD] old_manager.private-cloud.core.tar"
tar -cf /home/ubuntu/old_manager.private-cloud.core.tar $EXCLUDES \
  ./packages/manager/apps/nutanix \
  ./packages/manager/modules/nutanix

echo "[PRIVATE-CLOUD] old_manager.private-cloud.nutanix.tar"
tar -cf /home/ubuntu/old_manager.private-cloud.nutanix.tar $EXCLUDES \
  ./packages/manager/apps/nutanix \
  ./packages/manager/modules/nutanix

echo "[PRIVATE-CLOUD] old_manager.private-cloud.vmware.tar"
tar -cf /home/ubuntu/old_manager.private-cloud.vmware.tar $EXCLUDES \
  ./packages/manager/apps/hpc-vmware-vsphere

echo "[PRIVATE-CLOUD] old_manager.private-cloud.veeam.tar"
tar -cf /home/ubuntu/old_manager.private-cloud.veeam.tar $EXCLUDES \
  ./packages/manager/apps/veeam-enterprise \
  ./packages/manager/modules/veeam-enterprise

echo "[PRIVATE-CLOUD] old_manager.private-cloud.sap.tar"
tar -cf /home/ubuntu/old_manager.private-cloud.sap.tar $EXCLUDES \
  ./packages/manager/apps/sap-features-hub

echo "[PRIVATE-CLOUD] old_manager.private-cloud.managed-baremetal.tar"
tar -cf /home/ubuntu/old_manager.private-cloud.managed-baremetal.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

# ----------------------------------------------------------------------------
# PUBLIC-CLOUD
# ----------------------------------------------------------------------------
echo "[PUBLIC-CLOUD] old_manager.public-cloud.core.tar"
tar -cf /home/ubuntu/old_manager.public-cloud.core.tar $EXCLUDES \
  ./packages/manager/apps/public-cloud \
  ./packages/manager/modules/pci \
  ./packages/manager/modules/manager-pci-common

echo "[PUBLIC-CLOUD] old_manager.public-cloud.project.tar"
tar -cf /home/ubuntu/old_manager.public-cloud.project.tar $EXCLUDES \
  ./packages/manager/apps/public-cloud \
  ./packages/manager/modules/pci

echo "[PUBLIC-CLOUD] old_manager.public-cloud.instances.tar"
tar -cf /home/ubuntu/old_manager.public-cloud.instances.tar $EXCLUDES \
  ./packages/manager/apps/pci-instances

echo "[PUBLIC-CLOUD] old_manager.public-cloud.kubernetes.tar"
tar -cf /home/ubuntu/old_manager.public-cloud.kubernetes.tar $EXCLUDES \
  ./packages/manager/apps/pci-kubernetes

echo "[PUBLIC-CLOUD] old_manager.public-cloud.databases.tar"
tar -cf /home/ubuntu/old_manager.public-cloud.databases.tar $EXCLUDES \
  ./packages/manager/apps/pci-databases-analytics

echo "[PUBLIC-CLOUD] old_manager.public-cloud.block-storage.tar"
tar -cf /home/ubuntu/old_manager.public-cloud.block-storage.tar $EXCLUDES \
  ./packages/manager/apps/pci-block-storage

echo "[PUBLIC-CLOUD] old_manager.public-cloud.object-storage.tar"
tar -cf /home/ubuntu/old_manager.public-cloud.object-storage.tar $EXCLUDES \
  ./packages/manager/apps/pci-object-storage

echo "[PUBLIC-CLOUD] old_manager.public-cloud.registry.tar"
tar -cf /home/ubuntu/old_manager.public-cloud.registry.tar $EXCLUDES \
  ./packages/manager/apps/pci-private-registry

echo "[PUBLIC-CLOUD] old_manager.public-cloud.load-balancer.tar"
tar -cf /home/ubuntu/old_manager.public-cloud.load-balancer.tar $EXCLUDES \
  ./packages/manager/apps/pci-load-balancer

echo "[PUBLIC-CLOUD] old_manager.public-cloud.ai.tar"
tar -cf /home/ubuntu/old_manager.public-cloud.ai.tar $EXCLUDES \
  ./packages/manager/apps/pci-ai-tools \
  ./packages/manager/apps/pci-ai-endpoints

# ----------------------------------------------------------------------------
# WEB-CLOUD
# ----------------------------------------------------------------------------
echo "[WEB-CLOUD] old_manager.web-cloud.core.tar"
tar -cf /home/ubuntu/old_manager.web-cloud.core.tar $EXCLUDES \
  ./packages/manager/apps/web \
  ./packages/manager/modules/web-universe-components

echo "[WEB-CLOUD] old_manager.web-cloud.domains.tar"
tar -cf /home/ubuntu/old_manager.web-cloud.domains.tar $EXCLUDES \
  ./packages/manager/apps/web-domains

echo "[WEB-CLOUD] old_manager.web-cloud.hebergement.tar"
tar -cf /home/ubuntu/old_manager.web-cloud.hebergement.tar $EXCLUDES \
  ./packages/manager/apps/web-hosting

echo "[WEB-CLOUD] old_manager.web-cloud.emails.tar"
tar -cf /home/ubuntu/old_manager.web-cloud.emails.tar $EXCLUDES \
  ./packages/manager/apps/exchange \
  ./packages/manager/apps/email-pro \
  ./packages/manager/apps/email-domain \
  ./packages/manager/apps/zimbra \
  ./packages/manager/apps/web-office \
  ./packages/manager/modules/exchange \
  ./packages/manager/modules/emailpro \
  ./packages/manager/modules/email-domain

echo "[WEB-CLOUD] old_manager.web-cloud.telecom.tar"
tar -cf /home/ubuntu/old_manager.web-cloud.telecom.tar $EXCLUDES \
  ./packages/manager/apps/telecom \
  ./packages/manager/apps/sms \
  ./packages/manager/apps/carrier-sip \
  ./packages/manager/apps/freefax \
  ./packages/manager/modules/sms \
  ./packages/manager/modules/carrier-sip \
  ./packages/manager/modules/freefax \
  ./packages/manager/modules/telecom-universe-components

echo "[WEB-CLOUD] old_manager.web-cloud.access.tar"
tar -cf /home/ubuntu/old_manager.web-cloud.access.tar $EXCLUDES \
  ./packages/manager/apps/telecom \
  ./packages/manager/apps/overthebox \
  ./packages/manager/modules/overthebox

# ----------------------------------------------------------------------------
# NETWORK
# ----------------------------------------------------------------------------
echo "[NETWORK] old_manager.network.core.tar"
tar -cf /home/ubuntu/old_manager.network.core.tar $EXCLUDES \
  ./packages/manager/apps/vrack \
  ./packages/manager/modules/vrack \
  ./packages/manager/modules/network-common

echo "[NETWORK] old_manager.network.vrack.tar"
tar -cf /home/ubuntu/old_manager.network.vrack.tar $EXCLUDES \
  ./packages/manager/apps/vrack \
  ./packages/manager/modules/vrack

echo "[NETWORK] old_manager.network.vrack-services.tar"
tar -cf /home/ubuntu/old_manager.network.vrack-services.tar $EXCLUDES \
  ./packages/manager/apps/vrack-services

echo "[NETWORK] old_manager.network.cloud-connect.tar"
tar -cf /home/ubuntu/old_manager.network.cloud-connect.tar $EXCLUDES \
  ./packages/manager/apps/cloud-connect \
  ./packages/manager/modules/cloud-connect

echo "[NETWORK] old_manager.network.ip.tar"
tar -cf /home/ubuntu/old_manager.network.ip.tar $EXCLUDES \
  ./packages/manager/apps/ips

echo "[NETWORK] old_manager.network.load-balancer.tar"
tar -cf /home/ubuntu/old_manager.network.load-balancer.tar $EXCLUDES \
  ./packages/manager/apps/iplb \
  ./packages/manager/modules/iplb

echo "[NETWORK] old_manager.network.cdn.tar"
tar -cf /home/ubuntu/old_manager.network.cdn.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "[NETWORK] old_manager.network.security.tar"
tar -cf /home/ubuntu/old_manager.network.security.tar $EXCLUDES \
  ./packages/manager/apps/ips

# ----------------------------------------------------------------------------
# IAM
# ----------------------------------------------------------------------------
echo "[IAM] old_manager.iam.core.tar"
tar -cf /home/ubuntu/old_manager.iam.core.tar $EXCLUDES \
  ./packages/manager/apps/iam \
  ./packages/manager/modules/iam

echo "[IAM] old_manager.iam.okms.tar"
tar -cf /home/ubuntu/old_manager.iam.okms.tar $EXCLUDES \
  ./packages/manager/apps/okms

echo "[IAM] old_manager.iam.dbaas-logs.tar"
tar -cf /home/ubuntu/old_manager.iam.dbaas-logs.tar $EXCLUDES \
  ./packages/manager/apps/dbaas-logs \
  ./packages/manager/modules/dbaas-logs

echo "[IAM] old_manager.iam.metrics.tar"
tar -cf /home/ubuntu/old_manager.iam.metrics.tar $EXCLUDES \
  ./packages/manager/apps/metrics \
  ./packages/manager/modules/metrics

echo "[IAM] old_manager.iam.hsm.tar"
tar -cf /home/ubuntu/old_manager.iam.hsm.tar $EXCLUDES \
  ./packages/manager/apps/iam

echo "[IAM] old_manager.iam.secret.tar"
tar -cf /home/ubuntu/old_manager.iam.secret.tar $EXCLUDES \
  ./packages/manager/apps/iam

echo "[IAM] old_manager.iam.logs.tar"
tar -cf /home/ubuntu/old_manager.iam.logs.tar $EXCLUDES \
  ./packages/manager/modules/logs-to-customer \
  ./packages/manager/modules/log-to-customer

# ----------------------------------------------------------------------------
# LICENSE (inclus dans dedicated/web)
# ----------------------------------------------------------------------------
echo "[LICENSE] old_manager.license.core.tar"
tar -cf /home/ubuntu/old_manager.license.core.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "[LICENSE] old_manager.license.cloudlinux.tar"
tar -cf /home/ubuntu/old_manager.license.cloudlinux.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "[LICENSE] old_manager.license.cpanel.tar"
tar -cf /home/ubuntu/old_manager.license.cpanel.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "[LICENSE] old_manager.license.directadmin.tar"
tar -cf /home/ubuntu/old_manager.license.directadmin.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "[LICENSE] old_manager.license.plesk.tar"
tar -cf /home/ubuntu/old_manager.license.plesk.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "[LICENSE] old_manager.license.sqlserver.tar"
tar -cf /home/ubuntu/old_manager.license.sqlserver.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "[LICENSE] old_manager.license.virtuozzo.tar"
tar -cf /home/ubuntu/old_manager.license.virtuozzo.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "[LICENSE] old_manager.license.windows.tar"
tar -cf /home/ubuntu/old_manager.license.windows.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

# ----------------------------------------------------------------------------
# ALL - Archive complète
# ----------------------------------------------------------------------------
echo "[ALL] old_manager.all.tar"
tar -cf /home/ubuntu/old_manager.all.tar $EXCLUDES \
  ./packages/manager

# ----------------------------------------------------------------------------
# Résumé
# ----------------------------------------------------------------------------
echo ""
echo "=== Tars générés ==="
ls -lh /home/ubuntu/old_manager.*.tar | awk '{print $9, $5}'
echo ""
echo "Total: $(ls /home/ubuntu/old_manager.*.tar | wc -l) archives"
