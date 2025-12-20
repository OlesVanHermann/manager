#!/bin/bash
set -e

cd /home/ubuntu/aiapp/frontend
echo "=== Generating new_manager tars ==="

# Cleanup ONLY new_manager tars
echo "Cleaning up old new_manager_*.tar files..."
rm -f /home/ubuntu/new_manager_*.tar

# ============================================
# CORE TAR
# ============================================
echo "Creating new_manager_core.tar..."
tar -cvf /home/ubuntu/new_manager_core.tar \
  vite.config.ts \
  package.json \
  src/App.tsx \
  src/main.tsx \
  src/index.css \
  src/components \
  src/contexts \
  src/design-system \
  src/hooks \
  src/i18n \
  src/lib \
  src/styles \
  src/types \
  public/locales/en/common.json \
  public/locales/en/navigation.json \
  public/locales/en/login.json \
  public/locales/fr/common.json \
  public/locales/fr/navigation.json \
  public/locales/fr/login.json

# ============================================
# HOME.ACCOUNT
# ============================================
echo "Creating new_manager_home.account.tar..."
tar -cvf /home/ubuntu/new_manager_home.account.tar \
  src/pages/home/account \
  src/services/home.account.ts \
  src/services/home.account.contacts.ts \
  src/services/home.account.security.ts \
  src/services/home.account.procedures.ts \
  public/locales/en/home/account \
  public/locales/fr/home/account

# ============================================
# HOME.BILLING
# ============================================
echo "Creating new_manager_home.billing.tar..."
tar -cvf /home/ubuntu/new_manager_home.billing.tar \
  src/pages/home/billing \
  src/services/home.billing.ts \
  src/services/home.billing.services.ts \
  src/services/home.billing.orders.ts \
  src/services/home.billing.agreements.ts \
  public/locales/en/home/billing \
  public/locales/fr/home/billing

# ============================================
# HOME.SUPPORT
# ============================================
echo "Creating new_manager_home.support.tar..."
tar -cvf /home/ubuntu/new_manager_home.support.tar \
  src/pages/home/support \
  src/services/home.support.ts \
  src/services/home.support.communication.ts \
  public/locales/en/home/support \
  public/locales/fr/home/support

# ============================================
# HOME.API
# ============================================
echo "Creating new_manager_home.api.tar..."
tar -cvf /home/ubuntu/new_manager_home.api.tar \
  src/pages/home/api \
  src/services/home.api.ts \
  public/locales/en/home/api \
  public/locales/fr/home/api

# ============================================
# HOME.CARBON
# ============================================
echo "Creating new_manager_home.carbon.tar..."
tar -cvf /home/ubuntu/new_manager_home.carbon.tar \
  src/pages/home/carbon \
  src/services/home.carbon.ts \
  public/locales/en/home/carbon \
  public/locales/fr/home/carbon

# ============================================
# PUBLIC-CLOUD.BLOCK-STORAGE
# ============================================
echo "Creating new_manager_public-cloud.block-storage.tar..."
tar -cvf /home/ubuntu/new_manager_public-cloud.block-storage.tar \
  src/pages/public-cloud/block-storage \
  src/services/public-cloud.block-storage.ts \
  public/locales/en/public-cloud/block-storage \
  public/locales/fr/public-cloud/block-storage

# ============================================
# PUBLIC-CLOUD.DATABASES
# ============================================
echo "Creating new_manager_public-cloud.databases.tar..."
tar -cvf /home/ubuntu/new_manager_public-cloud.databases.tar \
  src/pages/public-cloud/databases \
  src/services/public-cloud.databases.ts \
  public/locales/en/public-cloud/databases \
  public/locales/fr/public-cloud/databases

# ============================================
# PUBLIC-CLOUD.PROJECT
# ============================================
echo "Creating new_manager_public-cloud.project.tar..."
tar -cvf /home/ubuntu/new_manager_public-cloud.project.tar \
  src/pages/public-cloud/project \
  src/services/public-cloud.ts \
  public/locales/en/public-cloud/project \
  public/locales/fr/public-cloud/project

# ============================================
# PUBLIC-CLOUD.AI
# ============================================
echo "Creating new_manager_public-cloud.ai.tar..."
tar -cvf /home/ubuntu/new_manager_public-cloud.ai.tar \
  src/pages/public-cloud/ai \
  src/services/public-cloud.ai.ts \
  public/locales/en/public-cloud/ai \
  public/locales/fr/public-cloud/ai

# ============================================
# PUBLIC-CLOUD.INSTANCES
# ============================================
echo "Creating new_manager_public-cloud.instances.tar..."
tar -cvf /home/ubuntu/new_manager_public-cloud.instances.tar \
  src/pages/public-cloud/instances \
  src/services/public-cloud.instances.ts \
  public/locales/en/public-cloud/instances \
  public/locales/fr/public-cloud/instances

# ============================================
# PUBLIC-CLOUD.OBJECT-STORAGE
# ============================================
echo "Creating new_manager_public-cloud.object-storage.tar..."
tar -cvf /home/ubuntu/new_manager_public-cloud.object-storage.tar \
  src/pages/public-cloud/object-storage \
  src/services/public-cloud.object-storage.ts \
  public/locales/en/public-cloud/object-storage \
  public/locales/fr/public-cloud/object-storage

# ============================================
# PUBLIC-CLOUD.KUBERNETES
# ============================================
echo "Creating new_manager_public-cloud.kubernetes.tar..."
tar -cvf /home/ubuntu/new_manager_public-cloud.kubernetes.tar \
  src/pages/public-cloud/kubernetes \
  src/services/public-cloud.kubernetes.ts \
  public/locales/en/public-cloud/kubernetes \
  public/locales/fr/public-cloud/kubernetes

# ============================================
# PUBLIC-CLOUD.REGISTRY
# ============================================
echo "Creating new_manager_public-cloud.registry.tar..."
tar -cvf /home/ubuntu/new_manager_public-cloud.registry.tar \
  src/pages/public-cloud/registry \
  src/services/public-cloud.registry.ts \
  public/locales/en/public-cloud/registry \
  public/locales/fr/public-cloud/registry

# ============================================
# PUBLIC-CLOUD.LOAD-BALANCER
# ============================================
echo "Creating new_manager_public-cloud.load-balancer.tar..."
tar -cvf /home/ubuntu/new_manager_public-cloud.load-balancer.tar \
  src/pages/public-cloud/load-balancer \
  src/services/public-cloud.load-balancer.ts \
  public/locales/en/public-cloud/load-balancer \
  public/locales/fr/public-cloud/load-balancer

# ============================================
# IAM.OKMS
# ============================================
echo "Creating new_manager_iam.okms.tar..."
tar -cvf /home/ubuntu/new_manager_iam.okms.tar \
  src/pages/iam/okms \
  src/services/iam.okms.ts \
  public/locales/en/iam/okms \
  public/locales/fr/iam/okms

# ============================================
# IAM.SECRET
# ============================================
echo "Creating new_manager_iam.secret.tar..."
tar -cvf /home/ubuntu/new_manager_iam.secret.tar \
  src/pages/iam/secret \
  src/services/iam.secret.ts \
  public/locales/en/iam/secret \
  public/locales/fr/iam/secret

# ============================================
# IAM.DBAAS-LOGS
# ============================================
echo "Creating new_manager_iam.dbaas-logs.tar..."
tar -cvf /home/ubuntu/new_manager_iam.dbaas-logs.tar \
  src/pages/iam/dbaas-logs \
  src/services/iam.dbaas-logs.ts \
  public/locales/en/iam/dbaas-logs \
  public/locales/fr/iam/dbaas-logs

# ============================================
# IAM.METRICS
# ============================================
echo "Creating new_manager_iam.metrics.tar..."
tar -cvf /home/ubuntu/new_manager_iam.metrics.tar \
  src/pages/iam/metrics \
  src/services/iam.metrics.ts \
  public/locales/en/iam/metrics \
  public/locales/fr/iam/metrics

# ============================================
# IAM.HSM
# ============================================
echo "Creating new_manager_iam.hsm.tar..."
tar -cvf /home/ubuntu/new_manager_iam.hsm.tar \
  src/pages/iam/hsm \
  src/services/iam.hsm.ts \
  public/locales/en/iam/hsm \
  public/locales/fr/iam/hsm

# ============================================
# IAM.LOGS
# ============================================
echo "Creating new_manager_iam.logs.tar..."
tar -cvf /home/ubuntu/new_manager_iam.logs.tar \
  src/pages/iam/logs \
  src/services/iam.logs.ts \
  src/services/iam.ts \
  src/pages/iam/index.tsx \
  src/pages/iam/tabs \
  src/pages/iam/components \
  src/pages/iam/utils.tsx \
  src/pages/iam/styles.css \
  public/locales/en/iam/index.json \
  public/locales/en/iam/logs.json \
  public/locales/en/iam/identities.json \
  public/locales/fr/iam/index.json \
  public/locales/fr/iam/logs.json \
  public/locales/fr/iam/identities.json

# ============================================
# WEB-CLOUD.VOIP
# ============================================
echo "Creating new_manager_web-cloud.voip.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.voip.tar \
  src/pages/web-cloud/voip \
  src/services/web-cloud.voip.ts \
  public/locales/en/web-cloud/voip \
  public/locales/fr/web-cloud/voip

# ============================================
# WEB-CLOUD.DOMAINS
# ============================================
echo "Creating new_manager_web-cloud.domains.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.domains.tar \
  src/pages/web-cloud/domains \
  src/services/web-cloud.domains.ts \
  public/locales/en/web-cloud/domains \
  public/locales/fr/web-cloud/domains

# ============================================
# WEB-CLOUD.HOSTING
# ============================================
echo "Creating new_manager_web-cloud.hosting.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.hosting.tar \
  src/pages/web-cloud/hosting \
  src/services/web-cloud.hosting.ts \
  public/locales/en/web-cloud/hosting \
  public/locales/fr/web-cloud/hosting

# ============================================
# WEB-CLOUD.EMAIL-PRO
# ============================================
echo "Creating new_manager_web-cloud.email-pro.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.email-pro.tar \
  src/pages/web-cloud/email-pro \
  src/services/web-cloud.email-pro.ts \
  public/locales/en/web-cloud/email-pro \
  public/locales/fr/web-cloud/email-pro

# ============================================
# WEB-CLOUD.CARRIER-SIP
# ============================================
echo "Creating new_manager_web-cloud.carrier-sip.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.carrier-sip.tar \
  src/pages/web-cloud/carrier-sip \
  src/services/web-cloud.carrier-sip.ts \
  public/locales/en/web-cloud/carrier-sip \
  public/locales/fr/web-cloud/carrier-sip

# ============================================
# WEB-CLOUD.OFFICE
# ============================================
echo "Creating new_manager_web-cloud.office.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.office.tar \
  src/pages/web-cloud/office \
  src/services/web-cloud.office.ts \
  public/locales/en/web-cloud/office \
  public/locales/fr/web-cloud/office

# ============================================
# WEB-CLOUD.PRIVATE-DATABASE
# ============================================
echo "Creating new_manager_web-cloud.private-database.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.private-database.tar \
  src/pages/web-cloud/private-database \
  src/services/web-cloud.private-database.ts \
  public/locales/en/web-cloud/private-database \
  public/locales/fr/web-cloud/private-database

# ============================================
# WEB-CLOUD.EXCHANGE
# ============================================
echo "Creating new_manager_web-cloud.exchange.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.exchange.tar \
  src/pages/web-cloud/exchange \
  src/services/web-cloud.exchange.ts \
  public/locales/en/web-cloud/exchange \
  public/locales/fr/web-cloud/exchange

# ============================================
# WEB-CLOUD.EMAIL-DOMAIN
# ============================================
echo "Creating new_manager_web-cloud.email-domain.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.email-domain.tar \
  src/pages/web-cloud/email-domain \
  src/services/web-cloud.email-domain.ts \
  public/locales/en/web-cloud/email-domain \
  public/locales/fr/web-cloud/email-domain

# ============================================
# WEB-CLOUD.PACK-XDSL
# ============================================
echo "Creating new_manager_web-cloud.pack-xdsl.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.pack-xdsl.tar \
  src/pages/web-cloud/pack-xdsl \
  src/services/web-cloud.pack-xdsl.ts \
  public/locales/en/web-cloud/pack-xdsl \
  public/locales/fr/web-cloud/pack-xdsl

# ============================================
# WEB-CLOUD.DNS-ZONES
# ============================================
echo "Creating new_manager_web-cloud.dns-zones.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.dns-zones.tar \
  src/pages/web-cloud/dns-zones \
  src/services/web-cloud.dns-zones.ts \
  public/locales/en/web-cloud/dns-zones \
  public/locales/fr/web-cloud/dns-zones

# ============================================
# WEB-CLOUD.SMS
# ============================================
echo "Creating new_manager_web-cloud.sms.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.sms.tar \
  src/pages/web-cloud/sms \
  src/services/web-cloud.sms.ts \
  public/locales/en/web-cloud/sms \
  public/locales/fr/web-cloud/sms

# ============================================
# WEB-CLOUD.OVERTHEBOX
# ============================================
echo "Creating new_manager_web-cloud.overthebox.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.overthebox.tar \
  src/pages/web-cloud/overthebox \
  src/services/web-cloud.overthebox.ts \
  public/locales/en/web-cloud/overthebox \
  public/locales/fr/web-cloud/overthebox

# ============================================
# WEB-CLOUD.ZIMBRA
# ============================================
echo "Creating new_manager_web-cloud.zimbra.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.zimbra.tar \
  src/pages/web-cloud/zimbra \
  src/services/web-cloud.zimbra.ts \
  public/locales/en/web-cloud/zimbra \
  public/locales/fr/web-cloud/zimbra

# ============================================
# WEB-CLOUD.FAX
# ============================================
echo "Creating new_manager_web-cloud.fax.tar..."
tar -cvf /home/ubuntu/new_manager_web-cloud.fax.tar \
  src/pages/web-cloud/fax \
  src/services/web-cloud.fax.ts \
  public/locales/en/web-cloud/fax \
  public/locales/fr/web-cloud/fax

# ============================================
# LICENSE (all sub-domains)
# ============================================
echo "Creating new_manager_license.tar..."
tar -cvf /home/ubuntu/new_manager_license.tar \
  src/pages/license \
  src/services/license.ts \
  public/locales/en/license \
  public/locales/fr/license

# ============================================
# BARE-METAL.HOUSING
# ============================================
echo "Creating new_manager_bare-metal.housing.tar..."
tar -cvf /home/ubuntu/new_manager_bare-metal.housing.tar \
  src/pages/bare-metal/housing \
  src/services/bare-metal.housing.ts \
  public/locales/en/bare-metal/housing \
  public/locales/fr/bare-metal/housing

# ============================================
# BARE-METAL.VPS
# ============================================
echo "Creating new_manager_bare-metal.vps.tar..."
tar -cvf /home/ubuntu/new_manager_bare-metal.vps.tar \
  src/pages/bare-metal/vps \
  src/services/bare-metal.vps.ts \
  public/locales/en/bare-metal/vps \
  public/locales/fr/bare-metal/vps

# ============================================
# BARE-METAL.DEDICATED
# ============================================
echo "Creating new_manager_bare-metal.dedicated.tar..."
tar -cvf /home/ubuntu/new_manager_bare-metal.dedicated.tar \
  src/pages/bare-metal/dedicated \
  src/services/bare-metal.dedicated.ts \
  public/locales/en/bare-metal/dedicated \
  public/locales/fr/bare-metal/dedicated

# ============================================
# BARE-METAL.NASHA
# ============================================
echo "Creating new_manager_bare-metal.nasha.tar..."
tar -cvf /home/ubuntu/new_manager_bare-metal.nasha.tar \
  src/pages/bare-metal/nasha \
  src/services/bare-metal.nasha.ts \
  public/locales/en/bare-metal/nasha \
  public/locales/fr/bare-metal/nasha

# ============================================
# BARE-METAL.NETAPP
# ============================================
echo "Creating new_manager_bare-metal.netapp.tar..."
tar -cvf /home/ubuntu/new_manager_bare-metal.netapp.tar \
  src/pages/bare-metal/netapp \
  src/services/bare-metal.netapp.ts \
  public/locales/en/bare-metal/netapp \
  public/locales/fr/bare-metal/netapp

# ============================================
# PRIVATE-CLOUD.NUTANIX
# ============================================
echo "Creating new_manager_private-cloud.nutanix.tar..."
tar -cvf /home/ubuntu/new_manager_private-cloud.nutanix.tar \
  src/pages/private-cloud/nutanix \
  src/services/private-cloud.nutanix.ts \
  public/locales/en/private-cloud/nutanix \
  public/locales/fr/private-cloud/nutanix

# ============================================
# PRIVATE-CLOUD.SAP
# ============================================
echo "Creating new_manager_private-cloud.sap.tar..."
tar -cvf /home/ubuntu/new_manager_private-cloud.sap.tar \
  src/pages/private-cloud/sap

# ============================================
# PRIVATE-CLOUD.VEEAM
# ============================================
echo "Creating new_manager_private-cloud.veeam.tar..."
tar -cvf /home/ubuntu/new_manager_private-cloud.veeam.tar \
  src/pages/private-cloud/veeam

# ============================================
# PRIVATE-CLOUD.MANAGED-BAREMETAL
# ============================================
echo "Creating new_manager_private-cloud.managed-baremetal.tar..."
tar -cvf /home/ubuntu/new_manager_private-cloud.managed-baremetal.tar \
  src/pages/private-cloud/managed-baremetal

# ============================================
# PRIVATE-CLOUD.VMWARE
# ============================================
echo "Creating new_manager_private-cloud.vmware.tar..."
tar -cvf /home/ubuntu/new_manager_private-cloud.vmware.tar \
  src/pages/private-cloud/vmware \
  src/services/private-cloud.vmware.ts \
  src/services/private-cloud.ts \
  public/locales/en/private-cloud/vmware \
  public/locales/fr/private-cloud/vmware

# ============================================
# NETWORK.VRACK
# ============================================
echo "Creating new_manager_network.vrack.tar..."
tar -cvf /home/ubuntu/new_manager_network.vrack.tar \
  src/pages/network/vrack \
  public/locales/en/network/vrack \
  public/locales/fr/network/vrack

# ============================================
# NETWORK.VRACK-SERVICES
# ============================================
echo "Creating new_manager_network.vrack-services.tar..."
tar -cvf /home/ubuntu/new_manager_network.vrack-services.tar \
  src/pages/network/vrack-services \
  src/services/network.vrack-services.ts \
  public/locales/en/network/vrack-services \
  public/locales/fr/network/vrack-services

# ============================================
# NETWORK.CLOUD-CONNECT
# ============================================
echo "Creating new_manager_network.cloud-connect.tar..."
tar -cvf /home/ubuntu/new_manager_network.cloud-connect.tar \
  src/pages/network/cloud-connect \
  src/services/network.cloud-connect.ts \
  public/locales/en/network/cloud-connect \
  public/locales/fr/network/cloud-connect

# ============================================
# NETWORK.CDN
# ============================================
echo "Creating new_manager_network.cdn.tar..."
tar -cvf /home/ubuntu/new_manager_network.cdn.tar \
  src/pages/network/cdn \
  src/services/network.cdn.ts \
  public/locales/en/network/cdn \
  public/locales/fr/network/cdn

# ============================================
# NETWORK.IP
# ============================================
echo "Creating new_manager_network.ip.tar..."
tar -cvf /home/ubuntu/new_manager_network.ip.tar \
  src/pages/network/ip \
  src/services/network.ts \
  public/locales/en/network/ip \
  public/locales/fr/network/ip

# ============================================
# NETWORK.SECURITY
# ============================================
echo "Creating new_manager_network.security.tar..."
tar -cvf /home/ubuntu/new_manager_network.security.tar \
  src/pages/network/security \
  src/services/network.security.ts \
  public/locales/en/network/security \
  public/locales/fr/network/security

# ============================================
# NETWORK.LOAD-BALANCER
# ============================================
echo "Creating new_manager_network.load-balancer.tar..."
tar -cvf /home/ubuntu/new_manager_network.load-balancer.tar \
  src/pages/network/load-balancer \
  public/locales/en/network/load-balancer \
  public/locales/fr/network/load-balancer

# ============================================
# ALL TAR
# ============================================
echo "Creating new_manager_all.tar..."
tar -cvf /home/ubuntu/new_manager_all.tar \
  --exclude='node_modules' \
  .

# ============================================
# SUMMARY
# ============================================
echo ""
echo "=== Summary ==="
for f in /home/ubuntu/new_manager_*.tar; do
  size=$(du -h "$f" | cut -f1)
  count=$(tar -tf "$f" 2>/dev/null | wc -l)
  echo "$f : $count files, $size"
done
echo "=== Done ==="
