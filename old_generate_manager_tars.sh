#!/bin/bash
set -e

cd /home/ubuntu/manager
echo "=== Generating old_manager tars ==="

# Exclusions obligatoires pour monorepo lourd
EXCLUDES="--exclude=node_modules --exclude=.git --exclude=dist --exclude=coverage --exclude=*.lock --exclude=yarn.lock --exclude=package-lock.json --exclude=*.map --exclude=.cache"

# Cleanup ONLY old_manager tars
echo "Cleaning up old old_manager_*.tar files..."
rm -f /home/ubuntu/old_manager_*.tar

# ============================================
# CORE TAR
# ============================================
echo "Creating old_manager_core.tar..."
tar -cvf /home/ubuntu/old_manager_core.tar $EXCLUDES \
  package.json \
  lerna.json \
  turbo.json \
  babel.config.json \
  packages/components/ovh-reket \
  packages/components/ng-ovh-sso-auth \
  packages/components/ovh-at-internet \
  packages/components/ng-at-internet \
  packages/manager/core

# ============================================
# HOME.ACCOUNT
# ============================================
echo "Creating old_manager_home.account.tar..."
tar -cvf /home/ubuntu/old_manager_home.account.tar $EXCLUDES \
  packages/manager/apps/account \
  packages/manager/apps/procedures

# ============================================
# HOME.BILLING
# ============================================
echo "Creating old_manager_home.billing.tar..."
tar -cvf /home/ubuntu/old_manager_home.billing.tar $EXCLUDES \
  packages/manager/apps/billing

# ============================================
# HOME.SUPPORT
# ============================================
echo "Creating old_manager_home.support.tar..."
tar -cvf /home/ubuntu/old_manager_home.support.tar $EXCLUDES \
  packages/manager/apps/support

# ============================================
# HOME.API
# ============================================
echo "Creating old_manager_home.api.tar..."
tar -cvf /home/ubuntu/old_manager_home.api.tar $EXCLUDES \
  packages/manager/apps/account

# ============================================
# HOME.CARBON
# ============================================
echo "Creating old_manager_home.carbon.tar..."
tar -cvf /home/ubuntu/old_manager_home.carbon.tar $EXCLUDES \
  packages/manager/apps/carbon-calculator

# ============================================
# PUBLIC-CLOUD.BLOCK-STORAGE
# ============================================
echo "Creating old_manager_public-cloud.block-storage.tar..."
tar -cvf /home/ubuntu/old_manager_public-cloud.block-storage.tar $EXCLUDES \
  packages/manager/apps/pci-block-storage \
  packages/manager/apps/pci-volume-snapshot \
  packages/manager/apps/pci-volume-backup

# ============================================
# PUBLIC-CLOUD.DATABASES
# ============================================
echo "Creating old_manager_public-cloud.databases.tar..."
tar -cvf /home/ubuntu/old_manager_public-cloud.databases.tar $EXCLUDES \
  packages/manager/apps/pci-databases-analytics

# ============================================
# PUBLIC-CLOUD.PROJECT
# ============================================
echo "Creating old_manager_public-cloud.project.tar..."
tar -cvf /home/ubuntu/old_manager_public-cloud.project.tar $EXCLUDES \
  packages/manager/apps/pci \
  packages/manager/apps/public-cloud \
  packages/manager/apps/pci-billing \
  packages/manager/apps/pci-vouchers \
  packages/manager/apps/pci-quota \
  packages/manager/apps/pci-ssh-keys \
  packages/manager/apps/pci-users

# ============================================
# PUBLIC-CLOUD.AI
# ============================================
echo "Creating old_manager_public-cloud.ai.tar..."
tar -cvf /home/ubuntu/old_manager_public-cloud.ai.tar $EXCLUDES \
  packages/manager/apps/pci-ai-tools \
  packages/manager/apps/pci-ai-endpoints

# ============================================
# PUBLIC-CLOUD.INSTANCES
# ============================================
echo "Creating old_manager_public-cloud.instances.tar..."
tar -cvf /home/ubuntu/old_manager_public-cloud.instances.tar $EXCLUDES \
  packages/manager/apps/pci-instances

# ============================================
# PUBLIC-CLOUD.OBJECT-STORAGE
# ============================================
echo "Creating old_manager_public-cloud.object-storage.tar..."
tar -cvf /home/ubuntu/old_manager_public-cloud.object-storage.tar $EXCLUDES \
  packages/manager/apps/pci-object-storage \
  packages/manager/apps/pci-cold-archive

# ============================================
# PUBLIC-CLOUD.KUBERNETES
# ============================================
echo "Creating old_manager_public-cloud.kubernetes.tar..."
tar -cvf /home/ubuntu/old_manager_public-cloud.kubernetes.tar $EXCLUDES \
  packages/manager/apps/pci-kubernetes \
  packages/manager/apps/pci-rancher

# ============================================
# PUBLIC-CLOUD.REGISTRY
# ============================================
echo "Creating old_manager_public-cloud.registry.tar..."
tar -cvf /home/ubuntu/old_manager_public-cloud.registry.tar $EXCLUDES \
  packages/manager/apps/pci-private-registry

# ============================================
# PUBLIC-CLOUD.LOAD-BALANCER
# ============================================
echo "Creating old_manager_public-cloud.load-balancer.tar..."
tar -cvf /home/ubuntu/old_manager_public-cloud.load-balancer.tar $EXCLUDES \
  packages/manager/apps/pci-load-balancer \
  packages/manager/apps/pci-gateway \
  packages/manager/apps/pci-public-ip \
  packages/manager/apps/pci-private-network

# ============================================
# IAM.OKMS
# ============================================
echo "Creating old_manager_iam.okms.tar..."
tar -cvf /home/ubuntu/old_manager_iam.okms.tar $EXCLUDES \
  packages/manager/apps/okms

# ============================================
# IAM.SECRET (nouveau - vide ou minimal)
# ============================================
echo "Creating old_manager_iam.secret.tar (nouveau service - minimal)..."
tar -cvf /home/ubuntu/old_manager_iam.secret.tar $EXCLUDES \
  packages/manager/apps/iam

# ============================================
# IAM.DBAAS-LOGS
# ============================================
echo "Creating old_manager_iam.dbaas-logs.tar..."
tar -cvf /home/ubuntu/old_manager_iam.dbaas-logs.tar $EXCLUDES \
  packages/manager/apps/dbaas-logs

# ============================================
# IAM.METRICS
# ============================================
echo "Creating old_manager_iam.metrics.tar..."
tar -cvf /home/ubuntu/old_manager_iam.metrics.tar $EXCLUDES \
  packages/manager/apps/metrics

# ============================================
# IAM.HSM (nouveau - vide ou minimal)
# ============================================
echo "Creating old_manager_iam.hsm.tar (nouveau service - minimal)..."
tar -cvf /home/ubuntu/old_manager_iam.hsm.tar $EXCLUDES \
  packages/manager/apps/iam

# ============================================
# IAM.LOGS
# ============================================
echo "Creating old_manager_iam.logs.tar..."
tar -cvf /home/ubuntu/old_manager_iam.logs.tar $EXCLUDES \
  packages/manager/apps/iam \
  packages/manager/apps/identity-access-management

# ============================================
# WEB-CLOUD.VOIP
# ============================================
echo "Creating old_manager_web-cloud.voip.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.voip.tar $EXCLUDES \
  packages/manager/apps/telecom \
  packages/manager/apps/telecom-dashboard

# ============================================
# WEB-CLOUD.DOMAINS
# ============================================
echo "Creating old_manager_web-cloud.domains.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.domains.tar $EXCLUDES \
  packages/manager/apps/web-domains \
  packages/manager/apps/web

# ============================================
# WEB-CLOUD.HOSTING
# ============================================
echo "Creating old_manager_web-cloud.hosting.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.hosting.tar $EXCLUDES \
  packages/manager/apps/web-hosting \
  packages/manager/apps/web

# ============================================
# WEB-CLOUD.EMAIL-PRO
# ============================================
echo "Creating old_manager_web-cloud.email-pro.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.email-pro.tar $EXCLUDES \
  packages/manager/apps/email-pro

# ============================================
# WEB-CLOUD.CARRIER-SIP
# ============================================
echo "Creating old_manager_web-cloud.carrier-sip.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.carrier-sip.tar $EXCLUDES \
  packages/manager/apps/carrier-sip

# ============================================
# WEB-CLOUD.OFFICE
# ============================================
echo "Creating old_manager_web-cloud.office.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.office.tar $EXCLUDES \
  packages/manager/apps/web-office

# ============================================
# WEB-CLOUD.PRIVATE-DATABASE
# ============================================
echo "Creating old_manager_web-cloud.private-database.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.private-database.tar $EXCLUDES \
  packages/manager/apps/web

# ============================================
# WEB-CLOUD.EXCHANGE
# ============================================
echo "Creating old_manager_web-cloud.exchange.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.exchange.tar $EXCLUDES \
  packages/manager/apps/exchange

# ============================================
# WEB-CLOUD.EMAIL-DOMAIN
# ============================================
echo "Creating old_manager_web-cloud.email-domain.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.email-domain.tar $EXCLUDES \
  packages/manager/apps/email-domain

# ============================================
# WEB-CLOUD.PACK-XDSL
# ============================================
echo "Creating old_manager_web-cloud.pack-xdsl.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.pack-xdsl.tar $EXCLUDES \
  packages/manager/apps/telecom

# ============================================
# WEB-CLOUD.DNS-ZONES
# ============================================
echo "Creating old_manager_web-cloud.dns-zones.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.dns-zones.tar $EXCLUDES \
  packages/manager/apps/web-domains

# ============================================
# WEB-CLOUD.SMS
# ============================================
echo "Creating old_manager_web-cloud.sms.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.sms.tar $EXCLUDES \
  packages/manager/apps/sms

# ============================================
# WEB-CLOUD.OVERTHEBOX
# ============================================
echo "Creating old_manager_web-cloud.overthebox.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.overthebox.tar $EXCLUDES \
  packages/manager/apps/overthebox

# ============================================
# WEB-CLOUD.ZIMBRA
# ============================================
echo "Creating old_manager_web-cloud.zimbra.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.zimbra.tar $EXCLUDES \
  packages/manager/apps/zimbra

# ============================================
# WEB-CLOUD.FAX
# ============================================
echo "Creating old_manager_web-cloud.fax.tar..."
tar -cvf /home/ubuntu/old_manager_web-cloud.fax.tar $EXCLUDES \
  packages/manager/apps/freefax

# ============================================
# LICENSE
# ============================================
echo "Creating old_manager_license.tar..."
tar -cvf /home/ubuntu/old_manager_license.tar $EXCLUDES \
  packages/manager/apps/dedicated

# ============================================
# BARE-METAL.HOUSING
# ============================================
echo "Creating old_manager_bare-metal.housing.tar..."
tar -cvf /home/ubuntu/old_manager_bare-metal.housing.tar $EXCLUDES \
  packages/manager/apps/dedicated

# ============================================
# BARE-METAL.VPS
# ============================================
echo "Creating old_manager_bare-metal.vps.tar..."
tar -cvf /home/ubuntu/old_manager_bare-metal.vps.tar $EXCLUDES \
  packages/manager/apps/vps

# ============================================
# BARE-METAL.DEDICATED
# ============================================
echo "Creating old_manager_bare-metal.dedicated.tar..."
tar -cvf /home/ubuntu/old_manager_bare-metal.dedicated.tar $EXCLUDES \
  packages/manager/apps/dedicated \
  packages/manager/apps/dedicated-servers

# ============================================
# BARE-METAL.NASHA
# ============================================
echo "Creating old_manager_bare-metal.nasha.tar..."
tar -cvf /home/ubuntu/old_manager_bare-metal.nasha.tar $EXCLUDES \
  packages/manager/apps/nasha

# ============================================
# BARE-METAL.NETAPP
# ============================================
echo "Creating old_manager_bare-metal.netapp.tar..."
tar -cvf /home/ubuntu/old_manager_bare-metal.netapp.tar $EXCLUDES \
  packages/manager/apps/netapp

# ============================================
# PRIVATE-CLOUD.NUTANIX
# ============================================
echo "Creating old_manager_private-cloud.nutanix.tar..."
tar -cvf /home/ubuntu/old_manager_private-cloud.nutanix.tar $EXCLUDES \
  packages/manager/apps/nutanix

# ============================================
# PRIVATE-CLOUD.SAP
# ============================================
echo "Creating old_manager_private-cloud.sap.tar..."
tar -cvf /home/ubuntu/old_manager_private-cloud.sap.tar $EXCLUDES \
  packages/manager/apps/sap-features-hub

# ============================================
# PRIVATE-CLOUD.VEEAM
# ============================================
echo "Creating old_manager_private-cloud.veeam.tar..."
tar -cvf /home/ubuntu/old_manager_private-cloud.veeam.tar $EXCLUDES \
  packages/manager/apps/veeam-backup \
  packages/manager/apps/veeam-enterprise

# ============================================
# PRIVATE-CLOUD.MANAGED-BAREMETAL
# ============================================
echo "Creating old_manager_private-cloud.managed-baremetal.tar..."
tar -cvf /home/ubuntu/old_manager_private-cloud.managed-baremetal.tar $EXCLUDES \
  packages/manager/apps/hpc-vmware-vsphere

# ============================================
# PRIVATE-CLOUD.VMWARE
# ============================================
echo "Creating old_manager_private-cloud.vmware.tar..."
tar -cvf /home/ubuntu/old_manager_private-cloud.vmware.tar $EXCLUDES \
  packages/manager/apps/hpc-vmware-vsphere \
  packages/manager/apps/hpc-vmware-public-vcf-aas

# ============================================
# NETWORK.VRACK
# ============================================
echo "Creating old_manager_network.vrack.tar..."
tar -cvf /home/ubuntu/old_manager_network.vrack.tar $EXCLUDES \
  packages/manager/apps/vrack

# ============================================
# NETWORK.VRACK-SERVICES
# ============================================
echo "Creating old_manager_network.vrack-services.tar..."
tar -cvf /home/ubuntu/old_manager_network.vrack-services.tar $EXCLUDES \
  packages/manager/apps/vrack-services

# ============================================
# NETWORK.CLOUD-CONNECT
# ============================================
echo "Creating old_manager_network.cloud-connect.tar..."
tar -cvf /home/ubuntu/old_manager_network.cloud-connect.tar $EXCLUDES \
  packages/manager/apps/cloud-connect

# ============================================
# NETWORK.CDN
# ============================================
echo "Creating old_manager_network.cdn.tar..."
tar -cvf /home/ubuntu/old_manager_network.cdn.tar $EXCLUDES \
  packages/manager/apps/dedicated

# ============================================
# NETWORK.IP
# ============================================
echo "Creating old_manager_network.ip.tar..."
tar -cvf /home/ubuntu/old_manager_network.ip.tar $EXCLUDES \
  packages/manager/apps/ips

# ============================================
# NETWORK.SECURITY
# ============================================
echo "Creating old_manager_network.security.tar..."
tar -cvf /home/ubuntu/old_manager_network.security.tar $EXCLUDES \
  packages/manager/apps/dedicated

# ============================================
# NETWORK.LOAD-BALANCER
# ============================================
echo "Creating old_manager_network.load-balancer.tar..."
tar -cvf /home/ubuntu/old_manager_network.load-balancer.tar $EXCLUDES \
  packages/manager/apps/iplb

# ============================================
# ALL TAR
# ============================================
echo "Creating old_manager_all.tar..."
tar -cvf /home/ubuntu/old_manager_all.tar $EXCLUDES \
  .

# ============================================
# SUMMARY
# ============================================
echo ""
echo "=== Summary ==="
for f in /home/ubuntu/old_manager_*.tar; do
  size=$(du -h "$f" | cut -f1)
  count=$(tar -tf "$f" 2>/dev/null | wc -l)
  echo "$f : $count files, $size"
done
echo "=== Done ==="
