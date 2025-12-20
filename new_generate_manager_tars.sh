#!/bin/bash
set -e

echo "=== Génération des tars new_manager ==="
cd /home/ubuntu/aiapp/frontend

# Nettoyage des anciens tars new_manager UNIQUEMENT
echo "Suppression des anciens new_manager.*.tar..."
rm -f /home/ubuntu/new_manager.*.tar

# ============================================================
# CORE GLOBAL
# ============================================================
echo "Création new_manager.core.tar..."
tar -cf /home/ubuntu/new_manager.core.tar \
    ./vite.config.ts \
    ./package.json \
    ./tsconfig.json \
    ./tsconfig.node.json \
    ./tailwind.config.js \
    ./postcss.config.js \
    ./index.html \
    ./src/App.tsx \
    ./src/main.tsx \
    ./src/index.css \
    ./src/lib \
    ./src/design-system \
    ./src/contexts \
    ./src/types \
    ./src/hooks \
    ./src/i18n \
    ./src/services

# ============================================================
# BARE-METAL
# ============================================================
echo "Création new_manager.bare-metal.core.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.core.tar \
    ./src/pages/bare-metal/index.tsx \
    ./src/pages/bare-metal/styles.css \
    ./public/locales/en/bare-metal/index.json \
    ./public/locales/fr/bare-metal/index.json

echo "Création new_manager.bare-metal.dedicated.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.dedicated.tar \
    ./src/pages/bare-metal/dedicated \
    ./public/locales/en/bare-metal/dedicated \
    ./public/locales/fr/bare-metal/dedicated

echo "Création new_manager.bare-metal.housing.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.housing.tar \
    ./src/pages/bare-metal/housing \
    ./public/locales/en/bare-metal/housing \
    ./public/locales/fr/bare-metal/housing

echo "Création new_manager.bare-metal.nasha.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.nasha.tar \
    ./src/pages/bare-metal/nasha \
    ./public/locales/en/bare-metal/nasha \
    ./public/locales/fr/bare-metal/nasha

echo "Création new_manager.bare-metal.netapp.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.netapp.tar \
    ./src/pages/bare-metal/netapp \
    ./public/locales/en/bare-metal/netapp \
    ./public/locales/fr/bare-metal/netapp

echo "Création new_manager.bare-metal.vps.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.vps.tar \
    ./src/pages/bare-metal/vps \
    ./public/locales/en/bare-metal/vps \
    ./public/locales/fr/bare-metal/vps

# ============================================================
# HOME
# ============================================================
echo "Création new_manager.home.core.tar..."
tar -cf /home/ubuntu/new_manager.home.core.tar \
    ./src/pages/home/index.tsx \
    ./src/pages/home/styles.css \
    ./src/pages/home/utils.ts \
    ./src/pages/home/useHomeData.ts \
    ./src/pages/home/components \
    ./public/locales/en/home/index.json \
    ./public/locales/en/home/dashboard.json \
    ./public/locales/fr/home/index.json \
    ./public/locales/fr/home/dashboard.json

echo "Création new_manager.home.account.tar..."
tar -cf /home/ubuntu/new_manager.home.account.tar \
    ./src/pages/home/account \
    ./public/locales/en/home/account \
    ./public/locales/fr/home/account

echo "Création new_manager.home.api.tar..."
tar -cf /home/ubuntu/new_manager.home.api.tar \
    ./src/pages/home/api \
    ./public/locales/en/home/api \
    ./public/locales/fr/home/api

echo "Création new_manager.home.billing.tar..."
tar -cf /home/ubuntu/new_manager.home.billing.tar \
    ./src/pages/home/billing \
    ./public/locales/en/home/billing \
    ./public/locales/fr/home/billing

echo "Création new_manager.home.carbon.tar..."
tar -cf /home/ubuntu/new_manager.home.carbon.tar \
    ./src/pages/home/carbon \
    ./public/locales/en/home/carbon \
    ./public/locales/fr/home/carbon

echo "Création new_manager.home.support.tar..."
tar -cf /home/ubuntu/new_manager.home.support.tar \
    ./src/pages/home/support \
    ./public/locales/en/home/support \
    ./public/locales/fr/home/support

# ============================================================
# IAM
# ============================================================
echo "Création new_manager.iam.core.tar..."
tar -cf /home/ubuntu/new_manager.iam.core.tar \
    ./src/pages/iam/index.tsx \
    ./src/pages/iam/styles.css \
    ./src/pages/iam/utils.tsx \
    ./src/pages/iam/components \
    ./src/pages/iam/tabs \
    ./public/locales/en/iam/index.json \
    ./public/locales/en/iam/identities.json \
    ./public/locales/en/iam/logs.json \
    ./public/locales/fr/iam/index.json \
    ./public/locales/fr/iam/identities.json \
    ./public/locales/fr/iam/logs.json

echo "Création new_manager.iam.dbaas-logs.tar..."
tar -cf /home/ubuntu/new_manager.iam.dbaas-logs.tar \
    ./src/pages/iam/dbaas-logs \
    ./public/locales/en/iam/dbaas-logs \
    ./public/locales/fr/iam/dbaas-logs

echo "Création new_manager.iam.hsm.tar..."
tar -cf /home/ubuntu/new_manager.iam.hsm.tar \
    ./src/pages/iam/hsm \
    ./public/locales/en/iam/hsm \
    ./public/locales/fr/iam/hsm

echo "Création new_manager.iam.logs.tar..."
tar -cf /home/ubuntu/new_manager.iam.logs.tar \
    ./src/pages/iam/logs \
    ./public/locales/en/iam/dbaas-logs \
    ./public/locales/fr/iam/dbaas-logs

echo "Création new_manager.iam.metrics.tar..."
tar -cf /home/ubuntu/new_manager.iam.metrics.tar \
    ./src/pages/iam/metrics \
    ./public/locales/en/iam/metrics \
    ./public/locales/fr/iam/metrics

echo "Création new_manager.iam.okms.tar..."
tar -cf /home/ubuntu/new_manager.iam.okms.tar \
    ./src/pages/iam/okms \
    ./public/locales/en/iam/okms \
    ./public/locales/fr/iam/okms

echo "Création new_manager.iam.secret.tar..."
tar -cf /home/ubuntu/new_manager.iam.secret.tar \
    ./src/pages/iam/secret \
    ./public/locales/en/iam/secret \
    ./public/locales/fr/iam/secret

# ============================================================
# LICENSE
# ============================================================
echo "Création new_manager.license.core.tar..."
tar -cf /home/ubuntu/new_manager.license.core.tar \
    ./src/pages/license \
    ./public/locales/en/license \
    ./public/locales/fr/license

# ============================================================
# NETWORK
# ============================================================
echo "Création new_manager.network.core.tar..."
tar -cf /home/ubuntu/new_manager.network.core.tar \
    ./src/pages/network/index.tsx \
    ./src/pages/network/styles.css \
    ./public/locales/en/network/index.json \
    ./public/locales/fr/network/index.json

echo "Création new_manager.network.cdn.tar..."
tar -cf /home/ubuntu/new_manager.network.cdn.tar \
    ./src/pages/network/cdn \
    ./public/locales/en/network/cdn \
    ./public/locales/fr/network/cdn

echo "Création new_manager.network.cloud-connect.tar..."
tar -cf /home/ubuntu/new_manager.network.cloud-connect.tar \
    ./src/pages/network/cloud-connect \
    ./public/locales/en/network/cloud-connect \
    ./public/locales/fr/network/cloud-connect

echo "Création new_manager.network.ip.tar..."
tar -cf /home/ubuntu/new_manager.network.ip.tar \
    ./src/pages/network/ip \
    ./public/locales/en/network/ip \
    ./public/locales/fr/network/ip

echo "Création new_manager.network.load-balancer.tar..."
tar -cf /home/ubuntu/new_manager.network.load-balancer.tar \
    ./src/pages/network/load-balancer \
    ./public/locales/en/network/load-balancer \
    ./public/locales/fr/network/load-balancer

echo "Création new_manager.network.security.tar..."
tar -cf /home/ubuntu/new_manager.network.security.tar \
    ./src/pages/network/security \
    ./public/locales/en/network/security \
    ./public/locales/fr/network/security

echo "Création new_manager.network.vrack.tar..."
tar -cf /home/ubuntu/new_manager.network.vrack.tar \
    ./src/pages/network/vrack \
    ./public/locales/en/network/vrack \
    ./public/locales/fr/network/vrack

echo "Création new_manager.network.vrack-services.tar..."
tar -cf /home/ubuntu/new_manager.network.vrack-services.tar \
    ./src/pages/network/vrack-services \
    ./public/locales/en/network/vrack-services \
    ./public/locales/fr/network/vrack-services

# ============================================================
# PRIVATE-CLOUD
# ============================================================
echo "Création new_manager.private-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.core.tar \
    ./src/pages/private-cloud/index.tsx \
    ./src/pages/private-cloud/styles.css \
    ./public/locales/en/private-cloud/index.json \
    ./public/locales/fr/private-cloud/index.json

echo "Création new_manager.private-cloud.nutanix.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.nutanix.tar \
    ./src/pages/private-cloud/nutanix \
    ./public/locales/en/private-cloud/nutanix \
    ./public/locales/fr/private-cloud/nutanix

echo "Création new_manager.private-cloud.vmware.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.vmware.tar \
    ./src/pages/private-cloud/vmware \
    ./public/locales/en/private-cloud/vmware \
    ./public/locales/fr/private-cloud/vmware

# ============================================================
# PUBLIC-CLOUD
# ============================================================
echo "Création new_manager.public-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.core.tar \
    ./src/pages/public-cloud/index.tsx \
    ./src/pages/public-cloud/styles.css \
    ./public/locales/en/public-cloud/index.json \
    ./public/locales/fr/public-cloud/index.json

echo "Création new_manager.public-cloud.ai.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.ai.tar \
    ./src/pages/public-cloud/ai \
    ./public/locales/en/public-cloud/ai \
    ./public/locales/fr/public-cloud/ai

echo "Création new_manager.public-cloud.block-storage.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.block-storage.tar \
    ./src/pages/public-cloud/block-storage \
    ./public/locales/en/public-cloud/block-storage \
    ./public/locales/fr/public-cloud/block-storage

echo "Création new_manager.public-cloud.databases.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.databases.tar \
    ./src/pages/public-cloud/databases \
    ./public/locales/en/public-cloud/databases \
    ./public/locales/fr/public-cloud/databases

echo "Création new_manager.public-cloud.instances.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.instances.tar \
    ./src/pages/public-cloud/instances \
    ./public/locales/en/public-cloud/instances \
    ./public/locales/fr/public-cloud/instances

echo "Création new_manager.public-cloud.kubernetes.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.kubernetes.tar \
    ./src/pages/public-cloud/kubernetes \
    ./public/locales/en/public-cloud/kubernetes \
    ./public/locales/fr/public-cloud/kubernetes

echo "Création new_manager.public-cloud.load-balancer.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.load-balancer.tar \
    ./src/pages/public-cloud/load-balancer \
    ./public/locales/en/public-cloud/load-balancer \
    ./public/locales/fr/public-cloud/load-balancer

echo "Création new_manager.public-cloud.object-storage.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.object-storage.tar \
    ./src/pages/public-cloud/object-storage \
    ./public/locales/en/public-cloud/object-storage \
    ./public/locales/fr/public-cloud/object-storage

echo "Création new_manager.public-cloud.project.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.project.tar \
    ./src/pages/public-cloud/project \
    ./public/locales/en/public-cloud/project \
    ./public/locales/fr/public-cloud/project

echo "Création new_manager.public-cloud.registry.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.registry.tar \
    ./src/pages/public-cloud/registry \
    ./public/locales/en/public-cloud/registry \
    ./public/locales/fr/public-cloud/registry

# ============================================================
# WEB-CLOUD
# ============================================================
echo "Création new_manager.web-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.core.tar \
    ./src/pages/web-cloud/index.tsx \
    ./src/pages/web-cloud/styles.css \
    ./src/pages/web-cloud/shared \
    ./public/locales/en/web-cloud/index.json \
    ./public/locales/fr/web-cloud/index.json

echo "Création new_manager.web-cloud.access.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.access.tar \
    ./src/pages/web-cloud/access \
    ./src/pages/web-cloud/shared \
    ./public/locales/en/web-cloud/access \
    ./public/locales/fr/web-cloud/access

echo "Création new_manager.web-cloud.domains-dns.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.domains-dns.tar \
    ./src/pages/web-cloud/domains-dns \
    ./src/pages/web-cloud/shared \
    ./public/locales/en/web-cloud/domains-dns \
    ./public/locales/en/web-cloud/domains \
    ./public/locales/en/web-cloud/dns-zones \
    ./public/locales/fr/web-cloud/domains-dns \
    ./public/locales/fr/web-cloud/domains \
    ./public/locales/fr/web-cloud/dns-zones

echo "Création new_manager.web-cloud.emails.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.tar \
    ./src/pages/web-cloud/emails \
    ./src/pages/web-cloud/shared \
    ./public/locales/en/web-cloud/emails \
    ./public/locales/en/web-cloud/email-pro \
    ./public/locales/en/web-cloud/email-domain \
    ./public/locales/en/web-cloud/exchange \
    ./public/locales/en/web-cloud/office \
    ./public/locales/en/web-cloud/zimbra \
    ./public/locales/fr/web-cloud/emails \
    ./public/locales/fr/web-cloud/email-pro \
    ./public/locales/fr/web-cloud/email-domain \
    ./public/locales/fr/web-cloud/exchange \
    ./public/locales/fr/web-cloud/office \
    ./public/locales/fr/web-cloud/zimbra

echo "Création new_manager.web-cloud.hebergement.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.tar \
    ./src/pages/web-cloud/hebergement \
    ./src/pages/web-cloud/shared \
    ./public/locales/en/web-cloud/hebergement \
    ./public/locales/en/web-cloud/hosting \
    ./public/locales/en/web-cloud/private-database \
    ./public/locales/fr/web-cloud/hebergement \
    ./public/locales/fr/web-cloud/hosting \
    ./public/locales/fr/web-cloud/private-database

echo "Création new_manager.web-cloud.telecom.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.tar \
    ./src/pages/web-cloud/telecom \
    ./src/pages/web-cloud/shared \
    ./public/locales/en/web-cloud/telecom \
    ./public/locales/en/web-cloud/voip \
    ./public/locales/en/web-cloud/sms \
    ./public/locales/en/web-cloud/fax \
    ./public/locales/en/web-cloud/carrier-sip \
    ./public/locales/fr/web-cloud/telecom \
    ./public/locales/fr/web-cloud/voip \
    ./public/locales/fr/web-cloud/sms \
    ./public/locales/fr/web-cloud/fax \
    ./public/locales/fr/web-cloud/carrier-sip

# ============================================================
# ALL
# ============================================================
echo "Création new_manager.all.tar..."
tar -cf /home/ubuntu/new_manager.all.tar \
    ./src \
    ./public/locales \
    ./vite.config.ts \
    ./package.json \
    ./tsconfig.json \
    ./tsconfig.node.json \
    ./tailwind.config.js \
    ./postcss.config.js \
    ./index.html

# ============================================================
# RÉSUMÉ
# ============================================================
echo ""
echo "=== Tars générés ==="
ls -lh /home/ubuntu/new_manager.*.tar | awk '{print $9, $5}'
echo ""
echo "Total: $(ls /home/ubuntu/new_manager.*.tar | wc -l) tars"
