#!/bin/bash
set -e

echo "=== Génération des tars new_manager ==="
cd /home/ubuntu/aiapp/frontend

# Suppression des anciens tars (UNIQUEMENT new_manager)
rm -f /home/ubuntu/new_manager.*.tar

# ============================================================
# FONCTIONS HELPER pour construire les arguments tar
# ============================================================

# Ajoute un chemin seulement s'il existe
add_if_exists() {
    local path="$1"
    if [ -e "$path" ]; then
        echo "$path"
    fi
}

# Récupérer tous les fichiers DIRECTS d'un NAV1 (pas les sous-dossiers)
get_direct_files() {
    local nav1="$1"
    find "./src/pages/${nav1}" -maxdepth 1 -type f 2>/dev/null | tr '\n' ' '
}

# Récupérer les dossiers UTILITAIRES d'un NAV1 (pas les NAV2)
# Un dossier utilitaire = components, shared, hooks, utils, tabs à la racine
# Un NAV2 = dossier avec index.tsx dedans
get_utility_dirs() {
    local nav1="$1"
    for dir in "./src/pages/${nav1}/"*/; do
        if [ -d "$dir" ]; then
            local dirname=$(basename "$dir")
            # Exclure les NAV2 (dossiers avec index.tsx)
            if [ ! -f "${dir}index.tsx" ]; then
                echo "$dir"
            fi
        fi
    done | tr '\n' ' '
}

# Récupérer les locales directes d'un NAV1 (fichiers .json à la racine, pas les sous-dossiers)
get_core_locales() {
    local nav1="$1"
    find "./public/locales/en/${nav1}" -maxdepth 1 -type f -name "*.json" 2>/dev/null | tr '\n' ' '
    find "./public/locales/fr/${nav1}" -maxdepth 1 -type f -name "*.json" 2>/dev/null | tr '\n' ' '
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
    $(get_direct_files bare-metal) \
    $(get_utility_dirs bare-metal) \
    $(get_core_locales bare-metal) \
    $(add_if_exists ./src/services/bare-metal.ts)

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

echo "Création new_manager.bare-metal.tar..."
tar -cf /home/ubuntu/new_manager.bare-metal.tar \
    ./src/pages/bare-metal \
    $(add_if_exists ./public/locales/en/bare-metal) \
    $(add_if_exists ./public/locales/fr/bare-metal) \
    $(find ./src/services -maxdepth 1 -name "bare-metal*.ts" 2>/dev/null)

# ============================================================
# GENERAL (NAV1 - anciennement HOME)
# ============================================================

echo "Création new_manager.general.core.tar..."
tar -cf /home/ubuntu/new_manager.general.core.tar \
    $(get_direct_files general) \
    $(get_utility_dirs general) \
    $(get_core_locales general) \
    $(add_if_exists ./src/services/general.ts) \
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

echo "Création new_manager.general.tar..."
tar -cf /home/ubuntu/new_manager.general.tar \
    ./src/pages/general \
    $(add_if_exists ./public/locales/en/general) \
    $(add_if_exists ./public/locales/fr/general) \
    $(find ./src/services -maxdepth 1 -name "general*.ts" 2>/dev/null)

# ============================================================
# IAM
# ============================================================

echo "Création new_manager.iam.core.tar..."
tar -cf /home/ubuntu/new_manager.iam.core.tar \
    $(get_direct_files iam) \
    $(get_utility_dirs iam) \
    $(get_core_locales iam) \
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

echo "Création new_manager.iam.tar..."
tar -cf /home/ubuntu/new_manager.iam.tar \
    ./src/pages/iam \
    $(add_if_exists ./public/locales/en/iam) \
    $(add_if_exists ./public/locales/fr/iam) \
    $(find ./src/services -maxdepth 1 -name "iam*.ts" 2>/dev/null)

# ============================================================
# LICENSE
# ============================================================

echo "Création new_manager.license.core.tar..."
tar -cf /home/ubuntu/new_manager.license.core.tar \
    $(get_direct_files license) \
    $(get_utility_dirs license) \
    $(get_core_locales license) \
    $(add_if_exists ./src/services/license.ts)

echo "Création new_manager.license.cloudlinux.tar..."
tar -cf /home/ubuntu/new_manager.license.cloudlinux.tar \
    $(add_if_exists ./src/pages/license/cloudlinux) \
    $(add_if_exists ./public/locales/en/license/cloudlinux) \
    $(add_if_exists ./public/locales/fr/license/cloudlinux)

echo "Création new_manager.license.cpanel.tar..."
tar -cf /home/ubuntu/new_manager.license.cpanel.tar \
    $(add_if_exists ./src/pages/license/cpanel) \
    $(add_if_exists ./public/locales/en/license/cpanel) \
    $(add_if_exists ./public/locales/fr/license/cpanel)

echo "Création new_manager.license.directadmin.tar..."
tar -cf /home/ubuntu/new_manager.license.directadmin.tar \
    $(add_if_exists ./src/pages/license/directadmin) \
    $(add_if_exists ./public/locales/en/license/directadmin) \
    $(add_if_exists ./public/locales/fr/license/directadmin)

echo "Création new_manager.license.plesk.tar..."
tar -cf /home/ubuntu/new_manager.license.plesk.tar \
    $(add_if_exists ./src/pages/license/plesk) \
    $(add_if_exists ./public/locales/en/license/plesk) \
    $(add_if_exists ./public/locales/fr/license/plesk)

echo "Création new_manager.license.sqlserver.tar..."
tar -cf /home/ubuntu/new_manager.license.sqlserver.tar \
    $(add_if_exists ./src/pages/license/sqlserver) \
    $(add_if_exists ./public/locales/en/license/sqlserver) \
    $(add_if_exists ./public/locales/fr/license/sqlserver)

echo "Création new_manager.license.virtuozzo.tar..."
tar -cf /home/ubuntu/new_manager.license.virtuozzo.tar \
    $(add_if_exists ./src/pages/license/virtuozzo) \
    $(add_if_exists ./public/locales/en/license/virtuozzo) \
    $(add_if_exists ./public/locales/fr/license/virtuozzo)

echo "Création new_manager.license.windows.tar..."
tar -cf /home/ubuntu/new_manager.license.windows.tar \
    $(add_if_exists ./src/pages/license/windows) \
    $(add_if_exists ./public/locales/en/license/windows) \
    $(add_if_exists ./public/locales/fr/license/windows)

echo "Création new_manager.license.tar..."
tar -cf /home/ubuntu/new_manager.license.tar \
    ./src/pages/license \
    $(add_if_exists ./public/locales/en/license) \
    $(add_if_exists ./public/locales/fr/license) \
    $(find ./src/services -maxdepth 1 -name "license*.ts" 2>/dev/null)

# ============================================================
# NETWORK
# ============================================================

echo "Création new_manager.network.core.tar..."
tar -cf /home/ubuntu/new_manager.network.core.tar \
    $(get_direct_files network) \
    $(get_utility_dirs network) \
    $(get_core_locales network) \
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

echo "Création new_manager.network.tar..."
tar -cf /home/ubuntu/new_manager.network.tar \
    ./src/pages/network \
    $(add_if_exists ./public/locales/en/network) \
    $(add_if_exists ./public/locales/fr/network) \
    $(find ./src/services -maxdepth 1 -name "network*.ts" 2>/dev/null)

# ============================================================
# PRIVATE-CLOUD
# ============================================================

echo "Création new_manager.private-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.core.tar \
    $(get_direct_files private-cloud) \
    $(get_utility_dirs private-cloud) \
    $(get_core_locales private-cloud) \
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
tar -cf /home/ubuntu/new_manager.private-cloud.managed-baremetal.tar \
    $(add_if_exists ./src/pages/private-cloud/managed-baremetal) \
    $(add_if_exists ./public/locales/en/private-cloud/managed-baremetal) \
    $(add_if_exists ./public/locales/fr/private-cloud/managed-baremetal) \
    $(add_if_exists ./src/services/private-cloud.managed-baremetal.ts)

echo "Création new_manager.private-cloud.nutanix.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.nutanix.tar \
    $(add_if_exists ./src/pages/private-cloud/nutanix) \
    $(add_if_exists ./public/locales/en/private-cloud/nutanix) \
    $(add_if_exists ./public/locales/fr/private-cloud/nutanix) \
    $(add_if_exists ./src/services/private-cloud.nutanix.ts)

echo "Création new_manager.private-cloud.sap.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.sap.tar \
    $(add_if_exists ./src/pages/private-cloud/sap) \
    $(add_if_exists ./public/locales/en/private-cloud/sap) \
    $(add_if_exists ./public/locales/fr/private-cloud/sap) \
    $(add_if_exists ./src/services/private-cloud.sap.ts)

echo "Création new_manager.private-cloud.veeam.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.veeam.tar \
    $(add_if_exists ./src/pages/private-cloud/veeam) \
    $(add_if_exists ./public/locales/en/private-cloud/veeam) \
    $(add_if_exists ./public/locales/fr/private-cloud/veeam) \
    $(add_if_exists ./src/services/private-cloud.veeam.ts)

echo "Création new_manager.private-cloud.vmware.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.vmware.tar \
    $(add_if_exists ./src/pages/private-cloud/vmware) \
    $(add_if_exists ./public/locales/en/private-cloud/vmware) \
    $(add_if_exists ./public/locales/fr/private-cloud/vmware) \
    $(add_if_exists ./src/services/private-cloud.vmware.ts)

echo "Création new_manager.private-cloud.tar..."
tar -cf /home/ubuntu/new_manager.private-cloud.tar \
    ./src/pages/private-cloud \
    $(add_if_exists ./public/locales/en/private-cloud) \
    $(add_if_exists ./public/locales/fr/private-cloud) \
    $(find ./src/services -maxdepth 1 -name "private-cloud*.ts" 2>/dev/null)

# ============================================================
# PUBLIC-CLOUD
# ============================================================

echo "Création new_manager.public-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.core.tar \
    $(get_direct_files public-cloud) \
    $(get_utility_dirs public-cloud) \
    $(get_core_locales public-cloud) \
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

echo "Création new_manager.public-cloud.tar..."
tar -cf /home/ubuntu/new_manager.public-cloud.tar \
    ./src/pages/public-cloud \
    $(add_if_exists ./public/locales/en/public-cloud) \
    $(add_if_exists ./public/locales/fr/public-cloud) \
    $(find ./src/services -maxdepth 1 -name "public-cloud*.ts" 2>/dev/null)

# ============================================================
# WEB-CLOUD
# ============================================================

echo "Création new_manager.web-cloud.core.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.core.tar \
    $(get_direct_files web-cloud) \
    $(get_utility_dirs web-cloud) \
    $(get_core_locales web-cloud) \
    $(add_if_exists ./src/services/web-cloud.ts)

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
    $(find ./src/pages/web-cloud/access -maxdepth 1 -type f 2>/dev/null) \
    $(add_if_exists ./public/locales/en/web-cloud/access) \
    $(add_if_exists ./public/locales/fr/web-cloud/access)

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
    $(find ./src/pages/web-cloud/emails -maxdepth 1 -type f 2>/dev/null) \
    $(add_if_exists ./public/locales/en/web-cloud/emails) \
    $(add_if_exists ./public/locales/fr/web-cloud/emails)

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
    $(find ./src/pages/web-cloud/hebergement -maxdepth 1 -type f 2>/dev/null) \
    $(add_if_exists ./public/locales/en/web-cloud/hebergement) \
    $(add_if_exists ./public/locales/fr/web-cloud/hebergement)

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
    $(find ./src/pages/web-cloud/telecom -maxdepth 1 -type f 2>/dev/null) \
    $(add_if_exists ./public/locales/en/web-cloud/telecom) \
    $(add_if_exists ./public/locales/fr/web-cloud/telecom)

echo "Création new_manager.web-cloud.telecom.carrier-sip.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.telecom.carrier-sip.tar \
    $(add_if_exists ./src/pages/web-cloud/telecom/carrier-sip) \
    $(add_if_exists ./public/locales/en/web-cloud/telecom/carrier-sip) \
    $(add_if_exists ./public/locales/fr/web-cloud/telecom/carrier-sip) \
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

echo "Création new_manager.web-cloud.tar..."
tar -cf /home/ubuntu/new_manager.web-cloud.tar \
    ./src/pages/web-cloud \
    $(add_if_exists ./public/locales/en/web-cloud) \
    $(add_if_exists ./public/locales/fr/web-cloud) \
    $(find ./src/services -maxdepth 1 -name "web-cloud*.ts" 2>/dev/null)

# ============================================================
# RÉSUMÉ
# ============================================================

echo ""
echo "=== Tars new_manager créés ==="
ls -lh /home/ubuntu/new_manager.*.tar | wc -l
ls -lh /home/ubuntu/new_manager.*.tar
