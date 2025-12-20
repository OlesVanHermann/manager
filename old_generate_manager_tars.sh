#!/bin/bash
set -e

cd /home/ubuntu/manager

# Suppression des anciens tars old_manager UNIQUEMENT
rm -f /home/ubuntu/old_manager.*.tar

# Exclusions communes
EXCLUDES="--exclude=node_modules --exclude=.git --exclude=dist --exclude=coverage --exclude=*.lock --exclude=yarn.lock --exclude=package-lock.json --exclude=*.map --exclude=.cache"

echo "=== Génération des tars old_manager ==="

# ============================================================
# CORE
# ============================================================
echo "Generating old_manager.core.tar..."
tar -cf /home/ubuntu/old_manager.core.tar $EXCLUDES \
  ./packages/components \
  ./packages/manager/modules/core \
  ./packages/manager/modules/config \
  ./packages/manager/modules/common-api \
  ./packages/manager/modules/common-translations \
  ./packages/manager/modules/manager-components \
  ./packages/manager/modules/error-page \
  ./package.json \
  ./lerna.json

# ============================================================
# HOME
# ============================================================
echo "Generating old_manager.home.core.tar..."
tar -cf /home/ubuntu/old_manager.home.core.tar $EXCLUDES \
  ./packages/manager/apps/hub

echo "Generating old_manager.home.account.tar..."
tar -cf /home/ubuntu/old_manager.home.account.tar $EXCLUDES \
  ./packages/manager/modules/account \
  ./packages/manager/apps/account

echo "Generating old_manager.home.billing.tar..."
tar -cf /home/ubuntu/old_manager.home.billing.tar $EXCLUDES \
  ./packages/manager/modules/billing \
  ./packages/manager/modules/billing-components \
  ./packages/manager/modules/billing-informations \
  ./packages/manager/modules/new-billing \
  ./packages/manager/apps/billing

echo "Generating old_manager.home.support.tar..."
tar -cf /home/ubuntu/old_manager.home.support.tar $EXCLUDES \
  ./packages/manager/modules/support \
  ./packages/manager/apps/support

echo "Generating old_manager.home.api.tar..."
tar -cf /home/ubuntu/old_manager.home.api.tar $EXCLUDES \
  ./packages/manager/apps/hub

echo "Generating old_manager.home.carbon.tar..."
tar -cf /home/ubuntu/old_manager.home.carbon.tar $EXCLUDES \
  ./packages/manager/modules/carbon-calculator \
  ./packages/manager/apps/carbon-calculator

# ============================================================
# PUBLIC-CLOUD
# ============================================================
echo "Generating old_manager.public-cloud.core.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.core.tar $EXCLUDES \
  ./packages/manager/modules/pci \
  ./packages/manager/modules/pci-universe-components \
  ./packages/manager/modules/manager-pci-common \
  ./packages/manager/apps/public-cloud \
  ./packages/manager/apps/pci

echo "Generating old_manager.public-cloud.ai.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.ai.tar $EXCLUDES \
  ./packages/manager/apps/pci-ai-tools \
  ./packages/manager/apps/pci-ai-endpoints

echo "Generating old_manager.public-cloud.block-storage.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.block-storage.tar $EXCLUDES \
  ./packages/manager/apps/pci-block-storage \
  ./packages/manager/apps/pci-volume-backup \
  ./packages/manager/apps/pci-volume-snapshot

echo "Generating old_manager.public-cloud.databases.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.databases.tar $EXCLUDES \
  ./packages/manager/apps/pci-databases-analytics

echo "Generating old_manager.public-cloud.instances.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.instances.tar $EXCLUDES \
  ./packages/manager/apps/pci-instances

echo "Generating old_manager.public-cloud.kubernetes.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.kubernetes.tar $EXCLUDES \
  ./packages/manager/apps/pci-kubernetes

echo "Generating old_manager.public-cloud.load-balancer.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.load-balancer.tar $EXCLUDES \
  ./packages/manager/apps/pci-load-balancer

echo "Generating old_manager.public-cloud.object-storage.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.object-storage.tar $EXCLUDES \
  ./packages/manager/apps/pci-object-storage \
  ./packages/manager/apps/pci-cold-archive

echo "Generating old_manager.public-cloud.project.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.project.tar $EXCLUDES \
  ./packages/manager/apps/pci \
  ./packages/manager/apps/pci-billing \
  ./packages/manager/apps/pci-quota \
  ./packages/manager/apps/pci-ssh-keys \
  ./packages/manager/apps/pci-users \
  ./packages/manager/apps/pci-vouchers \
  ./packages/manager/apps/pci-private-network \
  ./packages/manager/apps/pci-gateway \
  ./packages/manager/apps/pci-public-ip

echo "Generating old_manager.public-cloud.registry.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.registry.tar $EXCLUDES \
  ./packages/manager/apps/pci-private-registry

# ============================================================
# IAM
# ============================================================
echo "Generating old_manager.iam.core.tar..."
tar -cf /home/ubuntu/old_manager.iam.core.tar $EXCLUDES \
  ./packages/manager/modules/iam \
  ./packages/manager/apps/iam \
  ./packages/manager/apps/identity-access-management

echo "Generating old_manager.iam.dbaas-logs.tar..."
tar -cf /home/ubuntu/old_manager.iam.dbaas-logs.tar $EXCLUDES \
  ./packages/manager/modules/dbaas-logs \
  ./packages/manager/apps/dbaas-logs

echo "Generating old_manager.iam.hsm.tar..."
tar -cf /home/ubuntu/old_manager.iam.hsm.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "Generating old_manager.iam.logs.tar..."
tar -cf /home/ubuntu/old_manager.iam.logs.tar $EXCLUDES \
  ./packages/manager/modules/log-to-customer \
  ./packages/manager/modules/logs-to-customer

echo "Generating old_manager.iam.metrics.tar..."
tar -cf /home/ubuntu/old_manager.iam.metrics.tar $EXCLUDES \
  ./packages/manager/modules/metrics \
  ./packages/manager/apps/metrics

echo "Generating old_manager.iam.okms.tar..."
tar -cf /home/ubuntu/old_manager.iam.okms.tar $EXCLUDES \
  ./packages/manager/apps/okms

echo "Generating old_manager.iam.secret.tar..."
tar -cf /home/ubuntu/old_manager.iam.secret.tar $EXCLUDES \
  ./packages/manager/apps/okms

# ============================================================
# WEB-CLOUD
# ============================================================
echo "Generating old_manager.web-cloud.core.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.core.tar $EXCLUDES \
  ./packages/manager/modules/web-universe-components \
  ./packages/manager/apps/web

echo "Generating old_manager.web-cloud.access.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.access.tar $EXCLUDES \
  ./packages/manager/modules/overthebox \
  ./packages/manager/apps/overthebox \
  ./packages/manager/modules/telecom-universe-components

echo "Generating old_manager.web-cloud.domains.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.domains.tar $EXCLUDES \
  ./packages/manager/apps/web-domains \
  ./packages/manager/apps/web

echo "Generating old_manager.web-cloud.emails.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.emails.tar $EXCLUDES \
  ./packages/manager/modules/emailpro \
  ./packages/manager/modules/exchange \
  ./packages/manager/modules/email-domain \
  ./packages/manager/apps/email-pro \
  ./packages/manager/apps/exchange \
  ./packages/manager/apps/email-domain

echo "Generating old_manager.web-cloud.hebergement.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.hebergement.tar $EXCLUDES \
  ./packages/manager/apps/web

echo "Generating old_manager.web-cloud.telecom.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.telecom.tar $EXCLUDES \
  ./packages/manager/modules/sms \
  ./packages/manager/modules/freefax \
  ./packages/manager/modules/carrier-sip \
  ./packages/manager/modules/telecom-universe-components \
  ./packages/manager/modules/telecom-styles \
  ./packages/manager/modules/telecom-dashboard \
  ./packages/manager/modules/telecom-task \
  ./packages/manager/apps/telecom \
  ./packages/manager/apps/telecom-dashboard \
  ./packages/manager/apps/telecom-task \
  ./packages/manager/apps/sms \
  ./packages/manager/apps/freefax \
  ./packages/manager/apps/carrier-sip

# ============================================================
# BARE-METAL
# ============================================================
echo "Generating old_manager.bare-metal.core.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.core.tar $EXCLUDES \
  ./packages/manager/modules/bm-server-components \
  ./packages/manager/apps/dedicated-servers

echo "Generating old_manager.bare-metal.dedicated.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.dedicated.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "Generating old_manager.bare-metal.housing.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.housing.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "Generating old_manager.bare-metal.nasha.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.nasha.tar $EXCLUDES \
  ./packages/manager/modules/nasha \
  ./packages/manager/apps/nasha

echo "Generating old_manager.bare-metal.netapp.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.netapp.tar $EXCLUDES \
  ./packages/manager/modules/netapp \
  ./packages/manager/apps/netapp

echo "Generating old_manager.bare-metal.vps.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.vps.tar $EXCLUDES \
  ./packages/manager/modules/vps \
  ./packages/manager/apps/vps

# ============================================================
# PRIVATE-CLOUD
# ============================================================
echo "Generating old_manager.private-cloud.core.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.core.tar $EXCLUDES \
  ./packages/manager/apps/hpc-vmware-vsphere \
  ./packages/manager/apps/hpc-vmware-public-vcf-aas

echo "Generating old_manager.private-cloud.managed-baremetal.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.managed-baremetal.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "Generating old_manager.private-cloud.nutanix.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.nutanix.tar $EXCLUDES \
  ./packages/manager/modules/nutanix \
  ./packages/manager/apps/nutanix

echo "Generating old_manager.private-cloud.sap.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.sap.tar $EXCLUDES \
  ./packages/manager/apps/sap-features-hub

echo "Generating old_manager.private-cloud.veeam.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.veeam.tar $EXCLUDES \
  ./packages/manager/modules/veeam-enterprise \
  ./packages/manager/apps/veeam-backup \
  ./packages/manager/apps/veeam-enterprise

echo "Generating old_manager.private-cloud.vmware.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.vmware.tar $EXCLUDES \
  ./packages/manager/apps/hpc-vmware-vsphere

# ============================================================
# NETWORK
# ============================================================
echo "Generating old_manager.network.core.tar..."
tar -cf /home/ubuntu/old_manager.network.core.tar $EXCLUDES \
  ./packages/manager/modules/network-common

echo "Generating old_manager.network.cdn.tar..."
tar -cf /home/ubuntu/old_manager.network.cdn.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "Generating old_manager.network.cloud-connect.tar..."
tar -cf /home/ubuntu/old_manager.network.cloud-connect.tar $EXCLUDES \
  ./packages/manager/modules/cloud-connect \
  ./packages/manager/apps/cloud-connect

echo "Generating old_manager.network.ip.tar..."
tar -cf /home/ubuntu/old_manager.network.ip.tar $EXCLUDES \
  ./packages/manager/apps/ips

echo "Generating old_manager.network.load-balancer.tar..."
tar -cf /home/ubuntu/old_manager.network.load-balancer.tar $EXCLUDES \
  ./packages/manager/modules/iplb \
  ./packages/manager/apps/iplb

echo "Generating old_manager.network.security.tar..."
tar -cf /home/ubuntu/old_manager.network.security.tar $EXCLUDES \
  ./packages/manager/apps/dedicated

echo "Generating old_manager.network.vrack.tar..."
tar -cf /home/ubuntu/old_manager.network.vrack.tar $EXCLUDES \
  ./packages/manager/modules/vrack \
  ./packages/manager/apps/vrack

echo "Generating old_manager.network.vrack-services.tar..."
tar -cf /home/ubuntu/old_manager.network.vrack-services.tar $EXCLUDES \
  ./packages/manager/apps/vrack-services

# ============================================================
# LICENSE
# ============================================================
echo "Generating old_manager.license.core.tar..."
tar -cf /home/ubuntu/old_manager.license.core.tar $EXCLUDES \
  ./packages/manager/apps/web

echo "Generating old_manager.license.cloudlinux.tar..."
tar -cf /home/ubuntu/old_manager.license.cloudlinux.tar $EXCLUDES \
  ./packages/manager/apps/web

echo "Generating old_manager.license.cpanel.tar..."
tar -cf /home/ubuntu/old_manager.license.cpanel.tar $EXCLUDES \
  ./packages/manager/apps/web

echo "Generating old_manager.license.directadmin.tar..."
tar -cf /home/ubuntu/old_manager.license.directadmin.tar $EXCLUDES \
  ./packages/manager/apps/web

echo "Generating old_manager.license.plesk.tar..."
tar -cf /home/ubuntu/old_manager.license.plesk.tar $EXCLUDES \
  ./packages/manager/apps/web

echo "Generating old_manager.license.sqlserver.tar..."
tar -cf /home/ubuntu/old_manager.license.sqlserver.tar $EXCLUDES \
  ./packages/manager/apps/web

echo "Generating old_manager.license.virtuozzo.tar..."
tar -cf /home/ubuntu/old_manager.license.virtuozzo.tar $EXCLUDES \
  ./packages/manager/apps/web

echo "Generating old_manager.license.windows.tar..."
tar -cf /home/ubuntu/old_manager.license.windows.tar $EXCLUDES \
  ./packages/manager/apps/web

# ============================================================
# ALL
# ============================================================
echo "Generating old_manager.all.tar..."
tar -cf /home/ubuntu/old_manager.all.tar $EXCLUDES \
  ./packages/manager/modules \
  ./packages/manager/apps \
  ./packages/components

echo ""
echo "=== old_manager tars générés ==="
ls -lh /home/ubuntu/old_manager.*.tar
