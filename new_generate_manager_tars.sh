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
    $(add_if_exists ./src/pages/bare-metal/styles.css) \
    $(add_if_exists ./public/locales/en/bare-metal/index.json) \
    $(add_if_exists ./public/locales/fr/bare-metal/index.json)

echo "Création new_manager.bare-metal.general.tar..."
if [ -e ./src/pages/bare-metal/general ] || [ -e ./public/locales/en/bare-metal/general ]; then
    tar -cf /home/ubuntu/new_manager.bare-metal.general.tar \
        $(add_if_exists ./src/pages/bare-metal/general) \
        $(add_if_exists ./public/locales/en/bare-metal/general) \
        $(add_if_exists ./public/locales/fr/bare-metal/general) \
        $(add_if_exists ./src/services/bare-metal.general.ts)
else
    echo "Skip new_manager.bare-metal.general.tar (dossier inexistant)"
fi

echo "Création new_manager.bare-metal.dedicated.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.dedicated.tar \
    $(add_if_exists ./src/pages/bare-metal/dedicated) \
    $(add_if_exists ./public/locales/en/bare-metal/dedicated) \
    $(add_if_exists ./public/locales/fr/bare-metal/dedicated) \
    $(add_if_exists ./src/services/bare-metal.dedicated.ts)

echo "Création new_manager.bare-metal.housing.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.housing.tar \
    $(add_if_exists ./src/pages/bare-metal/housing) \
    $(add_if_exists ./public/locales/en/bare-metal/housing) \
    $(add_if_exists ./public/locales/fr/bare-metal/housing) \
    $(add_if_exists ./src/services/bare-metal.housing.ts)

echo "Création new_manager.bare-metal.nasha.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.nasha.tar \
    $(add_if_exists ./src/pages/bare-metal/nasha) \
    $(add_if_exists ./public/locales/en/bare-metal/nasha) \
    $(add_if_exists ./public/locales/fr/bare-metal/nasha) \
    $(add_if_exists ./src/services/bare-metal.nasha.ts)

echo "Création new_manager.bare-metal.netapp.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.netapp.tar \
    $(add_if_exists ./src/pages/bare-metal/netapp) \
    $(add_if_exists ./public/locales/en/bare-metal/netapp) \
    $(add_if_exists ./public/locales/fr/bare-metal/netapp) \
    $(add_if_exists ./src/services/bare-metal.netapp.ts)

echo "Création new_manager.bare-metal.vps.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.vps.tar \
    $(add_if_exists ./src/pages/bare-metal/vps) \
    $(add_if_exists ./public/locales/en/bare-metal/vps) \
    $(add_if_exists ./public/locales/fr/bare-metal/vps) \
    $(add_if_exists ./src/services/bare-metal.vps.ts)

# ============================================================
# GENERAL (NAV1 - anciennement HOME)
# ============================================================

echo "Création new_manager.general.core.tar..."
tar -cf /home/ubuntu/new_manager.general.core.tar \
    ./src/pages/general/index.tsx \
    $(add_if_exists ./src/pages/general/styles.css) \
    $(add_if_exists ./src/pages/general/useHomeData.ts) \
    $(add_if_exists ./src/pages/general/useGeneralData.ts) \
    $(add_if_exists ./src/pages/general/utils.ts) \
    $(add_if_exists ./src/pages/general/components) \
    $(add_if_exists ./public/locales/en/general/index.json) \
    $(add_if_exists ./public/locales/en/general/dashboard.json) \
    $(add_if_exists ./public/locales/fr/general/index.json) \
    $(add_if_exists ./public/locales/fr/general/dashboard.json) \
    $(add_if_exists ./src/services/general.notifications.ts)

echo "Création new_manager.general.general.tar..."
if [ -e ./src/pages/general/general ] || [ -e ./public/locales/en/general/general ]; then
    tar -cf /home/ubuntu/new_manager.general.general.tar \
        $(add_if_exists ./src/pages/general/general) \
        $(add_if_exists ./public/locales/en/general/general) \
        $(add_if_exists ./public/locales/fr/general/general) \
        $(add_if_exists ./src/services/general.general.ts)
else
    echo "Skip new_manager.general.general.tar (dossier inexistant)"
fi

echo "Création new_manager.general.account.tar..."
tar -cf /home/ubuntu/new_manager.general.account.tar \
    $(add_if_exists ./src/pages/general/account) \
    $(add_if_exists ./public/locales/en/general/account) \
    $(add_if_exists ./public/locales/fr/general/account) \
    $(add_if_exists ./src/services/general.account.ts)

echo "Création new_manager.general.api.tar..."
tar -cf /home/ubuntu/new_manager.general.api.tar \
    $(add_if_exists ./src/pages/general/api) \
    $(add_if_exists ./public/locales/en/general/api) \
    $(add_if_exists ./public/locales/fr/general/api) \
    $(add_if_exists ./src/services/general.api.ts)

echo "Création new_manager.general.billing.tar..."
tar -cf /home/ubuntu/new_manager.general.billing.tar \
    $(add_if_exists ./src/pages/general/billing) \
    $(add_if_exists ./public/locales/en/general/billing) \
    $(add_if_exists ./public/locales/fr/general/billing) \
    $(add_if_exists ./src/services/general.billing.ts)

echo "Création new_manager.general.carbon.tar..."
tar -cf /home/ubuntu/new_manager.general.carbon.tar \
    $(add_if_exists ./src/pages/general/carbon) \
    $(add_if_exists ./public/locales/en/general/carbon) \
    $(add_if_exists ./public/locales/fr/general/carbon) \
    $(add_if_exists ./src/services/general.carbon.ts)

echo "Création new_manager.general.support.tar..."
tar -cf /home/ubuntu/new_manager.general.support.tar \
    $(add_if_exists ./src/pages/general/support) \
    $(add_if_exists ./public/locales/en/general/support) \
    $(add_if_exists ./public/locales/fr/general/support) \
    $(add_if_exists ./src/services/general.support.ts)

# ============================================================
# IAM
# ============================================================

echo "Création new_manager.iam.core.tar..."
tar -cf /home/ubuntu/new_manager.iam.core.tar \
    ./src/pages/iam/index.tsx \
    $(add_if_exists ./src/pages/iam/IamPage.css) \
    $(add_if_exists ./src/pages/iam/iam.types.ts) \
    $(add_if_exists ./src/pages/iam/tabs) \
    $(add_if_exists ./public/locales/en/iam/index.json) \
    $(add_if_exists ./public/locales/en/iam/identities.json) \
    $(add_if_exists ./public/locales/fr/iam/index.json) \
    $(add_if_exists ./public/locales/fr/iam/identities.json) \
    $(add_if_exists ./src/services/iam.ts)

echo "Création new_manager.iam.general.tar..."
if [ -e ./src/pages/iam/general ] || [ -e ./public/locales/en/iam/general ]; then
    tar -cf /home/ubuntu/new_manager.iam.general.tar \
        $(add_if_exists ./src/pages/iam/general) \
        $(add_if_exists ./public/locales/en/iam/general) \
        $(add_if_exists ./public/locales/fr/iam/general) \
        $(add_if_exists ./src/services/iam.general.ts)
else
    echo "Skip new_manager.iam.general.tar (dossier inexistant)"
fi

echo "Création new_manager.iam.dbaas-logs.tar..."
tar -cf /home/ubuntu/new_manager.iam.dbaas-logs.tar \
    $(add_if_exists ./src/pages/iam/dbaas-logs) \
    $(add_if_exists ./public/locales/en/iam/dbaas-logs) \
    $(add_if_exists ./public/locales/en/iam/dbaas-logs.json) \
    $(add_if_exists ./public/locales/fr/iam/dbaas-logs) \
    $(add_if_exists ./public/locales/fr/iam/dbaas-logs.json) \
    $(add_if_exists ./src/services/iam.dbaas-logs.ts)

echo "Création new_manager.iam.hsm.tar..."
tar -cf /home/ubuntu/new_manager.iam.hsm.tar \
    $(add_if_exists ./src/pages/iam/hsm) \
    $(add_if_exists ./public/locales/en/iam/hsm) \
    $(add_if_exists ./public/locales/fr/iam/hsm) \
    $(add_if_exists ./src/services/iam.hsm.ts)

echo "Création new_manager.iam.logs.tar..."
tar -cf /home/ubuntu/new_manager.iam.logs.tar \
    $(add_if_exists ./src/pages/iam/logs) \
    $(add_if_exists ./public/locales/en/iam/logs) \
    $(add_if_exists ./public/locales/fr/iam/logs) \
    $(add_if_exists ./src/services/iam.logs.ts)

echo "Création new_manager.iam.metrics.tar..."
tar -cf /home/ubuntu/new_manager.iam.metrics.tar \
    $(add_if_exists ./src/pages/iam/metrics) \
    $(add_if_exists ./public/locales/en/iam/metrics) \
    $(add_if_exists ./public/locales/fr/iam/metrics) \
    $(add_if_exists ./src/services/iam.metrics.ts)

echo "Création new_manager.iam.okms.tar..."
tar -cf /home/ubuntu/new_manager.iam.okms.tar \
    $(add_if_exists ./src/pages/iam/okms) \
    $(add_if_exists ./public/locales/en/iam/okms) \
    $(add_if_exists ./public/locales/fr/iam/okms) \
    $(add_if_exists ./src/services/iam.okms.ts)

echo "Création new_manager.iam.secret.tar..."
tar -cf /home/ubuntu/new_manager.iam.secret.tar \
    $(add_if_exists ./src/pages/iam/secret) \
    $(add_if_exists ./public/locales/en/iam/secret) \
    $(add_if_exists ./public/locales/fr/iam/secret) \
    $(add_if_exists ./src/services/iam.secret.ts)

# ============================================================
# LICENSE
# ============================================================

echo "Création new_manager.license.core.tar..."
tar -cf /home/ubuntu/new_manager.license.core.tar \
    ./src/pages/license/index.tsx \
    $(add_if_exists ./public/locales/en/license/index.json) \
    $(add_if_exists ./public/locales/fr/license/index.json) \
    $(add_if_exists ./src/services/license.ts)

echo "Création new_manager.license.cloudlinux.tar..."
if [ -e ./src/pages/license/cloudlinux ]; then
    tar -cf /home/ubuntu/new_manager.license.cloudlinux.tar \
        ./src/pages/license/cloudlinux
else
    echo "Skip new_manager.license.cloudlinux.tar (dossier inexistant)"
fi

echo "Création new_manager.license.cpanel.tar..."
if [ -e ./src/pages/license/cpanel ]; then
    tar -cf /home/ubuntu/new_manager.license.cpanel.tar \
        ./src/pages/license/cpanel
else
    echo "Skip new_manager.license.cpanel.tar (dossier inexistant)"
fi

echo "Création new_manager.license.directadmin.tar..."
if [ -e ./src/pages/license/directadmin ]; then
    tar -cf /home/ubuntu/new_manager.license.directadmin.tar \
        ./src/pages/license/directadmin
else
    echo "Skip new_manager.license.directadmin.tar (dossier inexistant)"
fi

echo "Création new_manager.license.plesk.tar..."
if [ -e ./src/pages/license/plesk ]; then
    tar -cf /home/ubuntu/new_manager.license.plesk.tar \
        ./src/pages/license/plesk
else
    echo "Skip new_manager.license.plesk.tar (dossier inexistant)"
fi

echo "Création new_manager.license.sqlserver.tar..."
if [ -e ./src/pages/license/sqlserver ]; then
    tar -cf /home/ubuntu/new_manager.license.sqlserver.tar \
        ./src/pages/license/sqlserver
else
    echo "Skip new_manager.license.sqlserver.tar (dossier inexistant)"
fi

echo "Création new_manager.license.virtuozzo.tar..."
if [ -e ./src/pages/license/virtuozzo ]; then
    tar -cf /home/ubuntu/new_manager.license.virtuozzo.tar \
        ./src/pages/license/virtuozzo
else
    echo "Skip new_manager.license.virtuozzo.tar (dossier inexistant)"
fi

echo "Création new_manager.license.windows.tar..."
if [ -e ./src/pages/license/windows ]; then
    tar -cf /home/ubuntu/new_manager.license.windows.tar \
        ./src/pages/license/windows
else
    echo "Skip new_manager.license.windows.tar (dossier inexistant)"
fi

# ============================================================
# NETWORK
# ============================================================

echo "Création new_manager.network.core.tar..."
tar -cf /home/ubuntu/new_manager.network.core.tar \
    ./src/pages/network/index.tsx \
    $(add_if_exists ./src/pages/network/styles.css) \
    $(add_if_exists ./public/locales/en/network/index.json) \
    $(add_if_exists ./public/locales/fr/network/index.json) \
    $(add_if_exists ./src/services/network.ts)

echo "Création new_manager.network.general.tar..."
if [ -e ./src/pages/network/general ] || [ -e ./public/locales/en/network/general ]; then
    tar -cf /home/ubuntu/new_manager.network.general.tar \
        $(add_if_exists ./src/pages/network/general) \
        $(add_if_exists ./public/locales/en/network/general) \
        $(add_if_exists ./public/locales/fr/network/general) \
        $(add_if_exists ./src/services/network.general.ts)
else
    echo "Skip new_manager.network.general.tar (dossier inexistant)"
fi

echo "Création new_manager.network.cdn.tar..."
tar -cf /home/ubuntu/new_manager.network.cdn.tar \
    $(add_if_exists ./src/pages/network/cdn) \
    $(add_if_exists ./public/locales/en/network/cdn) \
    $(add_if_exists ./public/locales/fr/network/cdn) \
    $(add_if_exists ./src/services/network.cdn.ts)

echo "Création new_manager.network.cloud-connect.tar..."
tar -cf /home/ubuntu/new_manager.network.cloud-connect.tar \
    $(add_if_exists ./src/pages/network/cloud-connect) \
    $(add_if_exists ./public/locales/en/network/cloud-connect) \
    $(add_if_exists ./public/locales/fr/network/cloud-connect) \
    $(add_if_exists ./src/services/network.cloud-connect.ts)

echo "Création new_manager.network.ip.tar..."
tar -cf /home/ubuntu/new_manager.network.ip.tar \
    $(add_if_exists ./src/pages/network/ip) \
    $(add_if_exists ./public/locales/en/network/ip) \
    $(add_if_exists ./public/locales/fr/network/ip)

echo "Création new_manager.network.load-balancer.tar..."
tar -cf /home/ubuntu/new_manager.network.load-balancer.tar \
    $(add_if_exists ./src/pages/network/load-balancer) \
    $(add_if_exists ./public/locales/en/network/load-balancer) \
    $(add_if_exists ./public/locales/fr/network/load-balancer)

echo "Création new_manager.network.security.tar..."
tar -cf /home/ubuntu/new_manager.network.security.tar \
    $(add_if_exists ./src/pages/network/security) \
    $(add_if_exists ./public/locales/en/network/security) \
    $(add_if_exists ./public/locales/fr/network/security) \
    $(add_if_exists ./src/services/network.security.ts)

echo "Création new_manager.network.vrack.tar..."
tar -cf /home/ubuntu/new_manager.network.vrack.tar \
    $(add_if_exists ./src/pages/network/vrack) \
    $(add_if_exists ./public/locales/en/network/vrack) \
    $(add_if_exists ./public/locales/fr/network/vrack)

echo "Création new_manager.network.vrack-services.tar..."
tar -cf /home/ubuntu/new_manager.network.vrack-services.tar \
    $(add_if_exists ./src/pages/network/vrack-services) \
    $(add_if_exists ./public/locales/en/network/vrack-services) \
    $(add_if_exists ./public/locales/fr/network/vrack-services) \
    $(add_if_exists ./src/services/network.vrack-services.ts)

# ============================================================
# PRIVATE-CLOUD
# ============================================================

echo "Création new_manager.private-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.core.tar \
    ./src/pages/private-cloud/index.tsx \
    $(add_if_exists ./src/pages/private-cloud/styles.css) \
    $(add_if_exists ./public/locales/en/private-cloud/index.json) \
    $(add_if_exists ./public/locales/fr/private-cloud/index.json) \
    $(add_if_exists ./src/services/private-cloud.ts)

echo "Création new_manager.private-cloud.general.tar..."
if [ -e ./src/pages/private-cloud/general ] || [ -e ./public/locales/en/private-cloud/general ]; then
    tar -cf /home/ubuntu/new_manager.private-cloud.general.tar \
        $(add_if_exists ./src/pages/private-cloud/general) \
        $(add_if_exists ./public/locales/en/private-cloud/general) \
        $(add_if_exists ./public/locales/fr/private-cloud/general) \
        $(add_if_exists ./src/services/private-cloud.general.ts)
else
    echo "Skip new_manager.private-cloud.general.tar (dossier inexistant)"
fi

echo "Création new_manager.private-cloud.managed-baremetal.tar..."
if [ -e ./src/pages/private-cloud/managed-baremetal ]; then
    tar -cf /home/ubuntu/new_manager.private-cloud.managed-baremetal.tar \
        ./src/pages/private-cloud/managed-baremetal
else
    echo "Skip new_manager.private-cloud.managed-baremetal.tar (dossier inexistant)"
fi

echo "Création new_manager.private-cloud.nutanix.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.nutanix.tar \
    $(add_if_exists ./src/pages/private-cloud/nutanix) \
    $(add_if_exists ./public/locales/en/private-cloud/nutanix) \
    $(add_if_exists ./public/locales/fr/private-cloud/nutanix) \
    $(add_if_exists ./src/services/private-cloud.nutanix.ts)

echo "Création new_manager.private-cloud.sap.tar..."
if [ -e ./src/pages/private-cloud/sap ]; then
    tar -cf /home/ubuntu/new_manager.private-cloud.sap.tar \
        ./src/pages/private-cloud/sap
else
    echo "Skip new_manager.private-cloud.sap.tar (dossier inexistant)"
fi

echo "Création new_manager.private-cloud.veeam.tar..."
if [ -e ./src/pages/private-cloud/veeam ]; then
    tar -cf /home/ubuntu/new_manager.private-cloud.veeam.tar \
        ./src/pages/private-cloud/veeam
else
    echo "Skip new_manager.private-cloud.veeam.tar (dossier inexistant)"
fi

echo "Création new_manager.private-cloud.vmware.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.vmware.tar \
    $(add_if_exists ./src/pages/private-cloud/vmware) \
    $(add_if_exists ./public/locales/en/private-cloud/vmware) \
    $(add_if_exists ./public/locales/fr/private-cloud/vmware) \
    $(add_if_exists ./src/services/private-cloud.vmware.ts)

# ============================================================
# PUBLIC-CLOUD
# ============================================================

echo "Création new_manager.public-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.core.tar \
    ./src/pages/public-cloud/index.tsx \
    $(add_if_exists ./src/pages/public-cloud/styles.css) \
    $(add_if_exists ./src/pages/public-cloud/shared) \
    $(add_if_exists ./public/locales/en/public-cloud/index.json) \
    $(add_if_exists ./public/locales/fr/public-cloud/index.json) \
    $(add_if_exists ./src/services/public-cloud.ts)

echo "Création new_manager.public-cloud.general.tar..."
if [ -e ./src/pages/public-cloud/general ] || [ -e ./public/locales/en/public-cloud/general ]; then
    tar -cf /home/ubuntu/new_manager.public-cloud.general.tar \
        $(add_if_exists ./src/pages/public-cloud/general) \
        $(add_if_exists ./public/locales/en/public-cloud/general) \
        $(add_if_exists ./public/locales/fr/public-cloud/general) \
        $(add_if_exists ./src/services/public-cloud.general.ts)
else
    echo "Skip new_manager.public-cloud.general.tar (dossier inexistant)"
fi

echo "Création new_manager.public-cloud.ai.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.ai.tar \
    $(add_if_exists ./src/pages/public-cloud/ai) \
    $(add_if_exists ./public/locales/en/public-cloud/ai) \
    $(add_if_exists ./public/locales/fr/public-cloud/ai) \
    $(add_if_exists ./src/services/public-cloud.ai.ts)

echo "Création new_manager.public-cloud.block-storage.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.block-storage.tar \
    $(add_if_exists ./src/pages/public-cloud/block-storage) \
    $(add_if_exists ./public/locales/en/public-cloud/block-storage) \
    $(add_if_exists ./public/locales/fr/public-cloud/block-storage) \
    $(add_if_exists ./src/services/public-cloud.block-storage.ts)

echo "Création new_manager.public-cloud.databases.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.databases.tar \
    $(add_if_exists ./src/pages/public-cloud/databases) \
    $(add_if_exists ./public/locales/en/public-cloud/databases) \
    $(add_if_exists ./public/locales/fr/public-cloud/databases) \
    $(add_if_exists ./src/services/public-cloud.databases.ts)

echo "Création new_manager.public-cloud.instances.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.instances.tar \
    $(add_if_exists ./src/pages/public-cloud/instances) \
    $(add_if_exists ./public/locales/en/public-cloud/instances) \
    $(add_if_exists ./public/locales/fr/public-cloud/instances) \
    $(add_if_exists ./src/services/public-cloud.instances.ts)

echo "Création new_manager.public-cloud.kubernetes.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.kubernetes.tar \
    $(add_if_exists ./src/pages/public-cloud/kubernetes) \
    $(add_if_exists ./public/locales/en/public-cloud/kubernetes) \
    $(add_if_exists ./public/locales/fr/public-cloud/kubernetes) \
    $(add_if_exists ./src/services/public-cloud.kubernetes.ts)

echo "Création new_manager.public-cloud.load-balancer.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.load-balancer.tar \
    $(add_if_exists ./src/pages/public-cloud/load-balancer) \
    $(add_if_exists ./public/locales/en/public-cloud/load-balancer) \
    $(add_if_exists ./public/locales/fr/public-cloud/load-balancer) \
    $(add_if_exists ./src/services/public-cloud.load-balancer.ts)

echo "Création new_manager.public-cloud.object-storage.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.object-storage.tar \
    $(add_if_exists ./src/pages/public-cloud/object-storage) \
    $(add_if_exists ./public/locales/en/public-cloud/object-storage) \
    $(add_if_exists ./public/locales/fr/public-cloud/object-storage) \
    $(add_if_exists ./src/services/public-cloud.object-storage.ts)

echo "Création new_manager.public-cloud.project.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.project.tar \
    $(add_if_exists ./src/pages/public-cloud/project) \
    $(add_if_exists ./public/locales/en/public-cloud/project) \
    $(add_if_exists ./public/locales/fr/public-cloud/project)

echo "Création new_manager.public-cloud.registry.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.registry.tar \
    $(add_if_exists ./src/pages/public-cloud/registry) \
    $(add_if_exists ./public/locales/en/public-cloud/registry) \
    $(add_if_exists ./public/locales/fr/public-cloud/registry) \
    $(add_if_exists ./src/services/public-cloud.registry.ts)

# ============================================================
# WEB-CLOUD
# ============================================================

echo "Création new_manager.web-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.core.tar \
    ./src/pages/web-cloud/index.tsx \
    $(add_if_exists ./src/pages/web-cloud/styles.css) \
    $(add_if_exists ./public/locales/en/web-cloud/index.json) \
    $(add_if_exists ./public/locales/fr/web-cloud/index.json)

echo "Création new_manager.web-cloud.general.tar..."
if [ -e ./src/pages/web-cloud/general ] || [ -e ./public/locales/en/web-cloud/general ]; then
    tar -cf /home/ubuntu/new_manager.web-cloud.general.tar \
        $(add_if_exists ./src/pages/web-cloud/general) \
        $(add_if_exists ./public/locales/en/web-cloud/general) \
        $(add_if_exists ./public/locales/fr/web-cloud/general) \
        $(add_if_exists ./src/services/web-cloud.general.ts)
else
    echo "Skip new_manager.web-cloud.general.tar (dossier inexistant)"
fi

echo "Création new_manager.web-cloud.access.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.access.tar \
    $(add_if_exists ./src/pages/web-cloud/access/index.tsx) \
    $(add_if_exists ./public/locales/en/web-cloud/access/index.json) \
    $(add_if_exists ./public/locales/fr/web-cloud/access/index.json)

echo "Création new_manager.web-cloud.access.overthebox.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.access.overthebox.tar \
    $(add_if_exists ./src/pages/web-cloud/access/overthebox) \
    $(add_if_exists ./public/locales/en/web-cloud/overthebox) \
    $(add_if_exists ./public/locales/fr/web-cloud/overthebox) \
    $(add_if_exists ./src/services/web-cloud.overthebox.ts)

echo "Création new_manager.web-cloud.access.pack-xdsl.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.access.pack-xdsl.tar \
    $(add_if_exists ./src/pages/web-cloud/access/pack-xdsl) \
    $(add_if_exists ./public/locales/en/web-cloud/pack-xdsl) \
    $(add_if_exists ./public/locales/fr/web-cloud/pack-xdsl) \
    $(add_if_exists ./src/services/web-cloud.pack-xdsl.ts)

echo "Création new_manager.web-cloud.domains.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.domains.tar \
    $(add_if_exists ./src/pages/web-cloud/domains) \
    $(add_if_exists ./public/locales/en/web-cloud/domains) \
    $(add_if_exists ./public/locales/fr/web-cloud/domains) \
    $(add_if_exists ./src/services/web-cloud.domains.ts) \
    $(add_if_exists ./src/services/web-cloud.dns-zones.ts)

echo "Création new_manager.web-cloud.emails.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.tar \
    $(add_if_exists ./src/pages/web-cloud/emails/index.tsx) \
    $(add_if_exists ./public/locales/en/web-cloud/emails/index.json) \
    $(add_if_exists ./public/locales/fr/web-cloud/emails/index.json)

echo "Création new_manager.web-cloud.emails.email-domain.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.email-domain.tar \
    $(add_if_exists ./src/pages/web-cloud/emails/email-domain) \
    $(add_if_exists ./public/locales/en/web-cloud/email-domain) \
    $(add_if_exists ./public/locales/fr/web-cloud/email-domain) \
    $(add_if_exists ./src/services/web-cloud.email-domain.ts)

echo "Création new_manager.web-cloud.emails.email-pro.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.email-pro.tar \
    $(add_if_exists ./src/pages/web-cloud/emails/email-pro) \
    $(add_if_exists ./public/locales/en/web-cloud/email-pro) \
    $(add_if_exists ./public/locales/fr/web-cloud/email-pro) \
    $(add_if_exists ./src/services/web-cloud.email-pro.ts)

echo "Création new_manager.web-cloud.emails.exchange.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.exchange.tar \
    $(add_if_exists ./src/pages/web-cloud/emails/exchange) \
    $(add_if_exists ./public/locales/en/web-cloud/exchange) \
    $(add_if_exists ./public/locales/fr/web-cloud/exchange) \
    $(add_if_exists ./src/services/web-cloud.exchange.ts)

echo "Création new_manager.web-cloud.emails.office.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.office.tar \
    $(add_if_exists ./src/pages/web-cloud/emails/office) \
    $(add_if_exists ./public/locales/en/web-cloud/office) \
    $(add_if_exists ./public/locales/fr/web-cloud/office) \
    $(add_if_exists ./src/services/web-cloud.office.ts)

echo "Création new_manager.web-cloud.emails.zimbra.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.emails.zimbra.tar \
    $(add_if_exists ./src/pages/web-cloud/emails/zimbra) \
    $(add_if_exists ./public/locales/en/web-cloud/zimbra) \
    $(add_if_exists ./public/locales/fr/web-cloud/zimbra) \
    $(add_if_exists ./src/services/web-cloud.zimbra.ts)

echo "Création new_manager.web-cloud.hebergement.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.tar \
    $(add_if_exists ./src/pages/web-cloud/hebergement/index.tsx) \
    $(add_if_exists ./src/pages/web-cloud/hebergement/styles.css)

echo "Création new_manager.web-cloud.hebergement.hosting.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.hosting.tar \
    $(add_if_exists ./src/pages/web-cloud/hebergement/hosting) \
    $(add_if_exists ./public/locales/en/web-cloud/hosting) \
    $(add_if_exists ./public/locales/fr/web-cloud/hosting) \
    $(add_if_exists ./src/services/web-cloud.hosting.ts)

echo "Création new_manager.web-cloud.hebergement.managed-wordpress.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.managed-wordpress.tar \
    $(add_if_exists ./src/pages/web-cloud/hebergement/managed-wordpress) \
    $(add_if_exists ./public/locales/en/web-cloud/managed-wordpress) \
    $(add_if_exists ./public/locales/fr/web-cloud/managed-wordpress) \
    $(add_if_exists ./src/services/web-cloud.managed-wordpress.ts)

echo "Création new_manager.web-cloud.hebergement.private-database.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.hebergement.private-database.tar \
    $(add_if_exists ./src/pages/web-cloud/hebergement/private-database) \
    $(add_if_exists ./public/locales/en/web-cloud/private-database) \
    $(add_if_exists ./public/locales/fr/web-cloud/private-database) \
    $(add_if_exists ./src/services/web-cloud.private-database.ts)

echo "Création new_manager.web-cloud.telecom.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.tar \
    $(add_if_exists ./src/pages/web-cloud/telecom/index.tsx) \
    $(add_if_exists ./public/locales/en/web-cloud/telecom/index.json) \
    $(add_if_exists ./public/locales/fr/web-cloud/telecom/index.json)

echo "Création new_manager.web-cloud.telecom.carrier-sip.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.carrier-sip.tar \
    $(add_if_exists ./src/pages/web-cloud/telecom/carrier-sip) \
    $(add_if_exists ./src/services/web-cloud.carrier-sip.ts)

echo "Création new_manager.web-cloud.telecom.fax.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.fax.tar \
    $(add_if_exists ./src/pages/web-cloud/telecom/fax) \
    $(add_if_exists ./public/locales/en/web-cloud/fax) \
    $(add_if_exists ./public/locales/fr/web-cloud/fax) \
    $(add_if_exists ./src/services/web-cloud.fax.ts)

echo "Création new_manager.web-cloud.telecom.sms.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.sms.tar \
    $(add_if_exists ./src/pages/web-cloud/telecom/sms) \
    $(add_if_exists ./public/locales/en/web-cloud/sms) \
    $(add_if_exists ./public/locales/fr/web-cloud/sms) \
    $(add_if_exists ./src/services/web-cloud.sms.ts)

echo "Création new_manager.web-cloud.telecom.voip.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.voip.tar \
    $(add_if_exists ./src/pages/web-cloud/telecom/voip) \
    $(add_if_exists ./public/locales/en/web-cloud/voip) \
    $(add_if_exists ./public/locales/fr/web-cloud/voip) \
    $(add_if_exists ./src/services/web-cloud.voip.ts)

# ============================================================
# RÉSUMÉ
# ============================================================

echo ""
echo "=== Tars new_manager créés ==="
ls -lh /home/ubuntu/new_manager.*.tar | wc -l
ls -lh /home/ubuntu/new_manager.*.tar
