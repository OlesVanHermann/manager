#!/bin/bash
set -e

echo "=== Génération des tars old_manager ==="
cd /home/ubuntu/manager
EXCLUDES="--exclude=node_modules --exclude=.git --exclude=dist --exclude=coverage --exclude=*.lock --exclude=yarn.lock --exclude=package-lock.json --exclude=*.map --exclude=.cache"

echo "Suppression des anciens old_manager.*.tar..."
rm -f /home/ubuntu/old_manager.*.tar

echo "Création de old_manager.core.tar..."
tar -cf /home/ubuntu/old_manager.core.tar $EXCLUDES \
  ./package.json ./lerna.json ./turbo.json ./babel.config.json \
  ./packages/components/ovh-shell ./packages/manager/modules/core ./packages/manager/modules/config \
  ./packages/manager/modules/manager-components ./packages/manager/modules/ng-layout-helpers \
  ./packages/manager/modules/common-api ./packages/manager/modules/common-translations

echo "Création de old_manager.home.core.tar..."
tar -cf /home/ubuntu/old_manager.home.core.tar $EXCLUDES ./packages/manager/apps/hub

echo "Création de old_manager.home.account.tar..."
tar -cf /home/ubuntu/old_manager.home.account.tar $EXCLUDES \
  ./packages/manager/modules/account ./packages/manager/apps/account

echo "Création de old_manager.home.api.tar..."
tar -cf /home/ubuntu/old_manager.home.api.tar $EXCLUDES ./packages/manager/modules/account/src/user

echo "Création de old_manager.home.billing.tar..."
tar -cf /home/ubuntu/old_manager.home.billing.tar $EXCLUDES \
  ./packages/manager/modules/billing ./packages/manager/modules/billing-components \
  ./packages/manager/modules/new-billing ./packages/manager/apps/billing

echo "Création de old_manager.home.carbon.tar..."
tar -cf /home/ubuntu/old_manager.home.carbon.tar $EXCLUDES \
  ./packages/manager/modules/carbon-calculator ./packages/manager/apps/carbon-calculator

echo "Création de old_manager.home.support.tar..."
tar -cf /home/ubuntu/old_manager.home.support.tar $EXCLUDES \
  ./packages/manager/modules/support ./packages/manager/apps/support

echo "Création de old_manager.bare-metal.core.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.core.tar $EXCLUDES ./packages/manager/modules/bm-server-components

echo "Création de old_manager.bare-metal.dedicated.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.dedicated.tar $EXCLUDES \
  ./packages/manager/apps/dedicated ./packages/manager/apps/dedicated-servers

echo "Création de old_manager.bare-metal.housing.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.housing.tar $EXCLUDES \
  ./packages/manager/apps/dedicated/client/app/dedicated/housing

echo "Création de old_manager.bare-metal.nasha.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.nasha.tar $EXCLUDES \
  ./packages/manager/modules/nasha ./packages/manager/apps/nasha

echo "Création de old_manager.bare-metal.netapp.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.netapp.tar $EXCLUDES \
  ./packages/manager/modules/netapp ./packages/manager/apps/netapp

echo "Création de old_manager.bare-metal.vps.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.vps.tar $EXCLUDES \
  ./packages/manager/modules/vps ./packages/manager/apps/vps

echo "Création de old_manager.iam.core.tar..."
tar -cf /home/ubuntu/old_manager.iam.core.tar $EXCLUDES \
  ./packages/manager/modules/iam ./packages/manager/apps/iam ./packages/manager/apps/identity-access-management

echo "Création de old_manager.iam.dbaas-logs.tar..."
tar -cf /home/ubuntu/old_manager.iam.dbaas-logs.tar $EXCLUDES \
  ./packages/manager/modules/dbaas-logs ./packages/manager/apps/dbaas-logs

echo "Création de old_manager.iam.hsm.tar..."
tar -cf /home/ubuntu/old_manager.iam.hsm.tar $EXCLUDES ./packages/manager/modules/iam/src

echo "Création de old_manager.iam.logs.tar..."
tar -cf /home/ubuntu/old_manager.iam.logs.tar $EXCLUDES \
  ./packages/manager/modules/log-to-customer ./packages/manager/modules/logs-to-customer

echo "Création de old_manager.iam.metrics.tar..."
tar -cf /home/ubuntu/old_manager.iam.metrics.tar $EXCLUDES \
  ./packages/manager/modules/metrics ./packages/manager/apps/metrics

echo "Création de old_manager.iam.okms.tar..."
tar -cf /home/ubuntu/old_manager.iam.okms.tar $EXCLUDES ./packages/manager/apps/okms

echo "Création de old_manager.iam.secret.tar..."
tar -cf /home/ubuntu/old_manager.iam.secret.tar $EXCLUDES ./packages/manager/modules/iam/src

echo "Création de old_manager.license.core.tar..."
tar -cf /home/ubuntu/old_manager.license.core.tar $EXCLUDES ./packages/manager/apps/dedicated/client/app/license

echo "Création de old_manager.license.cloudlinux.tar..."
tar -cf /home/ubuntu/old_manager.license.cloudlinux.tar $EXCLUDES ./packages/manager/apps/dedicated/client/app/license

echo "Création de old_manager.license.cpanel.tar..."
tar -cf /home/ubuntu/old_manager.license.cpanel.tar $EXCLUDES ./packages/manager/apps/dedicated/client/app/license

echo "Création de old_manager.license.directadmin.tar..."
tar -cf /home/ubuntu/old_manager.license.directadmin.tar $EXCLUDES ./packages/manager/apps/dedicated/client/app/license

echo "Création de old_manager.license.plesk.tar..."
tar -cf /home/ubuntu/old_manager.license.plesk.tar $EXCLUDES ./packages/manager/apps/dedicated/client/app/license

echo "Création de old_manager.license.sqlserver.tar..."
tar -cf /home/ubuntu/old_manager.license.sqlserver.tar $EXCLUDES ./packages/manager/apps/dedicated/client/app/license

echo "Création de old_manager.license.virtuozzo.tar..."
tar -cf /home/ubuntu/old_manager.license.virtuozzo.tar $EXCLUDES ./packages/manager/apps/dedicated/client/app/license

echo "Création de old_manager.license.windows.tar..."
tar -cf /home/ubuntu/old_manager.license.windows.tar $EXCLUDES ./packages/manager/apps/dedicated/client/app/license

echo "Création de old_manager.network.core.tar..."
tar -cf /home/ubuntu/old_manager.network.core.tar $EXCLUDES ./packages/manager/modules/network-common

echo "Création de old_manager.network.cdn.tar..."
tar -cf /home/ubuntu/old_manager.network.cdn.tar $EXCLUDES ./packages/manager/apps/dedicated/client/app/cdn

echo "Création de old_manager.network.cloud-connect.tar..."
tar -cf /home/ubuntu/old_manager.network.cloud-connect.tar $EXCLUDES \
  ./packages/manager/modules/cloud-connect ./packages/manager/apps/cloud-connect

echo "Création de old_manager.network.ip.tar..."
tar -cf /home/ubuntu/old_manager.network.ip.tar $EXCLUDES ./packages/manager/apps/ips

echo "Création de old_manager.network.load-balancer.tar..."
tar -cf /home/ubuntu/old_manager.network.load-balancer.tar $EXCLUDES \
  ./packages/manager/modules/iplb ./packages/manager/apps/iplb

echo "Création de old_manager.network.security.tar..."
tar -cf /home/ubuntu/old_manager.network.security.tar $EXCLUDES ./packages/manager/apps/dedicated/client/app/ip

echo "Création de old_manager.network.vrack.tar..."
tar -cf /home/ubuntu/old_manager.network.vrack.tar $EXCLUDES \
  ./packages/manager/modules/vrack ./packages/manager/apps/vrack

echo "Création de old_manager.network.vrack-services.tar..."
tar -cf /home/ubuntu/old_manager.network.vrack-services.tar $EXCLUDES ./packages/manager/apps/vrack-services

echo "Création de old_manager.private-cloud.core.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.core.tar $EXCLUDES ./packages/manager/apps/dedicated/client/app/dedicatedCloud

echo "Création de old_manager.private-cloud.nutanix.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.nutanix.tar $EXCLUDES \
  ./packages/manager/modules/nutanix ./packages/manager/apps/nutanix

echo "Création de old_manager.private-cloud.vmware.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.vmware.tar $EXCLUDES \
  ./packages/manager/apps/hpc-vmware-vsphere ./packages/manager/apps/hpc-vmware-public-vcf-aas

echo "Création de old_manager.private-cloud.veeam.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.veeam.tar $EXCLUDES \
  ./packages/manager/modules/veeam-enterprise ./packages/manager/apps/veeam-backup ./packages/manager/apps/veeam-enterprise

echo "Création de old_manager.private-cloud.managed-baremetal.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.managed-baremetal.tar $EXCLUDES ./packages/manager/apps/dedicated/client/app/managedBaremetal

echo "Création de old_manager.private-cloud.sap.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.sap.tar $EXCLUDES ./packages/manager/apps/sap-features-hub

echo "Création de old_manager.public-cloud.core.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.core.tar $EXCLUDES \
  ./packages/manager/modules/pci ./packages/manager/modules/pci-universe-components \
  ./packages/manager/modules/manager-pci-common ./packages/manager/apps/pci ./packages/manager/apps/public-cloud

echo "Création de old_manager.public-cloud.ai.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.ai.tar $EXCLUDES \
  ./packages/manager/apps/pci-ai-tools ./packages/manager/apps/pci-ai-endpoints

echo "Création de old_manager.public-cloud.block-storage.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.block-storage.tar $EXCLUDES \
  ./packages/manager/apps/pci-block-storage ./packages/manager/apps/pci-volume-backup ./packages/manager/apps/pci-volume-snapshot

echo "Création de old_manager.public-cloud.databases.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.databases.tar $EXCLUDES ./packages/manager/apps/pci-databases-analytics

echo "Création de old_manager.public-cloud.instances.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.instances.tar $EXCLUDES ./packages/manager/apps/pci-instances

echo "Création de old_manager.public-cloud.kubernetes.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.kubernetes.tar $EXCLUDES ./packages/manager/apps/pci-kubernetes

echo "Création de old_manager.public-cloud.load-balancer.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.load-balancer.tar $EXCLUDES ./packages/manager/apps/pci-load-balancer

echo "Création de old_manager.public-cloud.object-storage.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.object-storage.tar $EXCLUDES \
  ./packages/manager/apps/pci-object-storage ./packages/manager/apps/pci-cold-archive

echo "Création de old_manager.public-cloud.project.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.project.tar $EXCLUDES \
  ./packages/manager/apps/pci-billing ./packages/manager/apps/pci-quota ./packages/manager/apps/pci-users \
  ./packages/manager/apps/pci-ssh-keys ./packages/manager/apps/pci-vouchers ./packages/manager/apps/pci-contacts

echo "Création de old_manager.public-cloud.registry.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.registry.tar $EXCLUDES ./packages/manager/apps/pci-private-registry

echo "Création de old_manager.web-cloud.core.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.core.tar $EXCLUDES \
  ./packages/manager/modules/web-universe-components ./packages/manager/apps/web/client

echo "Création de old_manager.web-cloud.access.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.access.tar $EXCLUDES \
  ./packages/manager/modules/overthebox ./packages/manager/apps/overthebox ./packages/manager/apps/telecom/src/app/telecom/pack

echo "Création de old_manager.web-cloud.domains.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.domains.tar $EXCLUDES \
  ./packages/manager/apps/web-domains ./packages/manager/apps/web/client/app/domain

echo "Création de old_manager.web-cloud.emails.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.emails.tar $EXCLUDES \
  ./packages/manager/modules/email-domain ./packages/manager/modules/emailpro ./packages/manager/modules/exchange \
  ./packages/manager/apps/email-domain ./packages/manager/apps/email-pro ./packages/manager/apps/exchange \
  ./packages/manager/apps/web-office ./packages/manager/apps/zimbra

echo "Création de old_manager.web-cloud.hebergement.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.hebergement.tar $EXCLUDES \
  ./packages/manager/apps/web-hosting ./packages/manager/apps/web/client/app/hosting ./packages/manager/apps/web/client/app/private-database

echo "Création de old_manager.web-cloud.telecom.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.telecom.tar $EXCLUDES \
  ./packages/manager/modules/sms ./packages/manager/modules/freefax ./packages/manager/modules/carrier-sip \
  ./packages/manager/modules/telecom-universe-components ./packages/manager/modules/telecom-styles \
  ./packages/manager/modules/telecom-dashboard ./packages/manager/apps/telecom ./packages/manager/apps/sms \
  ./packages/manager/apps/freefax ./packages/manager/apps/carrier-sip

echo "Création de old_manager.all.tar..."
tar -cf /home/ubuntu/old_manager.all.tar $EXCLUDES .

echo ""
echo "=== Tars générés ==="
ls -lh /home/ubuntu/old_manager.*.tar
echo ""
echo "=== Vérification ==="
for f in /home/ubuntu/old_manager.*.tar; do c=$(tar -tf "$f" 2>/dev/null | wc -l); echo "$(basename $f): $c fichiers"; done
echo "=== Terminé ==="
