#!/bin/bash
set -e

echo "=== Génération des tars new_manager ==="
echo ""

# Suppression des anciens tars
echo "[CLEAN] Suppression des anciens tars..."
rm -f /home/ubuntu/new_manager_*.tar
rm -f /home/ubuntu/old_manager_*.tar
echo "[CLEAN] OK"
echo ""

# Fonction de vérification
check_tar() {
    local tarfile="$1"
    local count=$(tar -tf "$tarfile" 2>/dev/null | head -1 | wc -l)
    if [ "$count" -eq 0 ]; then
        echo "[ERREUR] $tarfile est vide!"
        exit 1
    fi
    local size=$(du -h "$tarfile" | cut -f1)
    local files=$(tar -tf "$tarfile" | wc -l)
    echo "[OK] $tarfile ($files fichiers, $size)"
}

#############################################
# new_manager_core.tar
#############################################
echo "[1/12] Création de new_manager_core.tar..."
cd /home/ubuntu/aiapp/frontend
tar -cf /home/ubuntu/new_manager_core.tar \
    vite.config.ts \
    package.json \
    tsconfig.json \
    postcss.config.js \
    src/App.tsx \
    src/main.tsx \
    src/index.css \
    src/components/ServiceIcons.tsx \
    src/components/LoadingSpinner/index.tsx \
    src/components/LoadingSpinner/styles.css \
    src/components/Sidebar/Sidebar.tsx \
    src/components/Sidebar/navigationTree.ts \
    src/components/Sidebar/styles.css \
    src/components/Sidebar/index.ts \
    src/components/Skeleton.css \
    src/components/Header/index.tsx \
    src/components/Header/styles.css \
    src/components/AccountSidebar/UserInfos.tsx \
    src/components/AccountSidebar/AccountSidebar.tsx \
    src/components/AccountSidebar/styles.css \
    src/components/AccountSidebar/UsefulLinks.tsx \
    src/components/AccountSidebar/Shortcuts.tsx \
    src/components/AccountSidebar/index.ts \
    src/components/HeaderNav.tsx \
    src/components/index.ts \
    src/components/Layout/index.tsx \
    src/components/Layout/styles.css \
    src/components/Skeleton.tsx \
    src/design-system/globals.css \
    src/design-system/PATTERNS.md \
    src/design-system/COMPONENTS.md \
    src/design-system/DESIGN_TOKENS.md \
    src/design-system/tokens/index.ts \
    src/design-system/ICONS.md \
    src/design-system/index.ts \
    src/design-system/tokens.css \
    src/lib/useTabs.ts \
    src/lib/constants.ts \
    src/lib/types.ts \
    src/lib/ResetSlot.tsx \
    src/types/services.types.ts \
    src/types/auth.types.ts \
    src/contexts/AuthContext.tsx \
    src/i18n/LanguageSelector.tsx \
    src/i18n/index.ts \
    src/hooks/useAppNavigation.ts \
    src/styles/globals.css \
    src/styles/pages-common.css \
    public/locales/en/common.json \
    public/locales/en/navigation.json \
    public/locales/fr/common.json \
    public/locales/fr/navigation.json
check_tar /home/ubuntu/new_manager_core.tar

#############################################
# new_manager_home.tar
#############################################
echo "[2/12] Création de new_manager_home.tar..."
cd /home/ubuntu/aiapp/frontend
tar -cf /home/ubuntu/new_manager_home.tar \
    src/pages/home/components/DashboardAlerts.tsx \
    src/pages/home/components/index.ts \
    src/pages/home/account/components/LastBillTile.tsx \
    src/pages/home/account/components/ProfileTile.tsx \
    src/pages/home/account/components/ShortcutsTile.tsx \
    src/pages/home/account/SecurityTab.tsx \
    src/pages/home/account/EditTab.tsx \
    src/pages/home/account/ContactsRequestsTab.tsx \
    src/pages/home/account/index.tsx \
    src/pages/home/account/ContactsServicesTab.tsx \
    src/pages/home/account/AdvancedTab.tsx \
    src/pages/home/account/styles.css \
    src/pages/home/account/security/TwoFactorSection.tsx \
    src/pages/home/account/security/useSecurityData.ts \
    src/pages/home/account/security/PasswordSection.tsx \
    src/pages/home/account/security/modals/SecurityModals.tsx \
    src/pages/home/account/security/IpRestrictionsSection.tsx \
    src/pages/home/account/security/SecurityIcons.tsx \
    src/pages/home/account/security/index.ts \
    src/pages/home/account/KycTab.tsx \
    src/pages/home/account/PrivacyTab.tsx \
    src/pages/home/useHomeData.ts \
    src/pages/home/api/index.tsx \
    src/pages/home/api/utils.ts \
    src/pages/home/api/tabs/ApiTab.tsx \
    src/pages/home/api/tabs/AdvancedTab.tsx \
    src/pages/home/api/tabs/index.ts \
    src/pages/home/api/styles.css \
    src/pages/home/support/index.tsx \
    src/pages/home/support/utils.tsx \
    src/pages/home/support/tabs/BroadcastTab.tsx \
    src/pages/home/support/tabs/TicketsTab.tsx \
    src/pages/home/support/tabs/CreateTab.tsx \
    src/pages/home/support/tabs/LevelTab.tsx \
    src/pages/home/support/tabs/CommunicationsTab.tsx \
    src/pages/home/support/tabs/index.ts \
    src/pages/home/support/styles.css \
    src/pages/home/billing/shared/constants.ts \
    src/pages/home/billing/shared/periodHelpers.ts \
    src/pages/home/billing/shared/PeriodToolbar.tsx \
    src/pages/home/billing/shared/index.ts \
    src/pages/home/billing/shared/usePeriodNavigation.ts \
    src/pages/home/billing/index.tsx \
    src/pages/home/billing/utils.tsx \
    src/pages/home/billing/tabs/PaymentsTab.tsx \
    src/pages/home/billing/tabs/OrdersTab.tsx \
    src/pages/home/billing/tabs/ServicesTab.tsx \
    src/pages/home/billing/tabs/VouchersTab.tsx \
    src/pages/home/billing/tabs/MethodsTab.tsx \
    src/pages/home/billing/tabs/PrepaidTab.tsx \
    src/pages/home/billing/tabs/RefundsTab.tsx \
    src/pages/home/billing/tabs/FidelityTab.tsx \
    src/pages/home/billing/tabs/index.ts \
    src/pages/home/billing/tabs/ReferencesTab.tsx \
    src/pages/home/billing/tabs/InvoicesTab.tsx \
    src/pages/home/billing/tabs/ContractsTab.tsx \
    src/pages/home/billing/styles.css \
    src/pages/home/billing/icons.tsx \
    src/pages/home/index.tsx \
    src/pages/home/utils.ts \
    src/pages/home/carbon/index.tsx \
    src/pages/home/carbon/styles.css \
    src/pages/home/styles.css \
    src/services/home.account.contacts.ts \
    src/services/home.support.ts \
    src/services/home.account.security.ts \
    src/services/home.billing.services.ts \
    src/services/home.carbon.ts \
    src/services/home.billing.ts \
    src/services/home.account.ts \
    src/services/home.api.ts \
    src/services/home.notifications.ts \
    src/services/home.billing.agreements.ts \
    src/services/home.billing.orders.ts \
    src/services/home.support.communication.ts \
    src/services/home.account.procedures.ts \
    public/locales/en/home/account/edit.json \
    public/locales/en/home/account/contacts-requests.json \
    public/locales/en/home/account/privacy.json \
    public/locales/en/home/account/kyc.json \
    public/locales/en/home/account/index.json \
    public/locales/en/home/account/security.json \
    public/locales/en/home/account/contacts-services.json \
    public/locales/en/home/account/advanced.json \
    public/locales/en/home/api/index.json \
    public/locales/en/home/support/index.json \
    public/locales/en/home/billing/tabs.json \
    public/locales/en/home/billing/index.json \
    public/locales/en/home/carbon/index.json \
    public/locales/en/home/index.json \
    public/locales/en/home/dashboard.json \
    public/locales/fr/home/account/edit.json \
    public/locales/fr/home/account/contacts-requests.json \
    public/locales/fr/home/account/privacy.json \
    public/locales/fr/home/account/kyc.json \
    public/locales/fr/home/account/index.json \
    public/locales/fr/home/account/security.json \
    public/locales/fr/home/account/contacts-services.json \
    public/locales/fr/home/account/advanced.json \
    public/locales/fr/home/api/index.json \
    public/locales/fr/home/support/index.json \
    public/locales/fr/home/billing/tabs.json \
    public/locales/fr/home/billing/index.json \
    public/locales/fr/home/carbon/index.json \
    public/locales/fr/home/index.json \
    public/locales/fr/home/dashboard.json
check_tar /home/ubuntu/new_manager_home.tar

#############################################
# new_manager_public-cloud.tar
#############################################
echo "[3/12] Création de new_manager_public-cloud.tar..."
cd /home/ubuntu/aiapp/frontend
tar -cf /home/ubuntu/new_manager_public-cloud.tar \
    src/pages/public-cloud/block-storage/index.tsx \
    src/pages/public-cloud/block-storage/tabs/GeneralTab.tsx \
    src/pages/public-cloud/block-storage/tabs/index.ts \
    src/pages/public-cloud/block-storage/tabs/SnapshotsTab.tsx \
    src/pages/public-cloud/databases/index.tsx \
    src/pages/public-cloud/databases/tabs/UsersTab.tsx \
    src/pages/public-cloud/databases/tabs/GeneralTab.tsx \
    src/pages/public-cloud/databases/tabs/MetricsTab.tsx \
    src/pages/public-cloud/databases/tabs/index.ts \
    src/pages/public-cloud/databases/tabs/BackupsTab.tsx \
    src/pages/public-cloud/index.tsx \
    src/pages/public-cloud/project/index.tsx \
    src/pages/public-cloud/project/tabs/NetworksTab.tsx \
    src/pages/public-cloud/project/tabs/SshKeysTab.tsx \
    src/pages/public-cloud/project/tabs/QuotaTab.tsx \
    src/pages/public-cloud/project/tabs/StorageTab.tsx \
    src/pages/public-cloud/project/tabs/InstancesTab.tsx \
    src/pages/public-cloud/project/tabs/VolumesTab.tsx \
    src/pages/public-cloud/project/tabs/index.ts \
    src/pages/public-cloud/project/tabs/SnapshotsTab.tsx \
    src/pages/public-cloud/project/styles.css \
    src/pages/public-cloud/ai/index.tsx \
    src/pages/public-cloud/ai/tabs/AppsTab.tsx \
    src/pages/public-cloud/ai/tabs/JobsTab.tsx \
    src/pages/public-cloud/ai/tabs/index.ts \
    src/pages/public-cloud/ai/tabs/NotebooksTab.tsx \
    src/pages/public-cloud/instances/index.tsx \
    src/pages/public-cloud/instances/tabs/ConsoleTab.tsx \
    src/pages/public-cloud/instances/tabs/GeneralTab.tsx \
    src/pages/public-cloud/instances/tabs/NetworkTab.tsx \
    src/pages/public-cloud/instances/tabs/index.ts \
    src/pages/public-cloud/instances/tabs/SnapshotsTab.tsx \
    src/pages/public-cloud/object-storage/index.tsx \
    src/pages/public-cloud/object-storage/tabs/ObjectsTab.tsx \
    src/pages/public-cloud/object-storage/tabs/UsersTab.tsx \
    src/pages/public-cloud/object-storage/tabs/GeneralTab.tsx \
    src/pages/public-cloud/object-storage/tabs/index.ts \
    src/pages/public-cloud/styles.css \
    src/pages/public-cloud/kubernetes/index.tsx \
    src/pages/public-cloud/kubernetes/tabs/GeneralTab.tsx \
    src/pages/public-cloud/kubernetes/tabs/NodePoolsTab.tsx \
    src/pages/public-cloud/kubernetes/tabs/KubeconfigTab.tsx \
    src/pages/public-cloud/kubernetes/tabs/index.ts \
    src/pages/public-cloud/registry/index.tsx \
    src/pages/public-cloud/registry/tabs/ImagesTab.tsx \
    src/pages/public-cloud/registry/tabs/UsersTab.tsx \
    src/pages/public-cloud/registry/tabs/GeneralTab.tsx \
    src/pages/public-cloud/registry/tabs/index.ts \
    src/pages/public-cloud/load-balancer/index.tsx \
    src/pages/public-cloud/load-balancer/tabs/PoolsTab.tsx \
    src/pages/public-cloud/load-balancer/tabs/ListenersTab.tsx \
    src/pages/public-cloud/load-balancer/tabs/GeneralTab.tsx \
    src/pages/public-cloud/load-balancer/tabs/index.ts \
    src/services/public-cloud.load-balancer.ts \
    src/services/public-cloud.databases.ts \
    src/services/public-cloud.instances.ts \
    src/services/public-cloud.registry.ts \
    src/services/public-cloud.kubernetes.ts \
    src/services/public-cloud.ai.ts \
    src/services/public-cloud.block-storage.ts \
    src/services/public-cloud.object-storage.ts \
    src/services/public-cloud.ts \
    public/locales/en/public-cloud/block-storage/index.json \
    public/locales/en/public-cloud/databases/index.json \
    public/locales/en/public-cloud/project/index.json \
    public/locales/en/public-cloud/ai/index.json \
    public/locales/en/public-cloud/index.json \
    public/locales/en/public-cloud/instances/index.json \
    public/locales/en/public-cloud/object-storage/index.json \
    public/locales/en/public-cloud/kubernetes/index.json \
    public/locales/en/public-cloud/registry/index.json \
    public/locales/en/public-cloud/load-balancer/index.json \
    public/locales/fr/public-cloud/block-storage/index.json \
    public/locales/fr/public-cloud/databases/index.json \
    public/locales/fr/public-cloud/project/index.json \
    public/locales/fr/public-cloud/ai/index.json \
    public/locales/fr/public-cloud/index.json \
    public/locales/fr/public-cloud/instances/index.json \
    public/locales/fr/public-cloud/object-storage/index.json \
    public/locales/fr/public-cloud/kubernetes/index.json \
    public/locales/fr/public-cloud/registry/index.json \
    public/locales/fr/public-cloud/load-balancer/index.json
check_tar /home/ubuntu/new_manager_public-cloud.tar

#############################################
# new_manager_iam.tar
#############################################
echo "[4/12] Création de new_manager_iam.tar..."
cd /home/ubuntu/aiapp/frontend
tar -cf /home/ubuntu/new_manager_iam.tar \
    src/pages/iam/components/IdentitySelector/ServiceAccountIdentities.tsx \
    src/pages/iam/components/IdentitySelector/AccountIdentities.tsx \
    src/pages/iam/components/IdentitySelector/index.tsx \
    src/pages/iam/components/IdentitySelector/UserIdentities.tsx \
    src/pages/iam/components/IdentitySelector/GroupIdentities.tsx \
    src/pages/iam/components/DelegationModal.tsx \
    src/pages/iam/components/SelectModal.tsx \
    src/pages/iam/components/index.ts \
    src/pages/iam/okms/index.tsx \
    src/pages/iam/okms/tabs/KeysTab.tsx \
    src/pages/iam/okms/tabs/index.ts \
    src/pages/iam/okms/tabs/CredentialsTab.tsx \
    src/pages/iam/okms/styles.css \
    src/pages/iam/secret/index.tsx \
    src/pages/iam/secret/tabs/AccessTab.tsx \
    src/pages/iam/secret/tabs/SecretsTab.tsx \
    src/pages/iam/secret/tabs/VersionsTab.tsx \
    src/pages/iam/secret/tabs/index.ts \
    src/pages/iam/secret/styles.css \
    src/pages/iam/dbaas-logs/index.tsx \
    src/pages/iam/dbaas-logs/tabs/AliasesTab.tsx \
    src/pages/iam/dbaas-logs/tabs/StreamsTab.tsx \
    src/pages/iam/dbaas-logs/tabs/IndicesTab.tsx \
    src/pages/iam/dbaas-logs/tabs/DashboardsTab.tsx \
    src/pages/iam/dbaas-logs/tabs/index.ts \
    src/pages/iam/dbaas-logs/tabs/InputsTab.tsx \
    src/pages/iam/dbaas-logs/styles.css \
    src/pages/iam/index.tsx \
    src/pages/iam/metrics/index.tsx \
    src/pages/iam/metrics/tabs/TokensTab.tsx \
    src/pages/iam/metrics/tabs/TasksTab.tsx \
    src/pages/iam/metrics/tabs/GeneralTab.tsx \
    src/pages/iam/metrics/tabs/index.ts \
    src/pages/iam/metrics/styles.css \
    src/pages/iam/utils.tsx \
    src/pages/iam/tabs/GroupsTab.tsx \
    src/pages/iam/tabs/IdentitiesTab.tsx \
    src/pages/iam/tabs/LogsTab.tsx \
    src/pages/iam/tabs/PoliciesTab.tsx \
    src/pages/iam/tabs/index.ts \
    src/pages/iam/hsm/index.tsx \
    src/pages/iam/hsm/tabs/TasksTab.tsx \
    src/pages/iam/hsm/tabs/GeneralTab.tsx \
    src/pages/iam/hsm/tabs/PartitionsTab.tsx \
    src/pages/iam/hsm/tabs/index.ts \
    src/pages/iam/hsm/styles.css \
    src/pages/iam/logs/components/DataStreams.tsx \
    src/pages/iam/logs/components/LiveTail.tsx \
    src/pages/iam/logs/index.tsx \
    src/pages/iam/logs/tabs/AccessPolicyTab.tsx \
    src/pages/iam/logs/tabs/ActivityTab.tsx \
    src/pages/iam/logs/tabs/index.ts \
    src/pages/iam/logs/tabs/AuditTab.tsx \
    src/pages/iam/logs/styles.css \
    src/pages/iam/styles.css \
    src/services/iam.hsm.ts \
    src/services/iam.metrics.ts \
    src/services/iam.logs.ts \
    src/services/iam.ts \
    src/services/iam.okms.ts \
    src/services/iam.secret.ts \
    src/services/iam.dbaas-logs.ts \
    public/locales/en/iam/okms/index.json \
    public/locales/en/iam/secret/index.json \
    public/locales/en/iam/identities.json \
    public/locales/en/iam/dbaas-logs/index.json \
    public/locales/en/iam/metrics/index.json \
    public/locales/en/iam/hsm/index.json \
    public/locales/en/iam/index.json \
    public/locales/en/iam/logs.json \
    public/locales/fr/iam/okms/index.json \
    public/locales/fr/iam/secret/index.json \
    public/locales/fr/iam/identities.json \
    public/locales/fr/iam/dbaas-logs/index.json \
    public/locales/fr/iam/metrics/index.json \
    public/locales/fr/iam/hsm/index.json \
    public/locales/fr/iam/index.json \
    public/locales/fr/iam/logs.json
check_tar /home/ubuntu/new_manager_iam.tar

#############################################
# new_manager_web-cloud.tar
#############################################
echo "[5/12] Création de new_manager_web-cloud.tar..."
cd /home/ubuntu/aiapp/frontend
tar -cf /home/ubuntu/new_manager_web-cloud.tar \
    src/pages/web-cloud/voip/index.tsx \
    src/pages/web-cloud/voip/tabs/VoicemailsTab.tsx \
    src/pages/web-cloud/voip/tabs/NumbersTab.tsx \
    src/pages/web-cloud/voip/tabs/index.ts \
    src/pages/web-cloud/voip/tabs/LinesTab.tsx \
    src/pages/web-cloud/voip/styles.css \
    src/pages/web-cloud/domains/index.tsx \
    src/pages/web-cloud/domains/tabs/ZoneTab.tsx \
    src/pages/web-cloud/domains/tabs/DnsTab.tsx \
    src/pages/web-cloud/domains/tabs/TasksTab.tsx \
    src/pages/web-cloud/domains/tabs/RedirectionTab.tsx \
    src/pages/web-cloud/domains/tabs/DynHostTab.tsx \
    src/pages/web-cloud/domains/tabs/DnssecTab.tsx \
    src/pages/web-cloud/domains/tabs/GeneralTab.tsx \
    src/pages/web-cloud/domains/tabs/GlueTab.tsx \
    src/pages/web-cloud/domains/tabs/index.ts \
    src/pages/web-cloud/domains/styles.css \
    src/pages/web-cloud/hosting/index.tsx \
    src/pages/web-cloud/hosting/tabs/MultisiteTab.tsx \
    src/pages/web-cloud/hosting/tabs/FtpTab.tsx \
    src/pages/web-cloud/hosting/tabs/CronTab.tsx \
    src/pages/web-cloud/hosting/tabs/TasksTab.tsx \
    src/pages/web-cloud/hosting/tabs/ModulesTab.tsx \
    src/pages/web-cloud/hosting/tabs/EnvvarsTab.tsx \
    src/pages/web-cloud/hosting/tabs/LogsTab.tsx \
    src/pages/web-cloud/hosting/tabs/DatabaseTab.tsx \
    src/pages/web-cloud/hosting/tabs/SslTab.tsx \
    src/pages/web-cloud/hosting/tabs/GeneralTab.tsx \
    src/pages/web-cloud/hosting/tabs/RuntimesTab.tsx \
    src/pages/web-cloud/hosting/tabs/EmailsTab.tsx \
    src/pages/web-cloud/hosting/tabs/index.ts \
    src/pages/web-cloud/hosting/styles.css \
    src/pages/web-cloud/email-pro/index.tsx \
    src/pages/web-cloud/email-pro/tabs/DomainsTab.tsx \
    src/pages/web-cloud/email-pro/tabs/TasksTab.tsx \
    src/pages/web-cloud/email-pro/tabs/AccountsTab.tsx \
    src/pages/web-cloud/email-pro/tabs/index.ts \
    src/pages/web-cloud/carrier-sip/index.tsx \
    src/pages/web-cloud/carrier-sip/tabs/CdrTab.tsx \
    src/pages/web-cloud/carrier-sip/tabs/EndpointsTab.tsx \
    src/pages/web-cloud/carrier-sip/tabs/GeneralTab.tsx \
    src/pages/web-cloud/carrier-sip/tabs/index.ts \
    src/pages/web-cloud/office/index.tsx \
    src/pages/web-cloud/office/tabs/DomainsTab.tsx \
    src/pages/web-cloud/office/tabs/TasksTab.tsx \
    src/pages/web-cloud/office/tabs/UsersTab.tsx \
    src/pages/web-cloud/office/tabs/index.ts \
    src/pages/web-cloud/private-database/index.tsx \
    src/pages/web-cloud/private-database/tabs/DatabasesTab.tsx \
    src/pages/web-cloud/private-database/tabs/TasksTab.tsx \
    src/pages/web-cloud/private-database/tabs/UsersTab.tsx \
    src/pages/web-cloud/private-database/tabs/WhitelistTab.tsx \
    src/pages/web-cloud/private-database/tabs/GeneralTab.tsx \
    src/pages/web-cloud/private-database/tabs/index.ts \
    src/pages/web-cloud/private-database/styles.css \
    src/pages/web-cloud/index.tsx \
    src/pages/web-cloud/exchange/index.tsx \
    src/pages/web-cloud/exchange/tabs/DomainsTab.tsx \
    src/pages/web-cloud/exchange/tabs/TasksTab.tsx \
    src/pages/web-cloud/exchange/tabs/GroupsTab.tsx \
    src/pages/web-cloud/exchange/tabs/ResourcesTab.tsx \
    src/pages/web-cloud/exchange/tabs/AccountsTab.tsx \
    src/pages/web-cloud/exchange/tabs/index.ts \
    src/pages/web-cloud/email-domain/index.tsx \
    src/pages/web-cloud/email-domain/tabs/TasksTab.tsx \
    src/pages/web-cloud/email-domain/tabs/RedirectionsTab.tsx \
    src/pages/web-cloud/email-domain/tabs/MailingListsTab.tsx \
    src/pages/web-cloud/email-domain/tabs/AccountsTab.tsx \
    src/pages/web-cloud/email-domain/tabs/index.ts \
    src/pages/web-cloud/pack-xdsl/index.tsx \
    src/pages/web-cloud/pack-xdsl/tabs/VoipTab.tsx \
    src/pages/web-cloud/pack-xdsl/tabs/TasksTab.tsx \
    src/pages/web-cloud/pack-xdsl/tabs/AccessTab.tsx \
    src/pages/web-cloud/pack-xdsl/tabs/ServicesTab.tsx \
    src/pages/web-cloud/pack-xdsl/tabs/GeneralTab.tsx \
    src/pages/web-cloud/pack-xdsl/tabs/index.ts \
    src/pages/web-cloud/dns-zones/index.tsx \
    src/pages/web-cloud/dns-zones/tabs/TasksTab.tsx \
    src/pages/web-cloud/dns-zones/tabs/HistoryTab.tsx \
    src/pages/web-cloud/dns-zones/tabs/RecordsTab.tsx \
    src/pages/web-cloud/dns-zones/tabs/index.ts \
    src/pages/web-cloud/dns-zones/styles.css \
    src/pages/web-cloud/sms/index.tsx \
    src/pages/web-cloud/sms/tabs/IncomingTab.tsx \
    src/pages/web-cloud/sms/tabs/SendersTab.tsx \
    src/pages/web-cloud/sms/tabs/OutgoingTab.tsx \
    src/pages/web-cloud/sms/tabs/index.ts \
    src/pages/web-cloud/sms/styles.css \
    src/pages/web-cloud/overthebox/index.tsx \
    src/pages/web-cloud/overthebox/tabs/TasksTab.tsx \
    src/pages/web-cloud/overthebox/tabs/GeneralTab.tsx \
    src/pages/web-cloud/overthebox/tabs/RemotesTab.tsx \
    src/pages/web-cloud/overthebox/tabs/index.ts \
    src/pages/web-cloud/styles.css \
    src/pages/web-cloud/zimbra/index.tsx \
    src/pages/web-cloud/zimbra/tabs/DomainsTab.tsx \
    src/pages/web-cloud/zimbra/tabs/TasksTab.tsx \
    src/pages/web-cloud/zimbra/tabs/AliasesTab.tsx \
    src/pages/web-cloud/zimbra/tabs/AccountsTab.tsx \
    src/pages/web-cloud/zimbra/tabs/index.ts \
    src/pages/web-cloud/fax/index.tsx \
    src/pages/web-cloud/fax/styles.css \
    src/services/web-cloud.voip.ts \
    src/services/web-cloud.domains.ts \
    src/services/web-cloud.exchange.ts \
    src/services/web-cloud.private-database.ts \
    src/services/web-cloud.hosting.ts \
    src/services/web-cloud.overthebox.ts \
    src/services/web-cloud.carrier-sip.ts \
    src/services/web-cloud.zimbra.ts \
    src/services/web-cloud.pack-xdsl.ts \
    src/services/web-cloud.email-domain.ts \
    src/services/web-cloud.email-pro.ts \
    src/services/web-cloud.fax.ts \
    src/services/web-cloud.sms.ts \
    src/services/web-cloud.dns-zones.ts \
    src/services/web-cloud.office.ts \
    public/locales/en/web-cloud/voip/index.json \
    public/locales/en/web-cloud/domains/index.json \
    public/locales/en/web-cloud/hosting/index.json \
    public/locales/en/web-cloud/email-pro/index.json \
    public/locales/en/web-cloud/carrier-sip/index.json \
    public/locales/en/web-cloud/office/index.json \
    public/locales/en/web-cloud/private-database/index.json \
    public/locales/en/web-cloud/exchange/index.json \
    public/locales/en/web-cloud/email-domain/index.json \
    public/locales/en/web-cloud/pack-xdsl/index.json \
    public/locales/en/web-cloud/index.json \
    public/locales/en/web-cloud/dns-zones/index.json \
    public/locales/en/web-cloud/sms/index.json \
    public/locales/en/web-cloud/overthebox/index.json \
    public/locales/en/web-cloud/zimbra/index.json \
    public/locales/en/web-cloud/fax/index.json \
    public/locales/fr/web-cloud/voip/index.json \
    public/locales/fr/web-cloud/domains/index.json \
    public/locales/fr/web-cloud/hosting/index.json \
    public/locales/fr/web-cloud/email-pro/index.json \
    public/locales/fr/web-cloud/carrier-sip/index.json \
    public/locales/fr/web-cloud/office/index.json \
    public/locales/fr/web-cloud/private-database/index.json \
    public/locales/fr/web-cloud/exchange/index.json \
    public/locales/fr/web-cloud/email-domain/index.json \
    public/locales/fr/web-cloud/pack-xdsl/index.json \
    public/locales/fr/web-cloud/index.json \
    public/locales/fr/web-cloud/dns-zones/index.json \
    public/locales/fr/web-cloud/sms/index.json \
    public/locales/fr/web-cloud/overthebox/index.json \
    public/locales/fr/web-cloud/zimbra/index.json \
    public/locales/fr/web-cloud/fax/index.json
check_tar /home/ubuntu/new_manager_web-cloud.tar

#############################################
# new_manager_bare-metal.tar
#############################################
echo "[6/12] Création de new_manager_bare-metal.tar..."
cd /home/ubuntu/aiapp/frontend
tar -cf /home/ubuntu/new_manager_bare-metal.tar \
    src/pages/bare-metal/housing/index.tsx \
    src/pages/bare-metal/housing/tabs/TasksTab.tsx \
    src/pages/bare-metal/housing/tabs/GeneralTab.tsx \
    src/pages/bare-metal/housing/tabs/index.ts \
    src/pages/bare-metal/index.tsx \
    src/pages/bare-metal/vps/index.tsx \
    src/pages/bare-metal/vps/tabs/SnapshotTab.tsx \
    src/pages/bare-metal/vps/tabs/TasksTab.tsx \
    src/pages/bare-metal/vps/tabs/DisksTab.tsx \
    src/pages/bare-metal/vps/tabs/GeneralTab.tsx \
    src/pages/bare-metal/vps/tabs/IpsTab.tsx \
    src/pages/bare-metal/vps/tabs/index.ts \
    src/pages/bare-metal/vps/tabs/BackupsTab.tsx \
    src/pages/bare-metal/vps/styles.css \
    src/pages/bare-metal/dedicated/index.tsx \
    src/pages/bare-metal/dedicated/tabs/TasksTab.tsx \
    src/pages/bare-metal/dedicated/tabs/InterventionsTab.tsx \
    src/pages/bare-metal/dedicated/tabs/IpmiTab.tsx \
    src/pages/bare-metal/dedicated/tabs/GeneralTab.tsx \
    src/pages/bare-metal/dedicated/tabs/NetworkTab.tsx \
    src/pages/bare-metal/dedicated/tabs/index.ts \
    src/pages/bare-metal/dedicated/styles.css \
    src/pages/bare-metal/styles.css \
    src/pages/bare-metal/nasha/index.tsx \
    src/pages/bare-metal/nasha/tabs/TasksTab.tsx \
    src/pages/bare-metal/nasha/tabs/AccessesTab.tsx \
    src/pages/bare-metal/nasha/tabs/GeneralTab.tsx \
    src/pages/bare-metal/nasha/tabs/PartitionsTab.tsx \
    src/pages/bare-metal/nasha/tabs/index.ts \
    src/pages/bare-metal/nasha/tabs/SnapshotsTab.tsx \
    src/pages/bare-metal/nasha/styles.css \
    src/pages/bare-metal/netapp/index.tsx \
    src/pages/bare-metal/netapp/tabs/TasksTab.tsx \
    src/pages/bare-metal/netapp/tabs/GeneralTab.tsx \
    src/pages/bare-metal/netapp/tabs/VolumesTab.tsx \
    src/pages/bare-metal/netapp/tabs/index.ts \
    src/pages/bare-metal/netapp/tabs/SnapshotsTab.tsx \
    src/pages/bare-metal/netapp/styles.css \
    src/services/bare-metal.vps.ts \
    src/services/bare-metal.dedicated.ts \
    src/services/bare-metal.nasha.ts \
    src/services/bare-metal.netapp.ts \
    src/services/bare-metal.housing.ts \
    public/locales/en/bare-metal/housing/index.json \
    public/locales/en/bare-metal/vps/index.json \
    public/locales/en/bare-metal/index.json \
    public/locales/en/bare-metal/dedicated/index.json \
    public/locales/en/bare-metal/nasha/index.json \
    public/locales/en/bare-metal/netapp/index.json \
    public/locales/fr/bare-metal/housing/index.json \
    public/locales/fr/bare-metal/vps/index.json \
    public/locales/fr/bare-metal/index.json \
    public/locales/fr/bare-metal/dedicated/index.json \
    public/locales/fr/bare-metal/nasha/index.json \
    public/locales/fr/bare-metal/netapp/index.json
check_tar /home/ubuntu/new_manager_bare-metal.tar

#############################################
# new_manager_private-cloud.tar
#############################################
echo "[7/12] Création de new_manager_private-cloud.tar..."
cd /home/ubuntu/aiapp/frontend
tar -cf /home/ubuntu/new_manager_private-cloud.tar \
    src/pages/private-cloud/nutanix/index.tsx \
    src/pages/private-cloud/nutanix/tabs/NodesTab.tsx \
    src/pages/private-cloud/nutanix/tabs/TasksTab.tsx \
    src/pages/private-cloud/nutanix/tabs/GeneralTab.tsx \
    src/pages/private-cloud/nutanix/tabs/IpsTab.tsx \
    src/pages/private-cloud/nutanix/tabs/index.ts \
    src/pages/private-cloud/index.tsx \
    src/pages/private-cloud/sap/index.tsx \
    src/pages/private-cloud/veeam/index.tsx \
    src/pages/private-cloud/managed-baremetal/index.tsx \
    src/pages/private-cloud/styles.css \
    src/pages/private-cloud/vmware/index.tsx \
    src/pages/private-cloud/vmware/tabs/OperationsTab.tsx \
    src/pages/private-cloud/vmware/tabs/HostsTab.tsx \
    src/pages/private-cloud/vmware/tabs/SecurityTab.tsx \
    src/pages/private-cloud/vmware/tabs/DatacentersTab.tsx \
    src/pages/private-cloud/vmware/tabs/TasksTab.tsx \
    src/pages/private-cloud/vmware/tabs/LicenseTab.tsx \
    src/pages/private-cloud/vmware/tabs/UsersTab.tsx \
    src/pages/private-cloud/vmware/tabs/DatastoresTab.tsx \
    src/pages/private-cloud/vmware/tabs/GeneralTab.tsx \
    src/pages/private-cloud/vmware/tabs/index.ts \
    src/services/private-cloud.vmware.ts \
    src/services/private-cloud.ts \
    src/services/private-cloud.nutanix.ts \
    public/locales/en/private-cloud/nutanix/index.json \
    public/locales/en/private-cloud/index.json \
    public/locales/en/private-cloud/vmware/index.json \
    public/locales/fr/private-cloud/nutanix/index.json \
    public/locales/fr/private-cloud/index.json \
    public/locales/fr/private-cloud/vmware/index.json
check_tar /home/ubuntu/new_manager_private-cloud.tar

#############################################
# new_manager_network.tar
#############################################
echo "[8/12] Création de new_manager_network.tar..."
cd /home/ubuntu/aiapp/frontend
tar -cf /home/ubuntu/new_manager_network.tar \
    src/pages/network/vrack/index.tsx \
    src/pages/network/vrack/tabs/TasksTab.tsx \
    src/pages/network/vrack/tabs/ServicesTab.tsx \
    src/pages/network/vrack/tabs/index.ts \
    src/pages/network/vrack/styles.css \
    src/pages/network/index.tsx \
    src/pages/network/vrack-services/index.tsx \
    src/pages/network/vrack-services/tabs/EndpointsTab.tsx \
    src/pages/network/vrack-services/tabs/GeneralTab.tsx \
    src/pages/network/vrack-services/tabs/index.ts \
    src/pages/network/vrack-services/tabs/SubnetsTab.tsx \
    src/pages/network/cloud-connect/index.tsx \
    src/pages/network/cloud-connect/tabs/InterfacesTab.tsx \
    src/pages/network/cloud-connect/tabs/TasksTab.tsx \
    src/pages/network/cloud-connect/tabs/GeneralTab.tsx \
    src/pages/network/cloud-connect/tabs/index.ts \
    src/pages/network/cdn/index.tsx \
    src/pages/network/cdn/tabs/StatisticsTab.tsx \
    src/pages/network/cdn/tabs/DomainsTab.tsx \
    src/pages/network/cdn/tabs/TasksTab.tsx \
    src/pages/network/cdn/tabs/GeneralTab.tsx \
    src/pages/network/cdn/tabs/index.ts \
    src/pages/network/ip/index.tsx \
    src/pages/network/ip/styles.css \
    src/pages/network/styles.css \
    src/pages/network/security/index.tsx \
    src/pages/network/security/tabs/OverviewTab.tsx \
    src/pages/network/security/tabs/AttacksTab.tsx \
    src/pages/network/security/tabs/FirewallTab.tsx \
    src/pages/network/security/tabs/index.ts \
    src/pages/network/load-balancer/index.tsx \
    src/pages/network/load-balancer/tabs/FrontendsTab.tsx \
    src/pages/network/load-balancer/tabs/FarmsTab.tsx \
    src/pages/network/load-balancer/tabs/index.ts \
    src/pages/network/load-balancer/styles.css \
    src/services/network.vrack-services.ts \
    src/services/network.cdn.ts \
    src/services/network.cloud-connect.ts \
    src/services/network.security.ts \
    src/services/network.ts \
    public/locales/en/network/vrack/index.json \
    public/locales/en/network/vrack-services/index.json \
    public/locales/en/network/index.json \
    public/locales/en/network/cloud-connect/index.json \
    public/locales/en/network/cdn/index.json \
    public/locales/en/network/ip/index.json \
    public/locales/en/network/security/index.json \
    public/locales/en/network/load-balancer/index.json \
    public/locales/fr/network/vrack/index.json \
    public/locales/fr/network/vrack-services/index.json \
    public/locales/fr/network/index.json \
    public/locales/fr/network/cloud-connect/index.json \
    public/locales/fr/network/cdn/index.json \
    public/locales/fr/network/ip/index.json \
    public/locales/fr/network/security/index.json \
    public/locales/fr/network/load-balancer/index.json
check_tar /home/ubuntu/new_manager_network.tar

#############################################
# new_manager_license.tar
#############################################
echo "[9/12] Création de new_manager_license.tar..."
cd /home/ubuntu/aiapp/frontend
tar -cf /home/ubuntu/new_manager_license.tar \
    src/pages/license/directadmin/index.tsx \
    src/pages/license/directadmin/tabs/TasksTab.tsx \
    src/pages/license/directadmin/tabs/GeneralTab.tsx \
    src/pages/license/directadmin/tabs/index.ts \
    src/pages/license/plesk/index.tsx \
    src/pages/license/plesk/tabs/TasksTab.tsx \
    src/pages/license/plesk/tabs/GeneralTab.tsx \
    src/pages/license/plesk/tabs/index.ts \
    src/pages/license/cloudlinux/index.tsx \
    src/pages/license/cloudlinux/tabs/TasksTab.tsx \
    src/pages/license/cloudlinux/tabs/GeneralTab.tsx \
    src/pages/license/cloudlinux/tabs/index.ts \
    src/pages/license/sqlserver/index.tsx \
    src/pages/license/sqlserver/tabs/TasksTab.tsx \
    src/pages/license/sqlserver/tabs/GeneralTab.tsx \
    src/pages/license/sqlserver/tabs/index.ts \
    src/pages/license/index.tsx \
    src/pages/license/windows/index.tsx \
    src/pages/license/windows/tabs/TasksTab.tsx \
    src/pages/license/windows/tabs/GeneralTab.tsx \
    src/pages/license/windows/tabs/index.ts \
    src/pages/license/styles.css \
    src/pages/license/cpanel/index.tsx \
    src/pages/license/cpanel/tabs/TasksTab.tsx \
    src/pages/license/cpanel/tabs/GeneralTab.tsx \
    src/pages/license/cpanel/tabs/index.ts \
    src/pages/license/virtuozzo/index.tsx \
    src/pages/license/virtuozzo/tabs/TasksTab.tsx \
    src/pages/license/virtuozzo/tabs/GeneralTab.tsx \
    src/pages/license/virtuozzo/tabs/index.ts \
    src/services/license.ts \
    public/locales/en/license/index.json \
    public/locales/fr/license/index.json
check_tar /home/ubuntu/new_manager_license.tar

#############################################
# new_manager_home.billing.tar (granulaire)
#############################################
echo "[10/12] Création de new_manager_home.billing.tar..."
cd /home/ubuntu/aiapp/frontend
tar -cf /home/ubuntu/new_manager_home.billing.tar \
    src/pages/home/billing/shared/constants.ts \
    src/pages/home/billing/shared/periodHelpers.ts \
    src/pages/home/billing/shared/PeriodToolbar.tsx \
    src/pages/home/billing/shared/index.ts \
    src/pages/home/billing/shared/usePeriodNavigation.ts \
    src/pages/home/billing/index.tsx \
    src/pages/home/billing/utils.tsx \
    src/pages/home/billing/tabs/PaymentsTab.tsx \
    src/pages/home/billing/tabs/OrdersTab.tsx \
    src/pages/home/billing/tabs/ServicesTab.tsx \
    src/pages/home/billing/tabs/VouchersTab.tsx \
    src/pages/home/billing/tabs/MethodsTab.tsx \
    src/pages/home/billing/tabs/PrepaidTab.tsx \
    src/pages/home/billing/tabs/RefundsTab.tsx \
    src/pages/home/billing/tabs/FidelityTab.tsx \
    src/pages/home/billing/tabs/index.ts \
    src/pages/home/billing/tabs/ReferencesTab.tsx \
    src/pages/home/billing/tabs/InvoicesTab.tsx \
    src/pages/home/billing/tabs/ContractsTab.tsx \
    src/pages/home/billing/styles.css \
    src/pages/home/billing/icons.tsx \
    src/services/home.billing.services.ts \
    src/services/home.billing.ts \
    src/services/home.billing.agreements.ts \
    src/services/home.billing.orders.ts \
    public/locales/en/home/billing/tabs.json \
    public/locales/en/home/billing/index.json \
    public/locales/fr/home/billing/tabs.json \
    public/locales/fr/home/billing/index.json
check_tar /home/ubuntu/new_manager_home.billing.tar

#############################################
# new_manager_home.account.tar (granulaire)
#############################################
echo "[11/12] Création de new_manager_home.account.tar..."
cd /home/ubuntu/aiapp/frontend
tar -cf /home/ubuntu/new_manager_home.account.tar \
    src/pages/home/account/components/LastBillTile.tsx \
    src/pages/home/account/components/ProfileTile.tsx \
    src/pages/home/account/components/ShortcutsTile.tsx \
    src/pages/home/account/SecurityTab.tsx \
    src/pages/home/account/EditTab.tsx \
    src/pages/home/account/ContactsRequestsTab.tsx \
    src/pages/home/account/index.tsx \
    src/pages/home/account/ContactsServicesTab.tsx \
    src/pages/home/account/AdvancedTab.tsx \
    src/pages/home/account/styles.css \
    src/pages/home/account/security/TwoFactorSection.tsx \
    src/pages/home/account/security/useSecurityData.ts \
    src/pages/home/account/security/PasswordSection.tsx \
    src/pages/home/account/security/modals/SecurityModals.tsx \
    src/pages/home/account/security/IpRestrictionsSection.tsx \
    src/pages/home/account/security/SecurityIcons.tsx \
    src/pages/home/account/security/index.ts \
    src/pages/home/account/KycTab.tsx \
    src/pages/home/account/PrivacyTab.tsx \
    src/services/home.account.contacts.ts \
    src/services/home.account.security.ts \
    src/services/home.account.ts \
    src/services/home.account.procedures.ts \
    public/locales/en/home/account/edit.json \
    public/locales/en/home/account/contacts-requests.json \
    public/locales/en/home/account/privacy.json \
    public/locales/en/home/account/kyc.json \
    public/locales/en/home/account/index.json \
    public/locales/en/home/account/security.json \
    public/locales/en/home/account/contacts-services.json \
    public/locales/en/home/account/advanced.json \
    public/locales/fr/home/account/edit.json \
    public/locales/fr/home/account/contacts-requests.json \
    public/locales/fr/home/account/privacy.json \
    public/locales/fr/home/account/kyc.json \
    public/locales/fr/home/account/index.json \
    public/locales/fr/home/account/security.json \
    public/locales/fr/home/account/contacts-services.json \
    public/locales/fr/home/account/advanced.json
check_tar /home/ubuntu/new_manager_home.account.tar

#############################################
# new_manager_all.tar
#############################################
echo "[12/12] Création de new_manager_all.tar..."
cd /home/ubuntu/aiapp/frontend
tar -cf /home/ubuntu/new_manager_all.tar \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='.git' \
    --exclude='package-lock.json' \
    .
check_tar /home/ubuntu/new_manager_all.tar

echo ""
echo "=== Récapitulatif ==="
ls -lh /home/ubuntu/new_manager_*.tar
echo ""
echo "=== Terminé ==="
