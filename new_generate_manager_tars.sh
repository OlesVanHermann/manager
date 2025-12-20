#!/bin/bash
set -e

echo "=== Génération des tars new_manager ==="
cd /home/ubuntu/aiapp/frontend

echo "Suppression des anciens new_manager.*.tar..."
rm -f /home/ubuntu/new_manager.*.tar

echo "Création de new_manager.core.tar..."
tar -cf /home/ubuntu/new_manager.core.tar \
  ./vite.config.ts ./package.json ./src/App.tsx ./src/main.tsx ./src/index.css \
  ./src/contexts/AuthContext.tsx ./src/design-system ./src/lib ./src/types \
  ./src/hooks/useAppNavigation.ts ./src/i18n ./src/services/api.ts ./src/services/auth.ts \
  ./public/locales/en/common.json ./public/locales/en/navigation.json ./public/locales/en/login.json \
  ./public/locales/fr/common.json ./public/locales/fr/navigation.json ./public/locales/fr/login.json

echo "Création de new_manager.home.core.tar..."
tar -cf /home/ubuntu/new_manager.home.core.tar \
  ./src/pages/home/index.tsx ./src/pages/home/styles.css ./src/pages/home/utils.ts \
  ./src/pages/home/useHomeData.ts ./src/pages/home/components \
  ./public/locales/en/home/index.json ./public/locales/en/home/dashboard.json \
  ./public/locales/fr/home/index.json ./public/locales/fr/home/dashboard.json

echo "Création de new_manager.home.account.tar..."
tar -cf /home/ubuntu/new_manager.home.account.tar \
  ./src/pages/home/account ./src/services/home.account.ts ./src/services/home.account.contacts.ts \
  ./src/services/home.account.security.ts ./src/services/home.account.procedures.ts \
  ./public/locales/en/home/account ./public/locales/fr/home/account

echo "Création de new_manager.home.api.tar..."
tar -cf /home/ubuntu/new_manager.home.api.tar \
  ./src/pages/home/api ./src/services/home.api.ts \
  ./public/locales/en/home/api ./public/locales/fr/home/api

echo "Création de new_manager.home.billing.tar..."
tar -cf /home/ubuntu/new_manager.home.billing.tar \
  ./src/pages/home/billing ./src/services/home.billing.ts ./src/services/home.billing.services.ts \
  ./src/services/home.billing.orders.ts ./src/services/home.billing.agreements.ts \
  ./public/locales/en/home/billing ./public/locales/fr/home/billing

echo "Création de new_manager.home.carbon.tar..."
tar -cf /home/ubuntu/new_manager.home.carbon.tar \
  ./src/pages/home/carbon ./src/services/home.carbon.ts \
  ./public/locales/en/home/carbon ./public/locales/fr/home/carbon

echo "Création de new_manager.home.support.tar..."
tar -cf /home/ubuntu/new_manager.home.support.tar \
  ./src/pages/home/support ./src/services/home.support.ts ./src/services/home.support.communication.ts \
  ./src/services/home.notifications.ts ./public/locales/en/home/support ./public/locales/fr/home/support

echo "Création de new_manager.bare-metal.core.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.core.tar \
  ./src/pages/bare-metal/index.tsx ./src/pages/bare-metal/styles.css \
  ./public/locales/en/bare-metal/index.json ./public/locales/fr/bare-metal/index.json

echo "Création de new_manager.bare-metal.dedicated.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.dedicated.tar \
  ./src/pages/bare-metal/dedicated ./src/services/bare-metal.dedicated.ts \
  ./public/locales/en/bare-metal/dedicated ./public/locales/fr/bare-metal/dedicated

echo "Création de new_manager.bare-metal.housing.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.housing.tar \
  ./src/pages/bare-metal/housing ./src/services/bare-metal.housing.ts \
  ./public/locales/en/bare-metal/housing ./public/locales/fr/bare-metal/housing

echo "Création de new_manager.bare-metal.nasha.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.nasha.tar \
  ./src/pages/bare-metal/nasha ./src/services/bare-metal.nasha.ts \
  ./public/locales/en/bare-metal/nasha ./public/locales/fr/bare-metal/nasha

echo "Création de new_manager.bare-metal.netapp.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.netapp.tar \
  ./src/pages/bare-metal/netapp ./src/services/bare-metal.netapp.ts \
  ./public/locales/en/bare-metal/netapp ./public/locales/fr/bare-metal/netapp

echo "Création de new_manager.bare-metal.vps.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.vps.tar \
  ./src/pages/bare-metal/vps ./src/services/bare-metal.vps.ts \
  ./public/locales/en/bare-metal/vps ./public/locales/fr/bare-metal/vps

echo "Création de new_manager.iam.core.tar..."
tar -cf /home/ubuntu/new_manager.iam.core.tar \
  ./src/pages/iam/index.tsx ./src/pages/iam/styles.css ./src/pages/iam/utils.tsx \
  ./src/pages/iam/components ./src/pages/iam/tabs ./src/services/iam.ts \
  ./public/locales/en/iam/index.json ./public/locales/en/iam/identities.json ./public/locales/en/iam/logs.json \
  ./public/locales/fr/iam/index.json ./public/locales/fr/iam/identities.json ./public/locales/fr/iam/logs.json

echo "Création de new_manager.iam.dbaas-logs.tar..."
tar -cf /home/ubuntu/new_manager.iam.dbaas-logs.tar \
  ./src/pages/iam/dbaas-logs ./src/services/iam.dbaas-logs.ts \
  ./public/locales/en/iam/dbaas-logs ./public/locales/fr/iam/dbaas-logs

echo "Création de new_manager.iam.hsm.tar..."
tar -cf /home/ubuntu/new_manager.iam.hsm.tar \
  ./src/pages/iam/hsm ./src/services/iam.hsm.ts \
  ./public/locales/en/iam/hsm ./public/locales/fr/iam/hsm

echo "Création de new_manager.iam.logs.tar..."
tar -cf /home/ubuntu/new_manager.iam.logs.tar \
  ./src/pages/iam/logs ./src/services/iam.logs.ts \
  ./public/locales/en/iam/logs.json ./public/locales/fr/iam/logs.json

echo "Création de new_manager.iam.metrics.tar..."
tar -cf /home/ubuntu/new_manager.iam.metrics.tar \
  ./src/pages/iam/metrics ./src/services/iam.metrics.ts \
  ./public/locales/en/iam/metrics ./public/locales/fr/iam/metrics

echo "Création de new_manager.iam.okms.tar..."
tar -cf /home/ubuntu/new_manager.iam.okms.tar \
  ./src/pages/iam/okms ./src/services/iam.okms.ts \
  ./public/locales/en/iam/okms ./public/locales/fr/iam/okms

echo "Création de new_manager.iam.secret.tar..."
tar -cf /home/ubuntu/new_manager.iam.secret.tar \
  ./src/pages/iam/secret ./src/services/iam.secret.ts \
  ./public/locales/en/iam/secret ./public/locales/fr/iam/secret

echo "Création de new_manager.license.core.tar..."
tar -cf /home/ubuntu/new_manager.license.core.tar \
  ./src/pages/license/index.tsx ./src/pages/license/styles.css ./src/services/license.ts \
  ./public/locales/en/license/index.json ./public/locales/fr/license/index.json

echo "Création de new_manager.license.cloudlinux.tar..."
tar -cf /home/ubuntu/new_manager.license.cloudlinux.tar ./src/pages/license/cloudlinux

echo "Création de new_manager.license.cpanel.tar..."
tar -cf /home/ubuntu/new_manager.license.cpanel.tar ./src/pages/license/cpanel

echo "Création de new_manager.license.directadmin.tar..."
tar -cf /home/ubuntu/new_manager.license.directadmin.tar ./src/pages/license/directadmin

echo "Création de new_manager.license.plesk.tar..."
tar -cf /home/ubuntu/new_manager.license.plesk.tar ./src/pages/license/plesk

echo "Création de new_manager.license.sqlserver.tar..."
tar -cf /home/ubuntu/new_manager.license.sqlserver.tar ./src/pages/license/sqlserver

echo "Création de new_manager.license.virtuozzo.tar..."
tar -cf /home/ubuntu/new_manager.license.virtuozzo.tar ./src/pages/license/virtuozzo

echo "Création de new_manager.license.windows.tar..."
tar -cf /home/ubuntu/new_manager.license.windows.tar ./src/pages/license/windows

echo "Création de new_manager.network.core.tar..."
tar -cf /home/ubuntu/new_manager.network.core.tar \
  ./src/pages/network/index.tsx ./src/pages/network/styles.css ./src/services/network.ts \
  ./public/locales/en/network/index.json ./public/locales/fr/network/index.json

echo "Création de new_manager.network.cdn.tar..."
tar -cf /home/ubuntu/new_manager.network.cdn.tar \
  ./src/pages/network/cdn ./src/services/network.cdn.ts \
  ./public/locales/en/network/cdn ./public/locales/fr/network/cdn

echo "Création de new_manager.network.cloud-connect.tar..."
tar -cf /home/ubuntu/new_manager.network.cloud-connect.tar \
  ./src/pages/network/cloud-connect ./src/services/network.cloud-connect.ts \
  ./public/locales/en/network/cloud-connect ./public/locales/fr/network/cloud-connect

echo "Création de new_manager.network.ip.tar..."
tar -cf /home/ubuntu/new_manager.network.ip.tar \
  ./src/pages/network/ip ./public/locales/en/network/ip ./public/locales/fr/network/ip

echo "Création de new_manager.network.load-balancer.tar..."
tar -cf /home/ubuntu/new_manager.network.load-balancer.tar \
  ./src/pages/network/load-balancer ./public/locales/en/network/load-balancer ./public/locales/fr/network/load-balancer

echo "Création de new_manager.network.security.tar..."
tar -cf /home/ubuntu/new_manager.network.security.tar \
  ./src/pages/network/security ./src/services/network.security.ts \
  ./public/locales/en/network/security ./public/locales/fr/network/security

echo "Création de new_manager.network.vrack.tar..."
tar -cf /home/ubuntu/new_manager.network.vrack.tar \
  ./src/pages/network/vrack ./public/locales/en/network/vrack ./public/locales/fr/network/vrack

echo "Création de new_manager.network.vrack-services.tar..."
tar -cf /home/ubuntu/new_manager.network.vrack-services.tar \
  ./src/pages/network/vrack-services ./src/services/network.vrack-services.ts \
  ./public/locales/en/network/vrack-services ./public/locales/fr/network/vrack-services

echo "Création de new_manager.private-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.core.tar \
  ./src/pages/private-cloud/index.tsx ./src/pages/private-cloud/styles.css ./src/services/private-cloud.ts \
  ./public/locales/en/private-cloud/index.json ./public/locales/fr/private-cloud/index.json

echo "Création de new_manager.private-cloud.nutanix.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.nutanix.tar \
  ./src/pages/private-cloud/nutanix ./src/services/private-cloud.nutanix.ts \
  ./public/locales/en/private-cloud/nutanix ./public/locales/fr/private-cloud/nutanix

echo "Création de new_manager.private-cloud.vmware.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.vmware.tar \
  ./src/pages/private-cloud/vmware ./src/services/private-cloud.vmware.ts \
  ./public/locales/en/private-cloud/vmware ./public/locales/fr/private-cloud/vmware

echo "Création de new_manager.private-cloud.veeam.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.veeam.tar ./src/pages/private-cloud/veeam

echo "Création de new_manager.private-cloud.managed-baremetal.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.managed-baremetal.tar ./src/pages/private-cloud/managed-baremetal

echo "Création de new_manager.private-cloud.sap.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.sap.tar ./src/pages/private-cloud/sap

echo "Création de new_manager.public-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.core.tar \
  ./src/pages/public-cloud/index.tsx ./src/pages/public-cloud/styles.css ./src/services/public-cloud.ts \
  ./public/locales/en/public-cloud/index.json ./public/locales/fr/public-cloud/index.json

echo "Création de new_manager.public-cloud.ai.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.ai.tar \
  ./src/pages/public-cloud/ai ./src/services/public-cloud.ai.ts \
  ./public/locales/en/public-cloud/ai ./public/locales/fr/public-cloud/ai

echo "Création de new_manager.public-cloud.block-storage.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.block-storage.tar \
  ./src/pages/public-cloud/block-storage ./src/services/public-cloud.block-storage.ts \
  ./public/locales/en/public-cloud/block-storage ./public/locales/fr/public-cloud/block-storage

echo "Création de new_manager.public-cloud.databases.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.databases.tar \
  ./src/pages/public-cloud/databases ./src/services/public-cloud.databases.ts \
  ./public/locales/en/public-cloud/databases ./public/locales/fr/public-cloud/databases

echo "Création de new_manager.public-cloud.instances.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.instances.tar \
  ./src/pages/public-cloud/instances ./src/services/public-cloud.instances.ts \
  ./public/locales/en/public-cloud/instances ./public/locales/fr/public-cloud/instances

echo "Création de new_manager.public-cloud.kubernetes.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.kubernetes.tar \
  ./src/pages/public-cloud/kubernetes ./src/services/public-cloud.kubernetes.ts \
  ./public/locales/en/public-cloud/kubernetes ./public/locales/fr/public-cloud/kubernetes

echo "Création de new_manager.public-cloud.load-balancer.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.load-balancer.tar \
  ./src/pages/public-cloud/load-balancer ./src/services/public-cloud.load-balancer.ts \
  ./public/locales/en/public-cloud/load-balancer ./public/locales/fr/public-cloud/load-balancer

echo "Création de new_manager.public-cloud.object-storage.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.object-storage.tar \
  ./src/pages/public-cloud/object-storage ./src/services/public-cloud.object-storage.ts \
  ./public/locales/en/public-cloud/object-storage ./public/locales/fr/public-cloud/object-storage

echo "Création de new_manager.public-cloud.project.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.project.tar \
  ./src/pages/public-cloud/project ./public/locales/en/public-cloud/project ./public/locales/fr/public-cloud/project

echo "Création de new_manager.public-cloud.registry.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.registry.tar \
  ./src/pages/public-cloud/registry ./src/services/public-cloud.registry.ts \
  ./public/locales/en/public-cloud/registry ./public/locales/fr/public-cloud/registry

echo "Création de new_manager.web-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.core.tar \
  ./src/pages/web-cloud/index.tsx ./src/pages/web-cloud/styles.css ./src/pages/web-cloud/shared \
  ./public/locales/en/web-cloud/index.json ./public/locales/fr/web-cloud/index.json

echo "Création de new_manager.web-cloud.access.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.access.tar \
  ./src/pages/web-cloud/shared ./src/pages/web-cloud/access \
  ./src/services/web-cloud.pack-xdsl.ts ./src/services/web-cloud.overthebox.ts \
  ./public/locales/en/web-cloud/access ./public/locales/fr/web-cloud/access

echo "Création de new_manager.web-cloud.domains.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.domains.tar \
  ./src/pages/web-cloud/shared ./src/pages/web-cloud/domains \
  ./src/services/web-cloud.domains.ts ./src/services/web-cloud.dns-zones.ts \
  ./public/locales/en/web-cloud/domains ./public/locales/en/web-cloud/dns-zones \
  ./public/locales/fr/web-cloud/domains ./public/locales/fr/web-cloud/dns-zones

echo "Création de new_manager.web-cloud.emails.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.tar \
  ./src/pages/web-cloud/shared ./src/pages/web-cloud/emails \
  ./src/services/web-cloud.email-domain.ts ./src/services/web-cloud.email-pro.ts \
  ./src/services/web-cloud.exchange.ts ./src/services/web-cloud.office.ts ./src/services/web-cloud.zimbra.ts \
  ./public/locales/en/web-cloud/emails ./public/locales/fr/web-cloud/emails

echo "Création de new_manager.web-cloud.hebergement.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.tar \
  ./src/pages/web-cloud/shared ./src/pages/web-cloud/hebergement \
  ./src/services/web-cloud.hosting.ts ./src/services/web-cloud.private-database.ts \
  ./public/locales/en/web-cloud/hebergement ./public/locales/fr/web-cloud/hebergement

echo "Création de new_manager.web-cloud.telecom.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.tar \
  ./src/pages/web-cloud/shared ./src/pages/web-cloud/telecom \
  ./src/services/web-cloud.voip.ts ./src/services/web-cloud.sms.ts \
  ./src/services/web-cloud.fax.ts ./src/services/web-cloud.carrier-sip.ts \
  ./public/locales/en/web-cloud/telecom ./public/locales/fr/web-cloud/telecom

echo "Création de new_manager.all.tar..."
tar -cf /home/ubuntu/new_manager.all.tar --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='*.lock' .

echo ""
echo "=== Tars générés ==="
ls -lh /home/ubuntu/new_manager.*.tar
echo ""
echo "=== Vérification ==="
for f in /home/ubuntu/new_manager.*.tar; do c=$(tar -tf "$f" 2>/dev/null | wc -l); echo "$(basename $f): $c fichiers"; done
echo "=== Terminé ==="
