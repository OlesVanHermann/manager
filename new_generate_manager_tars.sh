#!/bin/bash
set -e

echo "=== Génération des tars new_manager ==="
cd /home/ubuntu/aiapp/frontend

# Suppression des anciens tars (UNIQUEMENT new_manager)
rm -f /home/ubuntu/new_manager.*.tar

# ============================================================
# TARS GÉNÉRAUX
# ============================================================

echo "Création new_manager.core.tar..."
tar -cf /home/ubuntu/new_manager.core.tar \
    ./vite.config.ts \
    ./package.json \
    ./index.html \
    ./tsconfig.json \
    ./tsconfig.node.json \
    ./tailwind.config.js \
    ./postcss.config.js \
    ./prompt_react.md \
    ./npm_install.sh \
    ./public/favicon.svg \
    ./scripts \
    ./src/components \
    ./src/contexts \
    ./src/design-system \
    ./src/hooks \
    ./src/i18n \
    ./src/lib \
    ./src/services \
    ./src/styles \
    ./src/types \
    ./src/App.tsx \
    ./src/main.tsx \
    ./src/index.css

echo "Création new_manager.locales.tar..."
tar -cf /home/ubuntu/new_manager.locales.tar \
    ./public/locales

echo "Création new_manager.login.tar..."
tar -cf /home/ubuntu/new_manager.login.tar \
    ./src/pages/Login.tsx \
    ./src/pages/Login.css

echo "Création new_manager.placeholder.tar..."
tar -cf /home/ubuntu/new_manager.placeholder.tar \
    ./src/pages/_placeholder

echo "Création new_manager.all.tar..."
tar -cf /home/ubuntu/new_manager.all.tar .

# ============================================================
# BARE-METAL
# ============================================================

echo "Création new_manager.bare-metal.core.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.core.tar \
    ./src/pages/bare-metal/index.tsx \
    ./src/pages/bare-metal/styles.css

echo "Création new_manager.bare-metal.dedicated.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.dedicated.tar \
    ./src/pages/bare-metal/dedicated

echo "Création new_manager.bare-metal.housing.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.housing.tar \
    ./src/pages/bare-metal/housing

echo "Création new_manager.bare-metal.nasha.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.nasha.tar \
    ./src/pages/bare-metal/nasha

echo "Création new_manager.bare-metal.netapp.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.netapp.tar \
    ./src/pages/bare-metal/netapp

echo "Création new_manager.bare-metal.vps.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.vps.tar \
    ./src/pages/bare-metal/vps

# ============================================================
# HOME
# ============================================================

echo "Création new_manager.home.core.tar..."
tar -cf /home/ubuntu/new_manager.home.core.tar \
    ./src/pages/home/index.tsx \
    ./src/pages/home/styles.css \
    ./src/pages/home/useHomeData.ts \
    ./src/pages/home/utils.ts \
    ./src/pages/home/components

echo "Création new_manager.home.account.tar..."
tar -cf /home/ubuntu/new_manager.home.account.tar \
    ./src/pages/home/account

echo "Création new_manager.home.api.tar..."
tar -cf /home/ubuntu/new_manager.home.api.tar \
    ./src/pages/home/api

echo "Création new_manager.home.billing.tar..."
tar -cf /home/ubuntu/new_manager.home.billing.tar \
    ./src/pages/home/billing

echo "Création new_manager.home.carbon.tar..."
tar -cf /home/ubuntu/new_manager.home.carbon.tar \
    ./src/pages/home/carbon

echo "Création new_manager.home.support.tar..."
tar -cf /home/ubuntu/new_manager.home.support.tar \
    ./src/pages/home/support

# ============================================================
# IAM
# ============================================================

echo "Création new_manager.iam.core.tar..."
tar -cf /home/ubuntu/new_manager.iam.core.tar \
    ./src/pages/iam/index.tsx \
    ./src/pages/iam/styles.css \
    ./src/pages/iam/utils.tsx \
    ./src/pages/iam/components \
    ./src/pages/iam/tabs

echo "Création new_manager.iam.dbaas-logs.tar..."
tar -cf /home/ubuntu/new_manager.iam.dbaas-logs.tar \
    ./src/pages/iam/dbaas-logs

echo "Création new_manager.iam.hsm.tar..."
tar -cf /home/ubuntu/new_manager.iam.hsm.tar \
    ./src/pages/iam/hsm

echo "Création new_manager.iam.logs.tar..."
tar -cf /home/ubuntu/new_manager.iam.logs.tar \
    ./src/pages/iam/logs

echo "Création new_manager.iam.metrics.tar..."
tar -cf /home/ubuntu/new_manager.iam.metrics.tar \
    ./src/pages/iam/metrics

echo "Création new_manager.iam.okms.tar..."
tar -cf /home/ubuntu/new_manager.iam.okms.tar \
    ./src/pages/iam/okms

echo "Création new_manager.iam.secret.tar..."
tar -cf /home/ubuntu/new_manager.iam.secret.tar \
    ./src/pages/iam/secret

# ============================================================
# LICENSE
# ============================================================

echo "Création new_manager.license.core.tar..."
tar -cf /home/ubuntu/new_manager.license.core.tar \
    ./src/pages/license/index.tsx \
    ./src/pages/license/styles.css

echo "Création new_manager.license.cloudlinux.tar..."
tar -cf /home/ubuntu/new_manager.license.cloudlinux.tar \
    ./src/pages/license/cloudlinux

echo "Création new_manager.license.cpanel.tar..."
tar -cf /home/ubuntu/new_manager.license.cpanel.tar \
    ./src/pages/license/cpanel

echo "Création new_manager.license.directadmin.tar..."
tar -cf /home/ubuntu/new_manager.license.directadmin.tar \
    ./src/pages/license/directadmin

echo "Création new_manager.license.plesk.tar..."
tar -cf /home/ubuntu/new_manager.license.plesk.tar \
    ./src/pages/license/plesk

echo "Création new_manager.license.sqlserver.tar..."
tar -cf /home/ubuntu/new_manager.license.sqlserver.tar \
    ./src/pages/license/sqlserver

echo "Création new_manager.license.virtuozzo.tar..."
tar -cf /home/ubuntu/new_manager.license.virtuozzo.tar \
    ./src/pages/license/virtuozzo

echo "Création new_manager.license.windows.tar..."
tar -cf /home/ubuntu/new_manager.license.windows.tar \
    ./src/pages/license/windows

# ============================================================
# NETWORK
# ============================================================

echo "Création new_manager.network.core.tar..."
tar -cf /home/ubuntu/new_manager.network.core.tar \
    ./src/pages/network/index.tsx \
    ./src/pages/network/styles.css

echo "Création new_manager.network.cdn.tar..."
tar -cf /home/ubuntu/new_manager.network.cdn.tar \
    ./src/pages/network/cdn

echo "Création new_manager.network.cloud-connect.tar..."
tar -cf /home/ubuntu/new_manager.network.cloud-connect.tar \
    ./src/pages/network/cloud-connect

echo "Création new_manager.network.ip.tar..."
tar -cf /home/ubuntu/new_manager.network.ip.tar \
    ./src/pages/network/ip

echo "Création new_manager.network.load-balancer.tar..."
tar -cf /home/ubuntu/new_manager.network.load-balancer.tar \
    ./src/pages/network/load-balancer

echo "Création new_manager.network.security.tar..."
tar -cf /home/ubuntu/new_manager.network.security.tar \
    ./src/pages/network/security

echo "Création new_manager.network.vrack.tar..."
tar -cf /home/ubuntu/new_manager.network.vrack.tar \
    ./src/pages/network/vrack

echo "Création new_manager.network.vrack-services.tar..."
tar -cf /home/ubuntu/new_manager.network.vrack-services.tar \
    ./src/pages/network/vrack-services

# ============================================================
# PRIVATE-CLOUD
# ============================================================

echo "Création new_manager.private-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.core.tar \
    ./src/pages/private-cloud/index.tsx \
    ./src/pages/private-cloud/styles.css

echo "Création new_manager.private-cloud.managed-baremetal.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.managed-baremetal.tar \
    ./src/pages/private-cloud/managed-baremetal

echo "Création new_manager.private-cloud.nutanix.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.nutanix.tar \
    ./src/pages/private-cloud/nutanix

echo "Création new_manager.private-cloud.sap.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.sap.tar \
    ./src/pages/private-cloud/sap

echo "Création new_manager.private-cloud.veeam.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.veeam.tar \
    ./src/pages/private-cloud/veeam

echo "Création new_manager.private-cloud.vmware.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.vmware.tar \
    ./src/pages/private-cloud/vmware

# ============================================================
# PUBLIC-CLOUD
# ============================================================

echo "Création new_manager.public-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.core.tar \
    ./src/pages/public-cloud/index.tsx \
    ./src/pages/public-cloud/styles.css

echo "Création new_manager.public-cloud.ai.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.ai.tar \
    ./src/pages/public-cloud/ai

echo "Création new_manager.public-cloud.block-storage.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.block-storage.tar \
    ./src/pages/public-cloud/block-storage

echo "Création new_manager.public-cloud.databases.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.databases.tar \
    ./src/pages/public-cloud/databases

echo "Création new_manager.public-cloud.instances.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.instances.tar \
    ./src/pages/public-cloud/instances

echo "Création new_manager.public-cloud.kubernetes.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.kubernetes.tar \
    ./src/pages/public-cloud/kubernetes

echo "Création new_manager.public-cloud.load-balancer.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.load-balancer.tar \
    ./src/pages/public-cloud/load-balancer

echo "Création new_manager.public-cloud.object-storage.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.object-storage.tar \
    ./src/pages/public-cloud/object-storage

echo "Création new_manager.public-cloud.project.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.project.tar \
    ./src/pages/public-cloud/project

echo "Création new_manager.public-cloud.registry.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.registry.tar \
    ./src/pages/public-cloud/registry

# ============================================================
# WEB-CLOUD
# ============================================================

echo "Création new_manager.web-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.core.tar \
    ./src/pages/web-cloud/index.tsx \
    ./src/pages/web-cloud/styles.css \
    ./src/pages/web-cloud/shared

echo "Création new_manager.web-cloud.access.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.access.tar \
    ./src/pages/web-cloud/access/index.tsx

echo "Création new_manager.web-cloud.access.overthebox.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.access.overthebox.tar \
    ./src/pages/web-cloud/access/overthebox

echo "Création new_manager.web-cloud.access.pack-xdsl.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.access.pack-xdsl.tar \
    ./src/pages/web-cloud/access/pack-xdsl

echo "Création new_manager.web-cloud.alldom.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.alldom.tar \
    ./src/pages/web-cloud/alldom

echo "Création new_manager.web-cloud.domains.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.domains.tar \
    ./src/pages/web-cloud/domains

echo "Création new_manager.web-cloud.emails.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.tar \
    ./src/pages/web-cloud/emails/index.tsx

echo "Création new_manager.web-cloud.emails.email-domain.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.email-domain.tar \
    ./src/pages/web-cloud/emails/email-domain

echo "Création new_manager.web-cloud.emails.email-pro.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.email-pro.tar \
    ./src/pages/web-cloud/emails/email-pro

echo "Création new_manager.web-cloud.emails.exchange.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.exchange.tar \
    ./src/pages/web-cloud/emails/exchange

echo "Création new_manager.web-cloud.emails.office.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.office.tar \
    ./src/pages/web-cloud/emails/office

echo "Création new_manager.web-cloud.emails.zimbra.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.zimbra.tar \
    ./src/pages/web-cloud/emails/zimbra

echo "Création new_manager.web-cloud.hebergement.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.tar \
    ./src/pages/web-cloud/hebergement/index.tsx

echo "Création new_manager.web-cloud.hebergement.hosting.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.hosting.tar \
    ./src/pages/web-cloud/hebergement/hosting

echo "Création new_manager.web-cloud.hebergement.private-database.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.private-database.tar \
    ./src/pages/web-cloud/hebergement/private-database

echo "Création new_manager.web-cloud.telecom.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.tar \
    ./src/pages/web-cloud/telecom/index.tsx

echo "Création new_manager.web-cloud.telecom.carrier-sip.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.carrier-sip.tar \
    ./src/pages/web-cloud/telecom/carrier-sip

echo "Création new_manager.web-cloud.telecom.fax.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.fax.tar \
    ./src/pages/web-cloud/telecom/fax

echo "Création new_manager.web-cloud.telecom.sms.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.sms.tar \
    ./src/pages/web-cloud/telecom/sms

echo "Création new_manager.web-cloud.telecom.voip.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.voip.tar \
    ./src/pages/web-cloud/telecom/voip

# ============================================================
# RÉSUMÉ
# ============================================================

echo ""
echo "=== Tars new_manager créés ==="
ls -lh /home/ubuntu/new_manager.*.tar | wc -l
ls -lh /home/ubuntu/new_manager.*.tar
