#!/bin/bash
set -e

echo "=== Génération des tars old_manager ==="
cd /home/ubuntu/manager

# Suppression des anciens tars (UNIQUEMENT old_manager)
rm -f /home/ubuntu/old_manager.*.tar

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

# Exclusions communes
EXCLUDES="--exclude=node_modules --exclude=.git --exclude=dist --exclude=coverage --exclude=*.lock --exclude=yarn.lock --exclude=package-lock.json --exclude=*.map --exclude=.cache"

# ============================================================
# TARS GÉNÉRAUX
# ============================================================

echo "Création old_manager.core.tar..."
tar -cf /home/ubuntu/old_manager.core.tar \
    ./packages/manager/core \
    ./packages/components \
    ./packages/manager/modules/advices \
    ./packages/manager/modules/at-internet-configuration \
    ./packages/manager/modules/banner \
    ./packages/manager/modules/beta-preference \
    ./packages/manager/modules/catalog-price \
    ./packages/manager/modules/cloud-styles \
    ./packages/manager/modules/cloud-universe-components \
    ./packages/manager/modules/common-api \
    ./packages/manager/modules/config \
    ./packages/manager/modules/cookie-policy \
    ./packages/manager/modules/core \
    ./packages/manager/modules/error-page \
    ./packages/manager/modules/filters \
    ./packages/manager/modules/gcj \
    ./packages/manager/modules/manager-components \
    ./packages/manager/modules/models \
    ./packages/manager/modules/ng-apiv2-helper \
    ./packages/manager/modules/ng-layout-helpers \
    ./packages/manager/modules/phone-prefix \
    ./packages/manager/modules/product-offers \
    ./packages/manager/modules/request-tagger \
    ./packages/manager/modules/resource-tagging \
    ./lerna.json \
    ./package.json \
    ./turbo.json \
    ./scripts \
    $(add_if_exists ./ng-ovh-api-wrappers) \
    ./ovh-api-services/src/index.js \
    ./ovh-api-services/src/ovh-api-services.module.js \
    ./ovh-api-services/package.json

echo "Création old_manager.locales.tar..."
tar -cf /home/ubuntu/old_manager.locales.tar \
    ./packages/manager/modules/common-translations

echo "Création old_manager.login.tar..."
tar -cf /home/ubuntu/old_manager.login.tar \
    ./packages/manager/apps/sign-up \
    ./packages/manager/modules/sign-up \
    ./packages/manager/apps/account-creation \
    ./packages/manager/modules/mfa-enrollment

echo "Création old_manager.placeholder.tar (vide)..."
tar -cf /home/ubuntu/old_manager.placeholder.tar --files-from /dev/null

echo "Création old_manager.all.tar..."
tar -cf /home/ubuntu/old_manager.all.tar .

# ============================================================
# BARE-METAL
# ============================================================

echo "Création old_manager.bare-metal.core.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.core.tar \
    ./packages/manager/modules/bm-server-components \
    ./ovh-api-services/src/api/dedicated

echo "Création old_manager.bare-metal.dedicated.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.dedicated.tar \
    ./packages/manager/apps/dedicated \
    ./packages/manager/apps/dedicated-servers \
    ./packages/manager/modules/bm-server-components \
    ./ovh-api-services/src/api/dedicated

echo "Création old_manager.bare-metal.housing.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.housing.tar \
    ./packages/manager/apps/dedicated \
    ./packages/manager/modules/bm-server-components \
    ./ovh-api-services/src/api/dedicated

echo "Création old_manager.bare-metal.nasha.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.nasha.tar \
    ./packages/manager/apps/nasha \
    ./packages/manager/modules/nasha \
    ./packages/manager/modules/bm-server-components \
    $(add_if_exists ./ovh-api-services/src/api/vrack/nasha) \
    $(add_if_exists ./ovh-api-services/src/api/order/dedicated/nasha)

echo "Création old_manager.bare-metal.netapp.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.netapp.tar \
    ./packages/manager/apps/netapp \
    ./packages/manager/modules/netapp \
    ./packages/manager/modules/bm-server-components

echo "Création old_manager.bare-metal.vps.tar..."
tar -cf /home/ubuntu/old_manager.bare-metal.vps.tar \
    ./packages/manager/apps/vps \
    ./packages/manager/modules/vps \
    ./packages/manager/modules/bm-server-components \
    ./ovh-api-services/src/api/vps

# ============================================================
# HOME
# ============================================================

echo "Création old_manager.home.core.tar..."
tar -cf /home/ubuntu/old_manager.home.core.tar \
    ./packages/manager/apps/hub \
    ./packages/manager/apps/catalog \
    $(add_if_exists ./packages/manager/apps/cda) \
    $(add_if_exists ./packages/manager/modules/cda) \
    $(add_if_exists ./packages/manager/apps/restricted)

echo "Création old_manager.home.account.tar..."
tar -cf /home/ubuntu/old_manager.home.account.tar \
    ./packages/manager/apps/account \
    ./packages/manager/modules/account \
    ./packages/manager/apps/procedures \
    $(add_if_exists ./packages/manager/modules/trusted-nic) \
    ./ovh-api-services/src/api/me

echo "Création old_manager.home.api.tar..."
tar -cf /home/ubuntu/old_manager.home.api.tar \
    ./packages/manager/apps/hub

echo "Création old_manager.home.billing.tar..."
tar -cf /home/ubuntu/old_manager.home.billing.tar \
    ./packages/manager/apps/billing \
    ./packages/manager/modules/billing \
    ./packages/manager/modules/billing-components \
    $(add_if_exists ./packages/manager/modules/billing-informations) \
    $(add_if_exists ./packages/manager/modules/new-billing) \
    ./packages/manager/apps/order-tracking \
    $(add_if_exists ./packages/manager/modules/ng-ovh-order-tracking) \
    $(add_if_exists ./packages/manager/modules/order) \
    ./ovh-api-services/src/api/billing \
    ./ovh-api-services/src/api/order \
    $(add_if_exists ./ovh-api-services/src/api/me/billing)

echo "Création old_manager.home.carbon.tar..."
tar -cf /home/ubuntu/old_manager.home.carbon.tar \
    ./packages/manager/apps/carbon-calculator \
    $(add_if_exists ./packages/manager/modules/carbon-calculator)

echo "Création old_manager.home.support.tar..."
tar -cf /home/ubuntu/old_manager.home.support.tar \
    ./packages/manager/apps/support \
    $(add_if_exists ./packages/manager/modules/support) \
    $(add_if_exists ./packages/manager/apps/communication) \
    ./ovh-api-services/src/api/support

# ============================================================
# IAM
# ============================================================

echo "Création old_manager.iam.core.tar..."
tar -cf /home/ubuntu/old_manager.iam.core.tar \
    $(add_if_exists ./packages/manager/apps/iam) \
    $(add_if_exists ./packages/manager/apps/identity-access-management) \
    $(add_if_exists ./packages/manager/modules/iam)

echo "Création old_manager.iam.dbaas-logs.tar..."
tar -cf /home/ubuntu/old_manager.iam.dbaas-logs.tar \
    ./packages/manager/apps/dbaas-logs \
    $(add_if_exists ./packages/manager/modules/dbaas-logs) \
    ./ovh-api-services/src/api/dbaas/logs

echo "Création old_manager.iam.hsm.tar (vide - nouveau service)..."
tar -cf /home/ubuntu/old_manager.iam.hsm.tar --files-from /dev/null

echo "Création old_manager.iam.logs.tar..."
tar -cf /home/ubuntu/old_manager.iam.logs.tar \
    $(add_if_exists ./packages/manager/modules/logs-to-customer) \
    $(add_if_exists ./packages/manager/modules/log-to-customer)

echo "Création old_manager.iam.metrics.tar..."
tar -cf /home/ubuntu/old_manager.iam.metrics.tar \
    ./packages/manager/apps/metrics \
    $(add_if_exists ./packages/manager/modules/metrics) \
    ./ovh-api-services/src/api/metrics

echo "Création old_manager.iam.okms.tar..."
tar -cf /home/ubuntu/old_manager.iam.okms.tar \
    ./packages/manager/apps/okms

echo "Création old_manager.iam.secret.tar (vide - nouveau service)..."
tar -cf /home/ubuntu/old_manager.iam.secret.tar --files-from /dev/null

# ============================================================
# LICENSE
# ============================================================

echo "Création old_manager.license.core.tar..."
tar -cf /home/ubuntu/old_manager.license.core.tar \
    ./packages/manager/apps/dedicated/client/app/license \
    ./ovh-api-services/src/api/license

echo "Création old_manager.license.cloudlinux.tar..."
tar -cf /home/ubuntu/old_manager.license.cloudlinux.tar \
    ./packages/manager/apps/dedicated/client/app/license \
    ./ovh-api-services/src/api/license

echo "Création old_manager.license.cpanel.tar..."
tar -cf /home/ubuntu/old_manager.license.cpanel.tar \
    ./packages/manager/apps/dedicated/client/app/license \
    ./ovh-api-services/src/api/license

echo "Création old_manager.license.directadmin.tar..."
tar -cf /home/ubuntu/old_manager.license.directadmin.tar \
    ./packages/manager/apps/dedicated/client/app/license \
    ./ovh-api-services/src/api/license

echo "Création old_manager.license.plesk.tar..."
tar -cf /home/ubuntu/old_manager.license.plesk.tar \
    ./packages/manager/apps/dedicated/client/app/license \
    ./ovh-api-services/src/api/license

echo "Création old_manager.license.sqlserver.tar..."
tar -cf /home/ubuntu/old_manager.license.sqlserver.tar \
    ./packages/manager/apps/dedicated/client/app/license \
    ./ovh-api-services/src/api/license

echo "Création old_manager.license.virtuozzo.tar..."
tar -cf /home/ubuntu/old_manager.license.virtuozzo.tar \
    ./packages/manager/apps/dedicated/client/app/license \
    ./ovh-api-services/src/api/license

echo "Création old_manager.license.windows.tar..."
tar -cf /home/ubuntu/old_manager.license.windows.tar \
    ./packages/manager/apps/dedicated/client/app/license \
    ./ovh-api-services/src/api/license

# ============================================================
# NETWORK
# ============================================================

echo "Création old_manager.network.core.tar..."
tar -cf /home/ubuntu/old_manager.network.core.tar \
    ./packages/manager/apps/vrack \
    ./packages/manager/modules/vrack \
    ./ovh-api-services/src/api/vrack

echo "Création old_manager.network.cdn.tar..."
tar -cf /home/ubuntu/old_manager.network.cdn.tar \
    ./packages/manager/apps/dedicated \
    ./ovh-api-services/src/api/dedicated

echo "Création old_manager.network.cloud-connect.tar..."
tar -cf /home/ubuntu/old_manager.network.cloud-connect.tar \
    ./packages/manager/apps/cloud-connect \
    $(add_if_exists ./packages/manager/modules/cloud-connect)

echo "Création old_manager.network.ip.tar..."
tar -cf /home/ubuntu/old_manager.network.ip.tar \
    ./packages/manager/apps/dedicated/client/app/ip \
    ./ovh-api-services/src/api/ip

echo "Création old_manager.network.load-balancer.tar..."
tar -cf /home/ubuntu/old_manager.network.load-balancer.tar \
    ./packages/manager/apps/iplb \
    $(add_if_exists ./packages/manager/modules/iplb)

echo "Création old_manager.network.security.tar..."
tar -cf /home/ubuntu/old_manager.network.security.tar \
    ./packages/manager/apps/dedicated/client/app/ip \
    ./ovh-api-services/src/api/ip

echo "Création old_manager.network.vrack.tar..."
tar -cf /home/ubuntu/old_manager.network.vrack.tar \
    ./packages/manager/apps/vrack \
    ./packages/manager/modules/vrack \
    ./ovh-api-services/src/api/vrack

echo "Création old_manager.network.vrack-services.tar..."
tar -cf /home/ubuntu/old_manager.network.vrack-services.tar \
    ./packages/manager/apps/vrack-services \
    $(add_if_exists ./packages/manager/modules/network-common)

# ============================================================
# PRIVATE-CLOUD
# ============================================================

echo "Création old_manager.private-cloud.core.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.core.tar \
    ./packages/manager/apps/dedicated/client/app/dedicatedCloud \
    $(add_if_exists ./packages/manager/modules/vcd-api) \
    ./ovh-api-services/src/api/dedicated

echo "Création old_manager.private-cloud.managed-baremetal.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.managed-baremetal.tar \
    ./packages/manager/apps/dedicated/client/app/managedBaremetal \
    $(add_if_exists ./packages/manager/modules/vcd-api) \
    ./ovh-api-services/src/api/dedicated

echo "Création old_manager.private-cloud.nutanix.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.nutanix.tar \
    ./packages/manager/apps/nutanix \
    $(add_if_exists ./packages/manager/modules/nutanix)

echo "Création old_manager.private-cloud.sap.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.sap.tar \
    ./packages/manager/apps/hpc-vmware-vsphere \
    $(add_if_exists ./packages/manager/modules/vcd-api)

echo "Création old_manager.private-cloud.veeam.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.veeam.tar \
    ./packages/manager/apps/veeam-backup \
    ./packages/manager/apps/veeam-enterprise \
    $(add_if_exists ./packages/manager/modules/veeam-enterprise) \
    ./ovh-api-services/src/api/veeam

echo "Création old_manager.private-cloud.vmware.tar..."
tar -cf /home/ubuntu/old_manager.private-cloud.vmware.tar \
    ./packages/manager/apps/dedicated/client/app/dedicatedCloud \
    $(add_if_exists ./packages/manager/modules/vcd-api) \
    ./ovh-api-services/src/api/dedicated

# ============================================================
# PUBLIC-CLOUD
# ============================================================

echo "Création old_manager.public-cloud.core.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.core.tar \
    ./packages/manager/apps/pci \
    ./packages/manager/apps/public-cloud \
    ./packages/manager/modules/pci \
    ./packages/manager/modules/pci-universe-components \
    ./packages/manager/modules/manager-pci-common \
    ./ovh-api-services/src/api/cloud

echo "Création old_manager.public-cloud.ai.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.ai.tar \
    $(add_if_exists ./packages/manager/apps/pci-ai-tools) \
    $(add_if_exists ./packages/manager/apps/pci-ai-endpoints) \
    ./packages/manager/modules/pci-universe-components \
    ./packages/manager/modules/manager-pci-common \
    ./ovh-api-services/src/api/cloud

echo "Création old_manager.public-cloud.block-storage.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.block-storage.tar \
    ./packages/manager/apps/pci-block-storage \
    $(add_if_exists ./packages/manager/apps/pci-volume-backup) \
    $(add_if_exists ./packages/manager/apps/pci-volume-snapshot) \
    ./packages/manager/modules/pci-universe-components \
    ./packages/manager/modules/manager-pci-common \
    ./ovh-api-services/src/api/cloud

echo "Création old_manager.public-cloud.databases.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.databases.tar \
    ./packages/manager/apps/pci-databases-analytics \
    ./packages/manager/modules/pci-universe-components \
    ./packages/manager/modules/manager-pci-common \
    ./ovh-api-services/src/api/cloud

echo "Création old_manager.public-cloud.instances.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.instances.tar \
    ./packages/manager/apps/pci-instances \
    $(add_if_exists ./packages/manager/apps/pci-ssh-keys) \
    ./packages/manager/modules/pci-universe-components \
    ./packages/manager/modules/manager-pci-common \
    ./ovh-api-services/src/api/cloud

echo "Création old_manager.public-cloud.kubernetes.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.kubernetes.tar \
    ./packages/manager/apps/pci-kubernetes \
    ./packages/manager/modules/pci-universe-components \
    ./packages/manager/modules/manager-pci-common \
    ./ovh-api-services/src/api/cloud

echo "Création old_manager.public-cloud.load-balancer.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.load-balancer.tar \
    ./packages/manager/apps/pci-load-balancer \
    ./packages/manager/modules/pci-universe-components \
    ./packages/manager/modules/manager-pci-common \
    ./ovh-api-services/src/api/cloud

echo "Création old_manager.public-cloud.object-storage.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.object-storage.tar \
    ./packages/manager/apps/pci-object-storage \
    $(add_if_exists ./packages/manager/apps/pci-cold-archive) \
    ./packages/manager/modules/pci-universe-components \
    ./packages/manager/modules/manager-pci-common \
    ./ovh-api-services/src/api/cloud

echo "Création old_manager.public-cloud.project.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.project.tar \
    ./packages/manager/apps/pci \
    ./packages/manager/apps/public-cloud \
    $(add_if_exists ./packages/manager/apps/pci-private-network) \
    $(add_if_exists ./packages/manager/apps/pci-public-ip) \
    $(add_if_exists ./packages/manager/apps/pci-gateway) \
    $(add_if_exists ./packages/manager/apps/pci-workflow) \
    $(add_if_exists ./packages/manager/apps/pci-dataplatform) \
    $(add_if_exists ./packages/manager/apps/pci-savings-plan) \
    $(add_if_exists ./packages/manager/apps/pci-billing) \
    $(add_if_exists ./packages/manager/apps/pci-contacts) \
    $(add_if_exists ./packages/manager/apps/pci-quota) \
    $(add_if_exists ./packages/manager/apps/pci-users) \
    $(add_if_exists ./packages/manager/apps/pci-vouchers) \
    $(add_if_exists ./packages/manager/apps/pci-rancher) \
    ./packages/manager/modules/pci-universe-components \
    ./packages/manager/modules/manager-pci-common \
    ./ovh-api-services/src/api/cloud

echo "Création old_manager.public-cloud.registry.tar..."
tar -cf /home/ubuntu/old_manager.public-cloud.registry.tar \
    ./packages/manager/apps/pci-private-registry \
    ./packages/manager/modules/pci-universe-components \
    ./packages/manager/modules/manager-pci-common \
    ./ovh-api-services/src/api/cloud

# ============================================================
# WEB-CLOUD
# ============================================================

echo "Création old_manager.web-cloud.core.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.core.tar \
    ./packages/manager/apps/web \
    ./packages/manager/modules/web-universe-components \
    ./ovh-api-services/src/api/domain \
    ./ovh-api-services/src/api/hosting

echo "Création old_manager.web-cloud.access.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.access.tar \
    ./packages/manager/apps/telecom \
    ./packages/manager/modules/telecom-universe-components \
    ./ovh-api-services/src/api/pack \
    ./ovh-api-services/src/api/xdsl

echo "Création old_manager.web-cloud.access.overthebox.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.access.overthebox.tar \
    ./packages/manager/apps/overthebox \
    $(add_if_exists ./packages/manager/modules/overthebox) \
    ./packages/manager/modules/telecom-universe-components \
    ./ovh-api-services/src/api/overTheBox

echo "Création old_manager.web-cloud.access.pack-xdsl.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.access.pack-xdsl.tar \
    ./packages/manager/apps/telecom \
    ./packages/manager/modules/telecom-universe-components \
    ./ovh-api-services/src/api/pack \
    ./ovh-api-services/src/api/xdsl \
    $(add_if_exists ./ovh-api-services/src/api/connectivity)

echo "Création old_manager.web-cloud.alldom.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.alldom.tar \
    ./packages/manager/apps/web-domains \
    ./packages/manager/apps/web/client/app/components \
    ./packages/manager/modules/web-universe-components \
    ./ovh-api-services/src/api/domain

echo "Création old_manager.web-cloud.domains.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.domains.tar \
    ./packages/manager/apps/web/client/app/domain \
    ./packages/manager/apps/web/client/app/domains \
    $(add_if_exists ./packages/manager/apps/web/client/app/domain-operation) \
    ./packages/manager/apps/web/client/app/dns-zone \
    ./packages/manager/apps/web/client/app/components \
    $(add_if_exists ./packages/manager/apps/web-ongoing-operations) \
    ./packages/manager/modules/web-universe-components \
    ./ovh-api-services/src/api/domain

echo "Création old_manager.web-cloud.emails.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.emails.tar \
    ./packages/manager/apps/web \
    ./packages/manager/modules/web-universe-components \
    ./ovh-api-services/src/api/email

echo "Création old_manager.web-cloud.emails.email-domain.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.emails.email-domain.tar \
    ./packages/manager/apps/email-domain \
    $(add_if_exists ./packages/manager/modules/email-domain) \
    ./packages/manager/modules/web-universe-components \
    $(add_if_exists ./ovh-api-services/src/api/email/domain)

echo "Création old_manager.web-cloud.emails.email-pro.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.emails.email-pro.tar \
    ./packages/manager/apps/email-pro \
    $(add_if_exists ./packages/manager/modules/emailpro) \
    ./packages/manager/modules/web-universe-components \
    ./ovh-api-services/src/api/email

echo "Création old_manager.web-cloud.emails.exchange.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.emails.exchange.tar \
    ./packages/manager/apps/exchange \
    $(add_if_exists ./packages/manager/modules/exchange) \
    ./packages/manager/modules/web-universe-components \
    $(add_if_exists ./ovh-api-services/src/api/email/exchange)

echo "Création old_manager.web-cloud.emails.office.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.emails.office.tar \
    ./packages/manager/apps/web-office \
    ./packages/manager/modules/web-universe-components

echo "Création old_manager.web-cloud.emails.zimbra.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.emails.zimbra.tar \
    ./packages/manager/apps/zimbra \
    ./packages/manager/modules/web-universe-components

echo "Création old_manager.web-cloud.hebergement.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.hebergement.tar \
    ./packages/manager/apps/web-hosting \
    ./packages/manager/modules/web-universe-components \
    ./ovh-api-services/src/api/hosting

echo "Création old_manager.web-cloud.hebergement.hosting.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.hebergement.hosting.tar \
    ./packages/manager/apps/web-hosting \
    ./packages/manager/apps/web/client/app/hosting \
    ./packages/manager/apps/web/client/app/components \
    ./packages/manager/modules/web-universe-components \
    ./ovh-api-services/src/api/hosting/web

echo "Création old_manager.web-cloud.hebergement.managed-wordpress.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.hebergement.managed-wordpress.tar \
    ./packages/manager/apps/web-hosting \
    ./packages/manager/modules/web-universe-components \
    ./ovh-api-services/src/api/hosting

echo "Création old_manager.web-cloud.hebergement.private-database.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.hebergement.private-database.tar \
    ./packages/manager/apps/web/client/app/private-database \
    ./packages/manager/apps/web/client/app/components \
    ./packages/manager/modules/web-universe-components \
    ./ovh-api-services/src/api/hosting/privateDatabase

echo "Création old_manager.web-cloud.telecom.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.telecom.tar \
    ./packages/manager/apps/telecom \
    $(add_if_exists ./packages/manager/apps/telecom-dashboard) \
    $(add_if_exists ./packages/manager/modules/telecom-dashboard) \
    $(add_if_exists ./packages/manager/modules/telecom-styles) \
    ./packages/manager/modules/telecom-universe-components \
    $(add_if_exists ./packages/manager/modules/telecom-task) \
    $(add_if_exists ./packages/manager/apps/telecom-task) \
    ./ovh-api-services/src/api/telephony

echo "Création old_manager.web-cloud.telecom.carrier-sip.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.telecom.carrier-sip.tar \
    ./packages/manager/apps/carrier-sip \
    $(add_if_exists ./packages/manager/modules/carrier-sip) \
    ./packages/manager/modules/telecom-universe-components \
    $(add_if_exists ./ovh-api-services/src/api/telephony/carrierSip)

echo "Création old_manager.web-cloud.telecom.fax.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.telecom.fax.tar \
    ./packages/manager/apps/freefax \
    $(add_if_exists ./packages/manager/modules/freefax) \
    $(add_if_exists ./packages/manager/apps/telecom/src/app/telecom/telephony/fax) \
    $(add_if_exists ./packages/manager/apps/telecom/src/app/telecom/telephony/service/fax) \
    $(add_if_exists ./packages/manager/apps/telecom/src/app/telecom/telephony/line/fax) \
    $(add_if_exists ./packages/manager/apps/telecom/src/components/telecom/telephony/group/fax) \
    $(add_if_exists ./packages/manager/apps/telecom/src/app/telecom/pack/slots/voipEcoFax) \
    $(add_if_exists ./packages/manager/apps/telecom/src/app/telecom/telephony/billingAccount/convertToVoicefax) \
    ./packages/manager/modules/telecom-universe-components \
    $(add_if_exists ./ovh-api-services/src/api/freeFax) \
    $(add_if_exists ./ovh-api-services/src/api/telephony/fax)

echo "Création old_manager.web-cloud.telecom.sms.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.telecom.sms.tar \
    ./packages/manager/apps/sms \
    $(add_if_exists ./packages/manager/modules/sms) \
    ./packages/manager/modules/telecom-universe-components \
    ./ovh-api-services/src/api/sms

echo "Création old_manager.web-cloud.telecom.voip.tar..."
tar -cf /home/ubuntu/old_manager.web-cloud.telecom.voip.tar \
    ./packages/manager/apps/telecom \
    ./packages/manager/modules/telecom-universe-components \
    ./ovh-api-services/src/api/telephony

# ============================================================
# RÉSUMÉ
# ============================================================

echo ""
echo "=== Tars old_manager créés ==="
ls -lh /home/ubuntu/old_manager.*.tar | wc -l
ls -lh /home/ubuntu/old_manager.*.tar
