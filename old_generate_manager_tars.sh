#!/bin/bash
set -e

echo "=== Génération des tars old_manager ==="
cd /home/ubuntu/manager

# Exclusions standard pour monorepo lourd
EXCLUDES="--exclude=node_modules --exclude=.git --exclude=dist --exclude=coverage --exclude=*.lock --exclude=yarn.lock --exclude=package-lock.json --exclude=*.map --exclude=.cache"

# Nettoyage des anciens tars old_manager UNIQUEMENT
echo "Suppression des anciens old_manager.*.tar..."
rm -f /home/ubuntu/old_manager.*.tar

# ============================================================
# CORE GLOBAL
# ============================================================
echo "Création old_manager.core.tar..."
tar -cf /home/ubuntu/old_manager.core.tar $EXCLUDES \
    ./packages/manager/modules/core \
    ./packages/manager/modules/common-api \
    ./packages/manager/modules/common-translations \
    ./packages/manager/modules/config \
    ./packages/manager/modules/models \
    ./packages/manager/modules/error-page \
    ./packages/components/ovh-shell \
    ./packages/components/ovh-reket

# ============================================================
# BARE-METAL
# ============================================================
echo "Création old_manager.bare-metal.core.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.core.tar $EXCLUDES \
    ./packages/manager/modules/bm-server-components \
    ./packages/manager/apps/dedicated-servers

echo "Création old_manager.bare-metal.dedicated.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.dedicated.tar $EXCLUDES \
    ./packages/manager/apps/dedicated

echo "Création old_manager.bare-metal.housing.tar..."
# housing n'existe pas dans old, tar vide avec un placeholder
mkdir -p /tmp/old_manager_placeholder
echo "# No equivalent in old_manager for bare-metal/housing" > /tmp/old_manager_placeholder/README.md
tar -cf /home/ubuntu/old_manager.bare-metal.housing.tar -C /tmp/old_manager_placeholder .

echo "Création old_manager.bare-metal.nasha.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.nasha.tar $EXCLUDES \
    ./packages/manager/apps/nasha \
    ./packages/manager/modules/nasha

echo "Création old_manager.bare-metal.netapp.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.netapp.tar $EXCLUDES \
    ./packages/manager/apps/netapp \
    ./packages/manager/modules/netapp

echo "Création old_manager.bare-metal.vps.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.vps.tar $EXCLUDES \
    ./packages/manager/apps/vps \
    ./packages/manager/modules/vps

# ============================================================
# HOME
# ============================================================
echo "Création old_manager.home.core.tar..."
tar -cf /home/ubuntu/old_manager.home.core.tar $EXCLUDES \
    ./packages/manager/apps/hub \
    ./packages/manager/modules/manager-components

echo "Création old_manager.home.account.tar..."
tar -cf /home/ubuntu/old_manager.home.account.tar $EXCLUDES \
    ./packages/manager/apps/account \
    ./packages/manager/modules/account

echo "Création old_manager.home.api.tar..."
# api n'existe pas directement, placeholder
echo "# No direct equivalent in old_manager for home/api" > /tmp/old_manager_placeholder/README.md
tar -cf /home/ubuntu/old_manager.home.api.tar -C /tmp/old_manager_placeholder .

echo "Création old_manager.home.billing.tar..."
tar -cf /home/ubuntu/old_manager.home.billing.tar $EXCLUDES \
    ./packages/manager/apps/billing \
    ./packages/manager/modules/billing \
    ./packages/manager/modules/billing-components \
    ./packages/manager/modules/new-billing

echo "Création old_manager.home.carbon.tar..."
tar -cf /home/ubuntu/old_manager.home.carbon.tar $EXCLUDES \
    ./packages/manager/apps/carbon-calculator \
    ./packages/manager/modules/carbon-calculator

echo "Création old_manager.home.support.tar..."
tar -cf /home/ubuntu/old_manager.home.support.tar $EXCLUDES \
    ./packages/manager/apps/support \
    ./packages/manager/modules/support

# ============================================================
# IAM
# ============================================================
echo "Création old_manager.iam.core.tar..."
tar -cf /home/ubuntu/old_manager.iam.core.tar $EXCLUDES \
    ./packages/manager/apps/iam \
    ./packages/manager/modules/iam

echo "Création old_manager.iam.dbaas-logs.tar..."
tar -cf /home/ubuntu/old_manager.iam.dbaas-logs.tar $EXCLUDES \
    ./packages/manager/apps/dbaas-logs \
    ./packages/manager/modules/dbaas-logs

echo "Création old_manager.iam.hsm.tar..."
echo "# No equivalent in old_manager for iam/hsm" > /tmp/old_manager_placeholder/README.md
tar -cf /home/ubuntu/old_manager.iam.hsm.tar -C /tmp/old_manager_placeholder .

echo "Création old_manager.iam.logs.tar..."
tar -cf /home/ubuntu/old_manager.iam.logs.tar $EXCLUDES \
    ./packages/manager/modules/logs-to-customer \
    ./packages/manager/modules/log-to-customer

echo "Création old_manager.iam.metrics.tar..."
tar -cf /home/ubuntu/old_manager.iam.metrics.tar $EXCLUDES \
    ./packages/manager/apps/metrics \
    ./packages/manager/modules/metrics

echo "Création old_manager.iam.okms.tar..."
tar -cf /home/ubuntu/old_manager.iam.okms.tar $EXCLUDES \
    ./packages/manager/apps/okms

echo "Création old_manager.iam.secret.tar..."
echo "# No equivalent in old_manager for iam/secret" > /tmp/old_manager_placeholder/README.md
tar -cf /home/ubuntu/old_manager.iam.secret.tar -C /tmp/old_manager_placeholder .

# ============================================================
# LICENSE
# ============================================================
echo "Création old_manager.license.core.tar..."
# Licenses sont dans dedicated
tar -cf /home/ubuntu/old_manager.license.core.tar $EXCLUDES \
    ./packages/manager/apps/dedicated

# ============================================================
# NETWORK
# ============================================================
echo "Création old_manager.network.core.tar..."
tar -cf /home/ubuntu/old_manager.network.core.tar $EXCLUDES \
    ./packages/manager/modules/network-common

echo "Création old_manager.network.cdn.tar..."
echo "# CDN is part of dedicated in old_manager" > /tmp/old_manager_placeholder/README.md
tar -cf /home/ubuntu/old_manager.network.cdn.tar -C /tmp/old_manager_placeholder .

echo "Création old_manager.network.cloud-connect.tar..."
tar -cf /home/ubuntu/old_manager.network.cloud-connect.tar $EXCLUDES \
    ./packages/manager/apps/cloud-connect \
    ./packages/manager/modules/cloud-connect

echo "Création old_manager.network.ip.tar..."
tar -cf /home/ubuntu/old_manager.network.ip.tar $EXCLUDES \
    ./packages/manager/apps/ips

echo "Création old_manager.network.load-balancer.tar..."
tar -cf /home/ubuntu/old_manager.network.load-balancer.tar $EXCLUDES \
    ./packages/manager/apps/iplb \
    ./packages/manager/modules/iplb

echo "Création old_manager.network.security.tar..."
echo "# Security is part of dedicated/ips in old_manager" > /tmp/old_manager_placeholder/README.md
tar -cf /home/ubuntu/old_manager.network.security.tar -C /tmp/old_manager_placeholder .

echo "Création old_manager.network.vrack.tar..."
tar -cf /home/ubuntu/old_manager.network.vrack.tar $EXCLUDES \
    ./packages/manager/apps/vrack \
    ./packages/manager/modules/vrack

echo "Création old_manager.network.vrack-services.tar..."
tar -cf /home/ubuntu/old_manager.network.vrack-services.tar $EXCLUDES \
    ./packages/manager/apps/vrack-services

# ============================================================
# PRIVATE-CLOUD
# ============================================================
echo "Création old_manager.private-cloud.core.tar..."
echo "# Private cloud core - see individual services" > /tmp/old_manager_placeholder/README.md
tar -cf /home/ubuntu/old_manager.private-cloud.core.tar -C /tmp/old_manager_placeholder .

echo "Création old_manager.private-cloud.nutanix.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.nutanix.tar $EXCLUDES \
    ./packages/manager/apps/nutanix \
    ./packages/manager/modules/nutanix

echo "Création old_manager.private-cloud.vmware.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.vmware.tar $EXCLUDES \
    ./packages/manager/apps/hpc-vmware-public-vcf-aas \
    ./packages/manager/apps/hpc-vmware-vsphere

# ============================================================
# PUBLIC-CLOUD
# ============================================================
echo "Création old_manager.public-cloud.core.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.core.tar $EXCLUDES \
    ./packages/manager/apps/pci \
    ./packages/manager/apps/public-cloud \
    ./packages/manager/modules/pci \
    ./packages/manager/modules/pci-universe-components \
    ./packages/manager/modules/manager-pci-common

echo "Création old_manager.public-cloud.ai.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.ai.tar $EXCLUDES \
    ./packages/manager/apps/pci-ai-endpoints \
    ./packages/manager/apps/pci-ai-tools

echo "Création old_manager.public-cloud.block-storage.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.block-storage.tar $EXCLUDES \
    ./packages/manager/apps/pci-block-storage

echo "Création old_manager.public-cloud.databases.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.databases.tar $EXCLUDES \
    ./packages/manager/apps/pci-databases-analytics

echo "Création old_manager.public-cloud.instances.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.instances.tar $EXCLUDES \
    ./packages/manager/apps/pci-instances

echo "Création old_manager.public-cloud.kubernetes.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.kubernetes.tar $EXCLUDES \
    ./packages/manager/apps/pci-kubernetes

echo "Création old_manager.public-cloud.load-balancer.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.load-balancer.tar $EXCLUDES \
    ./packages/manager/apps/pci-load-balancer

echo "Création old_manager.public-cloud.object-storage.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.object-storage.tar $EXCLUDES \
    ./packages/manager/apps/pci-object-storage

echo "Création old_manager.public-cloud.project.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.project.tar $EXCLUDES \
    ./packages/manager/apps/pci-quota \
    ./packages/manager/apps/pci-vouchers \
    ./packages/manager/apps/pci-billing \
    ./packages/manager/apps/pci-contacts \
    ./packages/manager/apps/pci-users \
    ./packages/manager/apps/pci-ssh-keys

echo "Création old_manager.public-cloud.registry.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.registry.tar $EXCLUDES \
    ./packages/manager/apps/pci-private-registry

# ============================================================
# WEB-CLOUD
# ============================================================
echo "Création old_manager.web-cloud.core.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.core.tar $EXCLUDES \
    ./packages/manager/apps/web \
    ./packages/manager/modules/web-universe-components

echo "Création old_manager.web-cloud.access.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.access.tar $EXCLUDES \
    ./packages/manager/apps/overthebox \
    ./packages/manager/modules/overthebox

echo "Création old_manager.web-cloud.domains-dns.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.domains-dns.tar $EXCLUDES \
    ./packages/manager/apps/web-domains

echo "Création old_manager.web-cloud.emails.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.emails.tar $EXCLUDES \
    ./packages/manager/apps/email-domain \
    ./packages/manager/apps/email-pro \
    ./packages/manager/apps/exchange \
    ./packages/manager/apps/zimbra \
    ./packages/manager/apps/web-office \
    ./packages/manager/modules/email-domain \
    ./packages/manager/modules/emailpro \
    ./packages/manager/modules/exchange

echo "Création old_manager.web-cloud.hebergement.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.hebergement.tar $EXCLUDES \
    ./packages/manager/apps/web-hosting

echo "Création old_manager.web-cloud.telecom.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.telecom.tar $EXCLUDES \
    ./packages/manager/apps/telecom \
    ./packages/manager/apps/telecom-dashboard \
    ./packages/manager/apps/sms \
    ./packages/manager/apps/carrier-sip \
    ./packages/manager/apps/freefax \
    ./packages/manager/modules/sms \
    ./packages/manager/modules/carrier-sip \
    ./packages/manager/modules/freefax \
    ./packages/manager/modules/telecom-styles \
    ./packages/manager/modules/telecom-universe-components

# ============================================================
# ALL
# ============================================================
echo "Création old_manager.all.tar..."
tar -cf /home/ubuntu/old_manager.all.tar $EXCLUDES \
    ./packages/manager

# Nettoyage
rm -rf /tmp/old_manager_placeholder

# ============================================================
# RÉSUMÉ
# ============================================================
echo ""
echo "=== Tars générés ==="
ls -lh /home/ubuntu/old_manager.*.tar | awk '{print $9, $5}'
echo ""
echo "Total: $(ls /home/ubuntu/old_manager.*.tar | wc -l) tars"
