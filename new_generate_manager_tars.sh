#!/bin/bash
set -e

echo "=== Génération des tars new_manager ==="
cd /home/ubuntu/aiapp/frontend

# Suppression des anciens tars (UNIQUEMENT new_manager)
rm -f /home/ubuntu/new_manager.*.tar

# ============================================================
# FONCTION HELPER pour construire les arguments tar
# ============================================================
# Ajoute un chemin seulement s'il existe
add_if_exists() {
    local path="$1"
    if [ -e "$path" ]; then
        echo "$path"
    fi
}

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
    ./public/locales/en/common.json \
    ./public/locales/en/navigation.json \
    ./public/locales/fr/common.json \
    ./public/locales/fr/navigation.json \
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
    ./src/pages/Login.css \
    ./public/locales/en/login.json \
    ./public/locales/fr/login.json

echo "Création new_manager.placeholder.tar..."
tar -cf /home/ubuntu/new_manager.placeholder.tar \
    ./src/pages/_placeholder \
    ./public/locales/en/placeholder.json \
    ./public/locales/fr/placeholder.json

echo "Création new_manager.all.tar..."
tar -cf /home/ubuntu/new_manager.all.tar .

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
    ./public/locales/fr/bare-metal/dedicated \
    $(add_if_exists ./src/services/bare-metal.dedicated.ts)

echo "Création new_manager.bare-metal.housing.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.housing.tar \
    ./src/pages/bare-metal/housing \
    ./public/locales/en/bare-metal/housing \
    ./public/locales/fr/bare-metal/housing \
    $(add_if_exists ./src/services/bare-metal.housing.ts)

echo "Création new_manager.bare-metal.nasha.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.nasha.tar \
    ./src/pages/bare-metal/nasha \
    ./public/locales/en/bare-metal/nasha \
    ./public/locales/fr/bare-metal/nasha \
    $(add_if_exists ./src/services/bare-metal.nasha.ts)

echo "Création new_manager.bare-metal.netapp.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.netapp.tar \
    ./src/pages/bare-metal/netapp \
    ./public/locales/en/bare-metal/netapp \
    ./public/locales/fr/bare-metal/netapp \
    $(add_if_exists ./src/services/bare-metal.netapp.ts)

echo "Création new_manager.bare-metal.vps.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.vps.tar \
    ./src/pages/bare-metal/vps \
    ./public/locales/en/bare-metal/vps \
    ./public/locales/fr/bare-metal/vps \
    $(add_if_exists ./src/services/bare-metal.vps.ts)

# ============================================================
# HOME
# ============================================================

echo "Création new_manager.home.core.tar..."
tar -cf /home/ubuntu/new_manager.home.core.tar \
    ./src/pages/home/index.tsx \
    ./src/pages/home/styles.css \
    ./src/pages/home/useHomeData.ts \
    ./src/pages/home/utils.ts \
    ./src/pages/home/components \
    ./public/locales/en/home/index.json \
    ./public/locales/en/home/dashboard.json \
    ./public/locales/fr/home/index.json \
    ./public/locales/fr/home/dashboard.json \
    $(add_if_exists ./src/services/home.notifications.ts)

echo "Création new_manager.home.account.tar..."
tar -cf /home/ubuntu/new_manager.home.account.tar \
    ./src/pages/home/account \
    ./public/locales/en/home/account \
    ./public/locales/fr/home/account \
    $(add_if_exists ./src/services/home.account.ts) \
    $(add_if_exists ./src/services/home.account.contacts.ts) \
    $(add_if_exists ./src/services/home.account.security.ts) \
    $(add_if_exists ./src/services/home.account.procedures.ts)

echo "Création new_manager.home.api.tar..."
tar -cf /home/ubuntu/new_manager.home.api.tar \
    ./src/pages/home/api \
    ./public/locales/en/home/api \
    ./public/locales/fr/home/api \
    $(add_if_exists ./src/services/home.api.ts)

echo "Création new_manager.home.billing.tar..."
tar -cf /home/ubuntu/new_manager.home.billing.tar \
    ./src/pages/home/billing \
    ./public/locales/en/home/billing \
    ./public/locales/fr/home/billing \
    $(add_if_exists ./src/services/home.billing.ts) \
    $(add_if_exists ./src/services/home.billing.services.ts) \
    $(add_if_exists ./src/services/home.billing.agreements.ts) \
    $(add_if_exists ./src/services/home.billing.orders.ts)

echo "Création new_manager.home.carbon.tar..."
tar -cf /home/ubuntu/new_manager.home.carbon.tar \
    ./src/pages/home/carbon \
    ./public/locales/en/home/carbon \
    ./public/locales/fr/home/carbon \
    $(add_if_exists ./src/services/home.carbon.ts)

echo "Création new_manager.home.support.tar..."
tar -cf /home/ubuntu/new_manager.home.support.tar \
    ./src/pages/home/support \
    ./public/locales/en/home/support \
    ./public/locales/fr/home/support \
    $(add_if_exists ./src/services/home.support.ts) \
    $(add_if_exists ./src/services/home.support.communication.ts)

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
    ./public/locales/fr/iam/logs.json \
    $(add_if_exists ./src/services/iam.ts)

echo "Création new_manager.iam.dbaas-logs.tar..."
tar -cf /home/ubuntu/new_manager.iam.dbaas-logs.tar \
    ./src/pages/iam/dbaas-logs \
    ./public/locales/en/iam/dbaas-logs \
    ./public/locales/fr/iam/dbaas-logs \
    $(add_if_exists ./src/services/iam.dbaas-logs.ts)

echo "Création new_manager.iam.hsm.tar..."
tar -cf /home/ubuntu/new_manager.iam.hsm.tar \
    ./src/pages/iam/hsm \
    ./public/locales/en/iam/hsm \
    ./public/locales/fr/iam/hsm \
    $(add_if_exists ./src/services/iam.hsm.ts)

echo "Création new_manager.iam.logs.tar..."
tar -cf /home/ubuntu/new_manager.iam.logs.tar \
    ./src/pages/iam/logs \
    $(add_if_exists ./src/services/iam.logs.ts)

echo "Création new_manager.iam.metrics.tar..."
tar -cf /home/ubuntu/new_manager.iam.metrics.tar \
    ./src/pages/iam/metrics \
    ./public/locales/en/iam/metrics \
    ./public/locales/fr/iam/metrics \
    $(add_if_exists ./src/services/iam.metrics.ts)

echo "Création new_manager.iam.okms.tar..."
tar -cf /home/ubuntu/new_manager.iam.okms.tar \
    ./src/pages/iam/okms \
    ./public/locales/en/iam/okms \
    ./public/locales/fr/iam/okms \
    $(add_if_exists ./src/services/iam.okms.ts)

echo "Création new_manager.iam.secret.tar..."
tar -cf /home/ubuntu/new_manager.iam.secret.tar \
    ./src/pages/iam/secret \
    ./public/locales/en/iam/secret \
    ./public/locales/fr/iam/secret \
    $(add_if_exists ./src/services/iam.secret.ts)

# ============================================================
# LICENSE
# ============================================================

echo "Création new_manager.license.core.tar..."
tar -cf /home/ubuntu/new_manager.license.core.tar \
    ./src/pages/license/index.tsx \
    ./src/pages/license/styles.css \
    ./public/locales/en/license/index.json \
    ./public/locales/fr/license/index.json \
    $(add_if_exists ./src/services/license.ts)

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
    ./src/pages/network/styles.css \
    ./public/locales/en/network/index.json \
    ./public/locales/fr/network/index.json \
    $(add_if_exists ./src/services/network.ts)

echo "Création new_manager.network.cdn.tar..."
tar -cf /home/ubuntu/new_manager.network.cdn.tar \
    ./src/pages/network/cdn \
    ./public/locales/en/network/cdn \
    ./public/locales/fr/network/cdn \
    $(add_if_exists ./src/services/network.cdn.ts)

echo "Création new_manager.network.cloud-connect.tar..."
tar -cf /home/ubuntu/new_manager.network.cloud-connect.tar \
    ./src/pages/network/cloud-connect \
    ./public/locales/en/network/cloud-connect \
    ./public/locales/fr/network/cloud-connect \
    $(add_if_exists ./src/services/network.cloud-connect.ts)

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
    ./public/locales/fr/network/security \
    $(add_if_exists ./src/services/network.security.ts)

echo "Création new_manager.network.vrack.tar..."
tar -cf /home/ubuntu/new_manager.network.vrack.tar \
    ./src/pages/network/vrack \
    ./public/locales/en/network/vrack \
    ./public/locales/fr/network/vrack

echo "Création new_manager.network.vrack-services.tar..."
tar -cf /home/ubuntu/new_manager.network.vrack-services.tar \
    ./src/pages/network/vrack-services \
    ./public/locales/en/network/vrack-services \
    ./public/locales/fr/network/vrack-services \
    $(add_if_exists ./src/services/network.vrack-services.ts)

# ============================================================
# PRIVATE-CLOUD
# ============================================================

echo "Création new_manager.private-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.core.tar \
    ./src/pages/private-cloud/index.tsx \
    ./src/pages/private-cloud/styles.css \
    ./public/locales/en/private-cloud/index.json \
    ./public/locales/fr/private-cloud/index.json \
    $(add_if_exists ./src/services/private-cloud.ts)

echo "Création new_manager.private-cloud.managed-baremetal.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.managed-baremetal.tar \
    ./src/pages/private-cloud/managed-baremetal

echo "Création new_manager.private-cloud.nutanix.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.nutanix.tar \
    ./src/pages/private-cloud/nutanix \
    ./public/locales/en/private-cloud/nutanix \
    ./public/locales/fr/private-cloud/nutanix \
    $(add_if_exists ./src/services/private-cloud.nutanix.ts)

echo "Création new_manager.private-cloud.sap.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.sap.tar \
    ./src/pages/private-cloud/sap

echo "Création new_manager.private-cloud.veeam.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.veeam.tar \
    ./src/pages/private-cloud/veeam

echo "Création new_manager.private-cloud.vmware.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.vmware.tar \
    ./src/pages/private-cloud/vmware \
    ./public/locales/en/private-cloud/vmware \
    ./public/locales/fr/private-cloud/vmware \
    $(add_if_exists ./src/services/private-cloud.vmware.ts)

# ============================================================
# PUBLIC-CLOUD
# ============================================================

echo "Création new_manager.public-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.core.tar \
    ./src/pages/public-cloud/index.tsx \
    ./src/pages/public-cloud/styles.css \
    $(add_if_exists ./src/pages/public-cloud/shared) \
    ./public/locales/en/public-cloud/index.json \
    ./public/locales/fr/public-cloud/index.json \
    $(add_if_exists ./src/services/public-cloud.ts)

echo "Création new_manager.public-cloud.ai.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.ai.tar \
    ./src/pages/public-cloud/ai \
    ./public/locales/en/public-cloud/ai \
    ./public/locales/fr/public-cloud/ai \
    $(add_if_exists ./src/services/public-cloud.ai.ts)

echo "Création new_manager.public-cloud.block-storage.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.block-storage.tar \
    ./src/pages/public-cloud/block-storage \
    ./public/locales/en/public-cloud/block-storage \
    ./public/locales/fr/public-cloud/block-storage \
    $(add_if_exists ./src/services/public-cloud.block-storage.ts)

echo "Création new_manager.public-cloud.databases.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.databases.tar \
    ./src/pages/public-cloud/databases \
    ./public/locales/en/public-cloud/databases \
    ./public/locales/fr/public-cloud/databases \
    $(add_if_exists ./src/services/public-cloud.databases.ts)

echo "Création new_manager.public-cloud.instances.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.instances.tar \
    ./src/pages/public-cloud/instances \
    ./public/locales/en/public-cloud/instances \
    ./public/locales/fr/public-cloud/instances \
    $(add_if_exists ./src/services/public-cloud.instances.ts)

echo "Création new_manager.public-cloud.kubernetes.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.kubernetes.tar \
    ./src/pages/public-cloud/kubernetes \
    ./public/locales/en/public-cloud/kubernetes \
    ./public/locales/fr/public-cloud/kubernetes \
    $(add_if_exists ./src/services/public-cloud.kubernetes.ts)

echo "Création new_manager.public-cloud.load-balancer.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.load-balancer.tar \
    ./src/pages/public-cloud/load-balancer \
    ./public/locales/en/public-cloud/load-balancer \
    ./public/locales/fr/public-cloud/load-balancer \
    $(add_if_exists ./src/services/public-cloud.load-balancer.ts)

echo "Création new_manager.public-cloud.object-storage.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.object-storage.tar \
    ./src/pages/public-cloud/object-storage \
    ./public/locales/en/public-cloud/object-storage \
    ./public/locales/fr/public-cloud/object-storage \
    $(add_if_exists ./src/services/public-cloud.object-storage.ts)

echo "Création new_manager.public-cloud.project.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.project.tar \
    ./src/pages/public-cloud/project \
    ./public/locales/en/public-cloud/project \
    ./public/locales/fr/public-cloud/project

echo "Création new_manager.public-cloud.registry.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.registry.tar \
    ./src/pages/public-cloud/registry \
    ./public/locales/en/public-cloud/registry \
    ./public/locales/fr/public-cloud/registry \
    $(add_if_exists ./src/services/public-cloud.registry.ts)

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
    ./src/pages/web-cloud/access/index.tsx \
    ./public/locales/en/web-cloud/access/index.json \
    ./public/locales/fr/web-cloud/access/index.json

echo "Création new_manager.web-cloud.access.overthebox.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.access.overthebox.tar \
    ./src/pages/web-cloud/access/overthebox \
    ./public/locales/en/web-cloud/access/overthebox \
    ./public/locales/fr/web-cloud/access/overthebox \
    ./public/locales/en/web-cloud/overthebox \
    ./public/locales/fr/web-cloud/overthebox \
    $(add_if_exists ./src/services/web-cloud.overthebox.ts)

echo "Création new_manager.web-cloud.access.pack-xdsl.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.access.pack-xdsl.tar \
    ./src/pages/web-cloud/access/pack-xdsl \
    ./public/locales/en/web-cloud/access/pack-xdsl \
    ./public/locales/fr/web-cloud/access/pack-xdsl \
    ./public/locales/en/web-cloud/pack-xdsl \
    ./public/locales/fr/web-cloud/pack-xdsl \
    $(add_if_exists ./src/services/web-cloud.pack-xdsl.ts)

echo "Création new_manager.web-cloud.alldom.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.alldom.tar \
    ./src/pages/web-cloud/alldom \
    ./public/locales/en/web-cloud/alldom \
    ./public/locales/fr/web-cloud/alldom \
    $(add_if_exists ./src/services/web-cloud.alldom.ts)

echo "Création new_manager.web-cloud.domains.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.domains.tar \
    ./src/pages/web-cloud/domains \
    ./public/locales/en/web-cloud/domains \
    ./public/locales/fr/web-cloud/domains \
    ./public/locales/en/web-cloud/domains-dns \
    ./public/locales/fr/web-cloud/domains-dns \
    ./public/locales/en/web-cloud/dns-zones \
    ./public/locales/fr/web-cloud/dns-zones \
    $(add_if_exists ./src/services/web-cloud.domains.ts) \
    $(add_if_exists ./src/services/web-cloud.dns-zones.ts)

echo "Création new_manager.web-cloud.emails.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.tar \
    ./src/pages/web-cloud/emails/index.tsx \
    ./public/locales/en/web-cloud/emails/index.json \
    ./public/locales/fr/web-cloud/emails/index.json

echo "Création new_manager.web-cloud.emails.email-domain.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.email-domain.tar \
    ./src/pages/web-cloud/emails/email-domain \
    ./public/locales/en/web-cloud/emails/email-domain \
    ./public/locales/fr/web-cloud/emails/email-domain \
    ./public/locales/en/web-cloud/email-domain \
    ./public/locales/fr/web-cloud/email-domain \
    $(add_if_exists ./src/services/web-cloud.email-domain.ts)

echo "Création new_manager.web-cloud.emails.email-pro.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.email-pro.tar \
    ./src/pages/web-cloud/emails/email-pro \
    ./public/locales/en/web-cloud/emails/email-pro \
    ./public/locales/fr/web-cloud/emails/email-pro \
    ./public/locales/en/web-cloud/email-pro \
    ./public/locales/fr/web-cloud/email-pro \
    $(add_if_exists ./src/services/web-cloud.email-pro.ts)

echo "Création new_manager.web-cloud.emails.exchange.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.exchange.tar \
    ./src/pages/web-cloud/emails/exchange \
    ./public/locales/en/web-cloud/emails/exchange \
    ./public/locales/fr/web-cloud/emails/exchange \
    ./public/locales/en/web-cloud/exchange \
    ./public/locales/fr/web-cloud/exchange \
    $(add_if_exists ./src/services/web-cloud.exchange.ts)

echo "Création new_manager.web-cloud.emails.office.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.office.tar \
    ./src/pages/web-cloud/emails/office \
    ./public/locales/en/web-cloud/emails/office \
    ./public/locales/fr/web-cloud/emails/office \
    ./public/locales/en/web-cloud/office \
    ./public/locales/fr/web-cloud/office \
    $(add_if_exists ./src/services/web-cloud.office.ts)

echo "Création new_manager.web-cloud.emails.zimbra.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.zimbra.tar \
    ./src/pages/web-cloud/emails/zimbra \
    ./public/locales/en/web-cloud/emails/zimbra \
    ./public/locales/fr/web-cloud/emails/zimbra \
    ./public/locales/en/web-cloud/zimbra \
    ./public/locales/fr/web-cloud/zimbra \
    $(add_if_exists ./src/services/web-cloud.zimbra.ts)

echo "Création new_manager.web-cloud.hebergement.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.tar \
    ./src/pages/web-cloud/hebergement/index.tsx \
    ./src/pages/web-cloud/hebergement/styles.css

echo "Création new_manager.web-cloud.hebergement.hosting.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.hosting.tar \
    ./src/pages/web-cloud/hebergement/hosting \
    ./public/locales/en/web-cloud/hosting \
    ./public/locales/fr/web-cloud/hosting \
    ./public/locales/en/web-cloud/hebergement \
    ./public/locales/fr/web-cloud/hebergement \
    $(add_if_exists ./src/services/web-cloud.hosting.ts)

echo "Création new_manager.web-cloud.hebergement.managed-wordpress.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.managed-wordpress.tar \
    ./src/pages/web-cloud/hebergement/managed-wordpress \
    ./public/locales/en/web-cloud/managed-wordpress \
    ./public/locales/fr/web-cloud/managed-wordpress \
    $(add_if_exists ./src/services/web-cloud.managed-wordpress.ts)

echo "Création new_manager.web-cloud.hebergement.private-database.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.private-database.tar \
    ./src/pages/web-cloud/hebergement/private-database \
    ./public/locales/en/web-cloud/private-database \
    ./public/locales/fr/web-cloud/private-database \
    $(add_if_exists ./src/services/web-cloud.private-database.ts)

echo "Création new_manager.web-cloud.telecom.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.tar \
    ./src/pages/web-cloud/telecom/index.tsx \
    ./public/locales/en/web-cloud/telecom/index.json \
    ./public/locales/fr/web-cloud/telecom/index.json

echo "Création new_manager.web-cloud.telecom.carrier-sip.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.carrier-sip.tar \
    ./src/pages/web-cloud/telecom/carrier-sip \
    ./public/locales/en/web-cloud/telecom/carrier-sip \
    ./public/locales/fr/web-cloud/telecom/carrier-sip \
    ./public/locales/en/web-cloud/carrier-sip \
    ./public/locales/fr/web-cloud/carrier-sip \
    $(add_if_exists ./src/services/web-cloud.carrier-sip.ts)

echo "Création new_manager.web-cloud.telecom.fax.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.fax.tar \
    ./src/pages/web-cloud/telecom/fax \
    ./public/locales/en/web-cloud/telecom/fax \
    ./public/locales/fr/web-cloud/telecom/fax \
    ./public/locales/en/web-cloud/fax \
    ./public/locales/fr/web-cloud/fax \
    $(add_if_exists ./src/services/web-cloud.fax.ts)

echo "Création new_manager.web-cloud.telecom.sms.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.sms.tar \
    ./src/pages/web-cloud/telecom/sms \
    ./public/locales/en/web-cloud/telecom/sms \
    ./public/locales/fr/web-cloud/telecom/sms \
    ./public/locales/en/web-cloud/sms \
    ./public/locales/fr/web-cloud/sms \
    $(add_if_exists ./src/services/web-cloud.sms.ts)

echo "Création new_manager.web-cloud.telecom.voip.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.voip.tar \
    ./src/pages/web-cloud/telecom/voip \
    ./public/locales/en/web-cloud/telecom/voip \
    ./public/locales/fr/web-cloud/telecom/voip \
    ./public/locales/en/web-cloud/voip \
    ./public/locales/fr/web-cloud/voip \
    $(add_if_exists ./src/services/web-cloud.voip.ts)

# ============================================================
# RÉSUMÉ
# ============================================================

echo ""
echo "=== Tars new_manager créés ==="
ls -lh /home/ubuntu/new_manager.*.tar | wc -l
ls -lh /home/ubuntu/new_manager.*.tar
