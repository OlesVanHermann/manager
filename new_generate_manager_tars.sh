#!/bin/bash
set -e

echo "=== Génération des tars new_manager ==="
cd /home/ubuntu/aiapp/frontend

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
tar -cf /home/ubuntu/new_manager.all.tar \
    --exclude='./backup*' \
    --exclude='./.backup*' \
    --exclude='./backups*' \
    .

# ============================================================
# BARE-METAL
# Fichiers core: index.tsx, index.css, index.service.ts
# ============================================================

echo "Création new_manager.bare-metal.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.tar \
    ./src/pages/bare-metal

echo "Création new_manager.bare-metal.core.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.core.tar \
    ./src/pages/bare-metal/index.tsx \
    ./src/pages/bare-metal/index.css \
    ./src/pages/bare-metal/index.service.ts

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
# GENERAL
# Fichiers core: index.tsx
# ============================================================

echo "Création new_manager.general.tar..."
tar -cf /home/ubuntu/new_manager.general.tar \
    ./src/pages/general

echo "Création new_manager.general.core.tar..."
tar -cf /home/ubuntu/new_manager.general.core.tar \
    ./src/pages/general/index.tsx

echo "Création new_manager.general.general.tar..."
tar -cf /home/ubuntu/new_manager.general.general.tar \
    ./src/pages/general/general

echo "Création new_manager.general.account.tar..."
tar -cf /home/ubuntu/new_manager.general.account.tar \
    ./src/pages/general/account

echo "Création new_manager.general.api.tar..."
tar -cf /home/ubuntu/new_manager.general.api.tar \
    ./src/pages/general/api

echo "Création new_manager.general.billing.tar..."
tar -cf /home/ubuntu/new_manager.general.billing.tar \
    ./src/pages/general/billing

echo "Création new_manager.general.carbon.tar..."
tar -cf /home/ubuntu/new_manager.general.carbon.tar \
    ./src/pages/general/carbon

echo "Création new_manager.general.support.tar..."
tar -cf /home/ubuntu/new_manager.general.support.tar \
    ./src/pages/general/support

# ============================================================
# IAM
# Fichiers core: index.tsx, iam.types.ts
# ============================================================

echo "Création new_manager.iam.tar..."
tar -cf /home/ubuntu/new_manager.iam.tar \
    ./src/pages/iam

echo "Création new_manager.iam.core.tar..."
tar -cf /home/ubuntu/new_manager.iam.core.tar \
    ./src/pages/iam/index.tsx \
    ./src/pages/iam/iam.types.ts

echo "Création new_manager.iam.general.tar..."
tar -cf /home/ubuntu/new_manager.iam.general.tar \
    ./src/pages/iam/general

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
# Fichiers core: index.tsx, license.types.ts
# ============================================================

echo "Création new_manager.license.tar..."
tar -cf /home/ubuntu/new_manager.license.tar \
    ./src/pages/license

echo "Création new_manager.license.core.tar..."
tar -cf /home/ubuntu/new_manager.license.core.tar \
    ./src/pages/license/index.tsx \
    ./src/pages/license/license.types.ts

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
# Fichiers core: index.tsx, NetworkDashboard.css, NetworkDashboard.ts
# ============================================================

echo "Création new_manager.network.tar..."
tar -cf /home/ubuntu/new_manager.network.tar \
    ./src/pages/network

echo "Création new_manager.network.core.tar..."
tar -cf /home/ubuntu/new_manager.network.core.tar \
    ./src/pages/network/index.tsx \
    ./src/pages/network/NetworkDashboard.css \
    ./src/pages/network/NetworkDashboard.ts

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
# Fichiers core: index.tsx
# ============================================================

echo "Création new_manager.private-cloud.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.tar \
    ./src/pages/private-cloud

echo "Création new_manager.private-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.core.tar \
    ./src/pages/private-cloud/index.tsx

echo "Création new_manager.private-cloud.general.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.general.tar \
    ./src/pages/private-cloud/general

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
# Fichiers core: index.tsx, PublicCloudDashboard.service.ts, styles.css
# ============================================================

echo "Création new_manager.public-cloud.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.tar \
    ./src/pages/public-cloud

echo "Création new_manager.public-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.core.tar \
    ./src/pages/public-cloud/index.tsx \
    ./src/pages/public-cloud/PublicCloudDashboard.service.ts \
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
# Fichiers core: index.tsx, index.css
# ============================================================

echo "Création new_manager.web-cloud.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.tar \
    ./src/pages/web-cloud

echo "Création new_manager.web-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.core.tar \
    ./src/pages/web-cloud/index.tsx \
    ./src/pages/web-cloud/index.css

# --- ACCESS (core: index.tsx, index.css, access.service.ts) ---

echo "Création new_manager.web-cloud.access.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.access.tar \
    ./src/pages/web-cloud/access

echo "Création new_manager.web-cloud.access.overthebox.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.access.overthebox.tar \
    ./src/pages/web-cloud/access/overthebox

echo "Création new_manager.web-cloud.access.pack-xdsl.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.access.pack-xdsl.tar \
    ./src/pages/web-cloud/access/pack-xdsl

# --- DOMAINS (core: index.tsx, domains.service.ts, domains.types.ts) ---

echo "Création new_manager.web-cloud.domains.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.domains.tar \
    ./src/pages/web-cloud/domains

echo "Création new_manager.web-cloud.domains.alldom.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.domains.alldom.tar \
    ./src/pages/web-cloud/domains/tabs/alldom

# --- EMAILS (core: index.tsx, emailsPage.service.ts) ---

echo "Création new_manager.web-cloud.emails.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.tar \
    ./src/pages/web-cloud/emails

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

# --- HEBERGEMENT (core: index.tsx, styles.css) ---

echo "Création new_manager.web-cloud.hebergement.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.tar \
    ./src/pages/web-cloud/hebergement

echo "Création new_manager.web-cloud.hebergement.hosting.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.hosting.tar \
    ./src/pages/web-cloud/hebergement/hosting

echo "Création new_manager.web-cloud.hebergement.managed-wordpress.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.managed-wordpress.tar \
    ./src/pages/web-cloud/hebergement/managed-wordpress

echo "Création new_manager.web-cloud.hebergement.private-database.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.private-database.tar \
    ./src/pages/web-cloud/hebergement/private-database

# --- TELECOM (core: index.tsx, index.css) ---

echo "Création new_manager.web-cloud.telecom.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.tar \
    ./src/pages/web-cloud/telecom

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
ls -1 /home/ubuntu/new_manager.*.tar | wc -l
ls -lh /home/ubuntu/new_manager.*.tar
