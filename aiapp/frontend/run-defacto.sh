#!/bin/bash
# ============================================================
# DÉFACTORISATION EMAILS - Script Principal
# Exécuter depuis /home/ubuntu/aiapp/frontend/
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="/home/ubuntu/aiapp/frontend"

echo "=============================================="
echo "=== DÉFACTORISATION MODULE EMAILS ==="
echo "=============================================="
echo ""
echo "Script directory: $SCRIPT_DIR"
echo "Frontend directory: $FRONTEND_DIR"
echo ""

# Vérifier qu'on est dans le bon répertoire
if [ ! -d "$FRONTEND_DIR/src/pages/web-cloud/emails" ]; then
  echo "❌ ERREUR: Répertoire $FRONTEND_DIR/src/pages/web-cloud/emails non trouvé"
  echo "   Assurez-vous d'exécuter depuis /home/ubuntu/aiapp/frontend/"
  exit 1
fi

cd "$FRONTEND_DIR"
echo "✅ Répertoire frontend trouvé"
echo ""

# ============================================================
# PHASE 1 : Création des services de page
# ============================================================

echo "=============================================="
echo "=== PHASE 1 : Création des services ==="
echo "=============================================="

# --- email-domain ---
echo ""
echo "--- 1/6 : email-domain ---"
cp src/pages/web-cloud/emails/email-domain/emailDomainPage.service.ts src/pages/web-cloud/emails/email-domain/emailDomainPage.service.ts.$(date +%Y%m%dT%H%M%S) 2>/dev/null || true
tee src/pages/web-cloud/emails/email-domain/emailDomainPage.service.ts > /dev/null <<'FILEEND'
// ============================================================
// SERVICE ORCHESTRATEUR LOCAL - EmailDomainPage
// Remplace les imports du service monolithique web-cloud.email-domain.ts
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { EmailDomain } from "./email-domain.types";

// ============ SERVICE ============

class EmailDomainPageService {
  /** Liste tous les domaines email (MX Plan). */
  async listDomains(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/domain");
    } catch {
      return [];
    }
  }

  /** Récupère les détails d'un domaine email. */
  async getDomain(domain: string): Promise<EmailDomain> {
    return ovhGet<EmailDomain>(`/email/domain/${domain}`);
  }

  /** Récupère les infos de service. */
  async getServiceInfos(domain: string): Promise<unknown> {
    return ovhGet(`/email/domain/${domain}/serviceInfos`);
  }
}

export const emailDomainPageService = new EmailDomainPageService();
FILEEND
echo "✅ emailDomainPage.service.ts créé"

# --- email-pro ---
echo ""
echo "--- 2/6 : email-pro ---"
cp src/pages/web-cloud/emails/email-pro/emailProPage.service.ts src/pages/web-cloud/emails/email-pro/emailProPage.service.ts.$(date +%Y%m%dT%H%M%S) 2>/dev/null || true
tee src/pages/web-cloud/emails/email-pro/emailProPage.service.ts > /dev/null <<'FILEEND'
// ============================================================
// SERVICE ORCHESTRATEUR LOCAL - EmailProPage
// Remplace les imports du service monolithique web-cloud.email-pro.ts
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { EmailProService } from "./email-pro.types";

// ============ SERVICE ============

class EmailProPageService {
  /** Liste tous les services Email Pro. */
  async listServices(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/pro");
    } catch {
      return [];
    }
  }

  /** Récupère les détails d'un service Email Pro. */
  async getService(service: string): Promise<EmailProService> {
    return ovhGet<EmailProService>(`/email/pro/${service}`);
  }

  /** Récupère les infos de service. */
  async getServiceInfos(service: string): Promise<unknown> {
    return ovhGet(`/email/pro/${service}/serviceInfos`);
  }
}

export const emailProPageService = new EmailProPageService();
FILEEND
echo "✅ emailProPage.service.ts créé"

# --- exchange ---
echo ""
echo "--- 3/6 : exchange ---"
cp src/pages/web-cloud/emails/exchange/exchangePage.service.ts src/pages/web-cloud/emails/exchange/exchangePage.service.ts.$(date +%Y%m%dT%H%M%S) 2>/dev/null || true
tee src/pages/web-cloud/emails/exchange/exchangePage.service.ts > /dev/null <<'FILEEND'
// ============================================================
// SERVICE ORCHESTRATEUR LOCAL - ExchangePage
// Fonctions API pour la page principale Exchange
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { ExchangeService } from "./exchange.types";

// ============ SERVICE ============

class ExchangePageService {
  /** Liste toutes les organisations Exchange. */
  async listOrganizations(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/exchange");
    } catch {
      return [];
    }
  }

  /** Liste tous les services d'une organisation. */
  async listServices(org: string): Promise<string[]> {
    try {
      return await ovhGet<string[]>(`/email/exchange/${org}/service`);
    } catch {
      return [];
    }
  }

  /** Récupère les détails d'un service Exchange. */
  async getService(org: string, service: string): Promise<ExchangeService> {
    return ovhGet<ExchangeService>(`/email/exchange/${org}/service/${service}`);
  }

  /** Récupère les infos de service. */
  async getServiceInfos(org: string, service: string): Promise<unknown> {
    return ovhGet(`/email/exchange/${org}/service/${service}/serviceInfos`);
  }
}

export const exchangePageService = new ExchangePageService();
FILEEND
echo "✅ exchangePage.service.ts créé"

# --- office ---
echo ""
echo "--- 4/6 : office ---"
cp src/pages/web-cloud/emails/office/officePage.service.ts src/pages/web-cloud/emails/office/officePage.service.ts.$(date +%Y%m%dT%H%M%S) 2>/dev/null || true
tee src/pages/web-cloud/emails/office/officePage.service.ts > /dev/null <<'FILEEND'
// ============================================================
// SERVICE ORCHESTRATEUR LOCAL - OfficePage
// Remplace les imports du service monolithique web-cloud.office.ts
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { OfficeTenant } from "./office.types";

// ============ SERVICE ============

class OfficePageService {
  /** Liste tous les tenants Office 365. */
  async listTenants(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/license/office");
    } catch {
      return [];
    }
  }

  /** Récupère les détails d'un tenant Office 365. */
  async getTenant(serviceName: string): Promise<OfficeTenant> {
    return ovhGet<OfficeTenant>(`/license/office/${serviceName}`);
  }

  /** Récupère les infos de service. */
  async getServiceInfos(serviceName: string): Promise<unknown> {
    return ovhGet(`/license/office/${serviceName}/serviceInfos`);
  }
}

export const officePageService = new OfficePageService();
FILEEND
echo "✅ officePage.service.ts créé"

# --- zimbra ---
echo ""
echo "--- 5/6 : zimbra ---"
cp src/pages/web-cloud/emails/zimbra/zimbraPage.service.ts src/pages/web-cloud/emails/zimbra/zimbraPage.service.ts.$(date +%Y%m%dT%H%M%S) 2>/dev/null || true
tee src/pages/web-cloud/emails/zimbra/zimbraPage.service.ts > /dev/null <<'FILEEND'
// ============================================================
// SERVICE ORCHESTRATEUR LOCAL - ZimbraPage
// Remplace les imports du service monolithique web-cloud.zimbra.ts
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { ZimbraService } from "./zimbra.types";

// ============ SERVICE ============

class ZimbraPageService {
  /** Liste tous les services Zimbra. */
  async listServices(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/zimbra");
    } catch {
      return [];
    }
  }

  /** Récupère les détails d'un service Zimbra. */
  async getService(serviceId: string): Promise<ZimbraService> {
    return ovhGet<ZimbraService>(`/email/zimbra/${serviceId}`);
  }

  /** Récupère les infos de service. */
  async getServiceInfos(serviceId: string): Promise<unknown> {
    return ovhGet(`/email/zimbra/${serviceId}/serviceInfos`);
  }
}

export const zimbraPageService = new ZimbraPageService();
FILEEND
echo "✅ zimbraPage.service.ts créé"

# --- emails (page parente) ---
echo ""
echo "--- 6/6 : emails (page parente) ---"
cp src/pages/web-cloud/emails/emailsPage.service.ts src/pages/web-cloud/emails/emailsPage.service.ts.$(date +%Y%m%dT%H%M%S) 2>/dev/null || true
tee src/pages/web-cloud/emails/emailsPage.service.ts > /dev/null <<'FILEEND'
// ============================================================
// SERVICE ORCHESTRATEUR LOCAL - EmailsPage (page groupe)
// Remplace les imports des 5 services monolithiques
// ============================================================

import { ovhGet } from "../../../services/api";

// ============ TYPES ============

export interface EmailsCounts {
  emailDomain: number;
  emailPro: number;
  exchange: number;
  office: number;
  zimbra: number;
}

// ============ SERVICE ============

class EmailsPageService {
  /** Liste les domaines email (MX Plan). */
  async listEmailDomains(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/domain");
    } catch {
      return [];
    }
  }

  /** Liste les services Email Pro. */
  async listEmailPro(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/pro");
    } catch {
      return [];
    }
  }

  /** Liste les organisations Exchange. */
  async listExchangeOrganizations(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/exchange");
    } catch {
      return [];
    }
  }

  /** Liste les tenants Office 365. */
  async listOfficeTenants(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/license/office");
    } catch {
      return [];
    }
  }

  /** Liste les services Zimbra. */
  async listZimbra(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/email/zimbra");
    } catch {
      return [];
    }
  }

  /** Charge tous les counts en parallèle. */
  async loadAllCounts(): Promise<EmailsCounts> {
    const [emailDomains, emailPros, exchanges, offices, zimbras] = await Promise.all([
      this.listEmailDomains(),
      this.listEmailPro(),
      this.listExchangeOrganizations(),
      this.listOfficeTenants(),
      this.listZimbra(),
    ]);
    return {
      emailDomain: emailDomains.length,
      emailPro: emailPros.length,
      exchange: exchanges.length,
      office: offices.length,
      zimbra: zimbras.length,
    };
  }
}

export const emailsPageService = new EmailsPageService();
FILEEND
echo "✅ emailsPage.service.ts créé"

# ============================================================
# PHASE 2 : Mise à jour des index.tsx
# ============================================================

echo ""
echo "=============================================="
echo "=== PHASE 2 : Mise à jour des index.tsx ==="
echo "=============================================="

# --- email-domain/index.tsx ---
echo ""
echo "--- 1/6 : email-domain/index.tsx ---"
cp src/pages/web-cloud/emails/email-domain/index.tsx src/pages/web-cloud/emails/email-domain/index.tsx.$(date +%Y%m%dT%H%M%S)
tee src/pages/web-cloud/emails/email-domain/index.tsx > /dev/null <<'FILEEND'
// ============================================================
// EMAIL DOMAIN PAGE - MX Plan (style Hosting)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../../../components/ServiceListPage";
import { emailDomainPageService } from "./emailDomainPage.service";
import type { EmailDomain } from "./email-domain.types";
import { AccountsTab } from "./tabs/accounts/AccountsTab.tsx";
import { RedirectionsTab } from "./tabs/redirections/RedirectionsTab.tsx";
import { MailingListsTab } from "./tabs/mailinglists/MailingListsTab.tsx";
import { TasksTab } from "./tabs/tasks/TasksTab.tsx";

// ============ ICONS ============

const MailIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Email Domain (MX Plan) avec liste a gauche et details a droite. */
export default function EmailDomainPage() {
  const { t } = useTranslation("web-cloud/email-domain/index");

  // ---------- STATE ----------
  const [domains, setDomains] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("accounts");
  const [domainDetails, setDomainDetails] = useState<EmailDomain | null>(null);

  // ---------- LOAD DOMAINS ----------
  const loadDomains = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const domainNames = await emailDomainPageService.listDomains();
      const items: ServiceItem[] = domainNames.map((name) => ({ id: name, name: name }));
      setDomains(items);
      if (items.length > 0 && !selectedDomain) {
        setSelectedDomain(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDomains(); }, [loadDomains]);

  // ---------- LOAD DETAILS ----------
  useEffect(() => {
    if (!selectedDomain) return;
    emailDomainPageService.getDomain(selectedDomain).then(setDomainDetails).catch(() => setDomainDetails(null));
  }, [selectedDomain]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "accounts", label: t("tabs.accounts") },
    { id: "redirections", label: t("tabs.redirections") },
    { id: "mailinglists", label: t("tabs.mailinglists") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-mx-plan"
      i18nNamespace="web-cloud/email-domain/index"
      services={domains}
      loading={loading}
      error={error}
      selectedService={selectedDomain}
      onSelectService={setSelectedDomain}
      emptyIcon={<MailIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedDomain && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedDomain}</h2>
            {domainDetails && (
              <span className={`badge ${domainDetails.status === 'ok' ? 'success' : 'warning'}`}>
                {domainDetails.status === 'ok' ? '✓ Actif' : '⚠ ' + domainDetails.status}
              </span>
            )}
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (
              <button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "accounts" && <AccountsTab domain={selectedDomain} />}
            {activeTab === "redirections" && <RedirectionsTab domain={selectedDomain} />}
            {activeTab === "mailinglists" && <MailingListsTab domain={selectedDomain} />}
            {activeTab === "tasks" && <TasksTab domain={selectedDomain} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
FILEEND
echo "✅ email-domain/index.tsx mis à jour"

# --- email-pro/index.tsx ---
echo ""
echo "--- 2/6 : email-pro/index.tsx ---"
cp src/pages/web-cloud/emails/email-pro/index.tsx src/pages/web-cloud/emails/email-pro/index.tsx.$(date +%Y%m%dT%H%M%S)
tee src/pages/web-cloud/emails/email-pro/index.tsx > /dev/null <<'FILEEND'
// ============================================================
// EMAIL PRO PAGE (style Hosting)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../../../components/ServiceListPage";
import { emailProPageService } from "./emailProPage.service";
import type { EmailProService } from "./email-pro.types";
import { AccountsTab } from "./tabs/accounts/AccountsTab.tsx";
import { DomainsTab } from "./tabs/domains/DomainsTab.tsx";
import { TasksTab } from "./tabs/tasks/TasksTab.tsx";

// ============ ICONS ============

const MailProIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><circle cx="18" cy="18" r="3" fill="#0050d7" stroke="#0050d7"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Email Pro avec liste a gauche et details a droite. */
export default function EmailProPage() {
  const { t } = useTranslation("web-cloud/email-pro/index");

  // ---------- STATE ----------
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("accounts");
  const [serviceDetails, setServiceDetails] = useState<EmailProService | null>(null);

  // ---------- LOAD SERVICES ----------
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const names = await emailProPageService.listServices();
      const items: ServiceItem[] = names.map((name) => ({ id: name, name: name }));
      setServices(items);
      if (items.length > 0 && !selectedService) {
        setSelectedService(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  // ---------- LOAD DETAILS ----------
  useEffect(() => {
    if (!selectedService) return;
    emailProPageService.getService(selectedService).then(setServiceDetails).catch(() => setServiceDetails(null));
  }, [selectedService]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "accounts", label: t("tabs.accounts") },
    { id: "domains", label: t("tabs.domains") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-email-pro"
      i18nNamespace="web-cloud/email-pro/index"
      services={services}
      loading={loading}
      error={error}
      selectedService={selectedService}
      onSelectService={setSelectedService}
      emptyIcon={<MailProIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedService && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedService}</h2>
            {serviceDetails && (
              <span className={`badge ${serviceDetails.state === 'ok' ? 'success' : 'warning'}`}>
                {serviceDetails.state === 'ok' ? '✓ Actif' : serviceDetails.state}
              </span>
            )}
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (
              <button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "accounts" && <AccountsTab serviceName={selectedService} />}
            {activeTab === "domains" && <DomainsTab serviceName={selectedService} />}
            {activeTab === "tasks" && <TasksTab serviceName={selectedService} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
FILEEND
echo "✅ email-pro/index.tsx mis à jour"

# --- exchange/index.tsx ---
echo ""
echo "--- 3/6 : exchange/index.tsx ---"
cp src/pages/web-cloud/emails/exchange/index.tsx src/pages/web-cloud/emails/exchange/index.tsx.$(date +%Y%m%dT%H%M%S)
tee src/pages/web-cloud/emails/exchange/index.tsx > /dev/null <<'FILEEND'
// ============================================================
// EXCHANGE PAGE - Microsoft Exchange (style Hosting)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../../../components/ServiceListPage";
import { exchangePageService } from "./exchangePage.service";
import type { ExchangeService } from "./exchange.types";

// Imports directs sans barrel file (JS-5)
import { AccountsTab } from "./tabs/accounts/AccountsTab.tsx";
import { DomainsTab } from "./tabs/domains/DomainsTab.tsx";
import { GroupsTab } from "./tabs/groups/GroupsTab.tsx";
import { ResourcesTab } from "./tabs/resources/ResourcesTab.tsx";
import { TasksTab } from "./tabs/tasks/TasksTab.tsx";

// ============ ICONS ============

const ExchangeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="M16 2v4M8 2v4" stroke="#0078d4"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Exchange avec liste a gauche et details a droite. */
export default function ExchangePage() {
  const { t } = useTranslation("web-cloud/exchange/index");

  // ---------- STATE ----------
  const [orgs, setOrgs] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("accounts");
  const [serviceDetails, setServiceDetails] = useState<ExchangeService | null>(null);

  // ---------- LOAD ORGS ----------
  const loadOrgs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const orgList = await exchangePageService.listOrganizations();
      const items: ServiceItem[] = [];
      for (const org of orgList) {
        const services = await exchangePageService.listServices(org);
        for (const svc of services) {
          items.push({ id: `${org}/${svc}`, name: svc, type: org });
        }
      }
      setOrgs(items);
      if (items.length > 0 && !selectedOrg) {
        setSelectedOrg(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrgs(); }, [loadOrgs]);

  // ---------- PARSE SELECTED ----------
  const [org, service] = selectedOrg?.split('/') || [null, null];

  // ---------- LOAD DETAILS ----------
  useEffect(() => {
    if (!org || !service) return;
    exchangePageService.getService(org, service).then(setServiceDetails).catch(() => setServiceDetails(null));
  }, [org, service]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "accounts", label: t("tabs.accounts") },
    { id: "domains", label: t("tabs.domains") },
    { id: "groups", label: t("tabs.groups") },
    { id: "resources", label: t("tabs.resources") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-exchange"
      i18nNamespace="web-cloud/exchange/index"
      services={orgs}
      loading={loading}
      error={error}
      selectedService={selectedOrg}
      onSelectService={setSelectedOrg}
      emptyIcon={<ExchangeIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedOrg && org && service && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{service}</h2>
            {serviceDetails && (
              <span className={`badge ${serviceDetails.state === 'ok' ? 'success' : 'warning'}`}>
                {serviceDetails.offer} - {serviceDetails.state}
              </span>
            )}
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (
              <button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "accounts" && <AccountsTab org={org} service={service} />}
            {activeTab === "domains" && <DomainsTab org={org} service={service} />}
            {activeTab === "groups" && <GroupsTab org={org} service={service} />}
            {activeTab === "resources" && <ResourcesTab org={org} service={service} />}
            {activeTab === "tasks" && <TasksTab org={org} service={service} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
FILEEND
echo "✅ exchange/index.tsx mis à jour"

# --- office/index.tsx ---
echo ""
echo "--- 4/6 : office/index.tsx ---"
cp src/pages/web-cloud/emails/office/index.tsx src/pages/web-cloud/emails/office/index.tsx.$(date +%Y%m%dT%H%M%S)
tee src/pages/web-cloud/emails/office/index.tsx > /dev/null <<'FILEEND'
// ============================================================
// OFFICE 365 PAGE (style Hosting)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../../../components/ServiceListPage";
import { officePageService } from "./officePage.service";
import type { OfficeTenant } from "./office.types";
import { UsersTab } from "./tabs/users/UsersTab.tsx";
import { DomainsTab } from "./tabs/domains/DomainsTab.tsx";
import { TasksTab } from "./tabs/tasks/TasksTab.tsx";

// ============ ICONS ============

const OfficeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 4v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M14 3v4h4"/><path d="M8 13h8M8 17h5" stroke="#d83b01"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Office 365 avec liste a gauche et details a droite. */
export default function OfficePage() {
  const { t } = useTranslation("web-cloud/office/index");

  // ---------- STATE ----------
  const [tenants, setTenants] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("users");
  const [tenantDetails, setTenantDetails] = useState<OfficeTenant | null>(null);

  // ---------- LOAD TENANTS ----------
  const loadTenants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const names = await officePageService.listTenants();
      const items: ServiceItem[] = names.map((name) => ({ id: name, name: name }));
      setTenants(items);
      if (items.length > 0 && !selectedTenant) {
        setSelectedTenant(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTenants(); }, [loadTenants]);

  // ---------- LOAD DETAILS ----------
  useEffect(() => {
    if (!selectedTenant) return;
    officePageService.getTenant(selectedTenant).then(setTenantDetails).catch(() => setTenantDetails(null));
  }, [selectedTenant]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "users", label: t("tabs.users") },
    { id: "domains", label: t("tabs.domains") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-microsoft-365"
      i18nNamespace="web-cloud/office/index"
      services={tenants}
      loading={loading}
      error={error}
      selectedService={selectedTenant}
      onSelectService={setSelectedTenant}
      emptyIcon={<OfficeIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedTenant && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{tenantDetails?.displayName || selectedTenant}</h2>
            {tenantDetails && (
              <span className={`badge ${tenantDetails.status === 'ok' ? 'success' : 'warning'}`}>
                {tenantDetails.status === 'ok' ? '✓ Actif' : tenantDetails.status}
              </span>
            )}
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (
              <button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "users" && <UsersTab tenantId={selectedTenant} />}
            {activeTab === "domains" && <DomainsTab tenantId={selectedTenant} />}
            {activeTab === "tasks" && <TasksTab tenantId={selectedTenant} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
FILEEND
echo "✅ office/index.tsx mis à jour"

# --- zimbra/index.tsx ---
echo ""
echo "--- 5/6 : zimbra/index.tsx ---"
cp src/pages/web-cloud/emails/zimbra/index.tsx src/pages/web-cloud/emails/zimbra/index.tsx.$(date +%Y%m%dT%H%M%S)
tee src/pages/web-cloud/emails/zimbra/index.tsx > /dev/null <<'FILEEND'
// ============================================================
// ZIMBRA PAGE (style Hosting)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../../../components/ServiceListPage";
import { zimbraPageService } from "./zimbraPage.service";
import type { ZimbraService } from "./zimbra.types";
import { AccountsTab } from "./tabs/accounts/AccountsTab.tsx";
import { DomainsTab } from "./tabs/domains/DomainsTab.tsx";
import { AliasesTab } from "./tabs/aliases/AliasesTab.tsx";
import { TasksTab } from "./tabs/tasks/TasksTab.tsx";

// ============ ICONS ============

const ZimbraIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><circle cx="12" cy="14" r="2" fill="#ff6600" stroke="#ff6600"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Zimbra avec liste a gauche et details a droite. */
export default function ZimbraPage() {
  const { t } = useTranslation("web-cloud/zimbra/index");

  // ---------- STATE ----------
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("accounts");
  const [serviceDetails, setServiceDetails] = useState<ZimbraService | null>(null);

  // ---------- LOAD SERVICES ----------
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const names = await zimbraPageService.listServices();
      const items: ServiceItem[] = names.map((name) => ({ id: name, name: name }));
      setServices(items);
      if (items.length > 0 && !selectedService) {
        setSelectedService(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  // ---------- LOAD DETAILS ----------
  useEffect(() => {
    if (!selectedService) return;
    zimbraPageService.getService(selectedService).then(setServiceDetails).catch(() => setServiceDetails(null));
  }, [selectedService]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "accounts", label: t("tabs.accounts") },
    { id: "domains", label: t("tabs.domains") },
    { id: "aliases", label: t("tabs.aliases") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-zimbra"
      i18nNamespace="web-cloud/zimbra/index"
      services={services}
      loading={loading}
      error={error}
      selectedService={selectedService}
      onSelectService={setSelectedService}
      emptyIcon={<ZimbraIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedService && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedService}</h2>
            {serviceDetails && (
              <span className={`badge ${serviceDetails.status === 'ok' ? 'success' : 'warning'}`}>
                {serviceDetails.offer} - {serviceDetails.status}
              </span>
            )}
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (
              <button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "accounts" && <AccountsTab serviceId={selectedService} />}
            {activeTab === "domains" && <DomainsTab serviceId={selectedService} />}
            {activeTab === "aliases" && <AliasesTab serviceId={selectedService} />}
            {activeTab === "tasks" && <TasksTab serviceId={selectedService} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
FILEEND
echo "✅ zimbra/index.tsx mis à jour"

# --- emails/index.tsx (page parente) ---
echo ""
echo "--- 6/6 : emails/index.tsx (page parente) ---"
cp src/pages/web-cloud/emails/index.tsx src/pages/web-cloud/emails/index.tsx.$(date +%Y%m%dT%H%M%S)
tee src/pages/web-cloud/emails/index.tsx > /dev/null <<'FILEEND'
// ============================================================
// EMAILS - Page groupe avec sous-navigation
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { emailsPageService, EmailsCounts } from "./emailsPage.service";
import EmailDomainPage from "./email-domain";
import EmailProPage from "./email-pro";
import ExchangePage from "./exchange";
import OfficePage from "./office";
import ZimbraPage from "./zimbra";

type SubSection = "email-domain" | "email-pro" | "exchange" | "office" | "zimbra";

/** Page groupe Emails avec sous-navigation. */
export default function EmailsPage() {
  const { t } = useTranslation("web-cloud/emails/index");

  const [activeSection, setActiveSection] = useState<SubSection>("email-domain");
  const [counts, setCounts] = useState<EmailsCounts>({ emailDomain: 0, emailPro: 0, exchange: 0, office: 0, zimbra: 0 });

  useEffect(() => {
    emailsPageService.loadAllCounts()
      .then(setCounts)
      .catch((err) => console.error("Failed to load counts:", err));
  }, []);

  const sections: { id: SubSection; labelKey: string; count: number }[] = [
    { id: "email-domain", labelKey: "sections.emailDomain", count: counts.emailDomain },
    { id: "email-pro", labelKey: "sections.emailPro", count: counts.emailPro },
    { id: "exchange", labelKey: "sections.exchange", count: counts.exchange },
    { id: "office", labelKey: "sections.office", count: counts.office },
    { id: "zimbra", labelKey: "sections.zimbra", count: counts.zimbra },
  ];

  return (
    <div className="service-list-page">
      <div className="sub-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`sub-nav-item ${activeSection === section.id ? "active" : ""}`}
            onClick={() => setActiveSection(section.id)}
          >
            {t(section.labelKey)}
            <span className="count">{section.count}</span>
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        {activeSection === "email-domain" && <EmailDomainPage />}
        {activeSection === "email-pro" && <EmailProPage />}
        {activeSection === "exchange" && <ExchangePage />}
        {activeSection === "office" && <OfficePage />}
        {activeSection === "zimbra" && <ZimbraPage />}
      </div>
    </div>
  );
}
FILEEND
echo "✅ emails/index.tsx mis à jour"

# ============================================================
# PHASE 3 : Vérification
# ============================================================

echo ""
echo "=============================================="
echo "=== PHASE 3 : Vérification ==="
echo "=============================================="

echo ""
echo "--- Test: Imports services monolithiques ---"
FOUND=$(grep -rn "services/web-cloud\." src/pages/web-cloud/emails/ 2>/dev/null | grep -v ".backup" | grep -v "\.tsx\.[0-9]")
if [ -z "$FOUND" ]; then
  echo "✅ OK: Aucun import de service monolithique"
else
  echo "❌ ERREUR: Imports monolithiques trouvés:"
  echo "$FOUND"
  echo ""
  echo "⚠️  Arrêt du script. Corrigez les erreurs avant de continuer."
  exit 1
fi

# ============================================================
# PHASE 4 : Nettoyage des services monolithiques
# ============================================================

echo ""
echo "=============================================="
echo "=== PHASE 4 : Nettoyage services monolithiques ==="
echo "=============================================="

BACKUP_DIR="src/services/backup.$(date +%Y%m%dT%H%M%S)"
mkdir -p "$BACKUP_DIR"

for svc in web-cloud.email-domain web-cloud.email-pro web-cloud.exchange web-cloud.office web-cloud.zimbra; do
  if [ -f "src/services/${svc}.ts" ]; then
    echo "Backup: ${svc}.ts → $BACKUP_DIR/"
    cp "src/services/${svc}.ts" "$BACKUP_DIR/"
    echo "Suppression: src/services/${svc}.ts"
    rm "src/services/${svc}.ts"
  else
    echo "⚠️  src/services/${svc}.ts non trouvé (déjà supprimé?)"
  fi
done

echo ""
echo "✅ Nettoyage terminé"
echo "   Backups dans: $BACKUP_DIR"

# ============================================================
# PHASE 5 : Build
# ============================================================

echo ""
echo "=============================================="
echo "=== PHASE 5 : Build ==="
echo "=============================================="

echo "Lancement du build..."
npm run build:dev

if [ $? -eq 0 ]; then
  echo ""
  echo "=============================================="
  echo "=== ✅ DÉFACTORISATION TERMINÉE AVEC SUCCÈS ==="
  echo "=============================================="
else
  echo ""
  echo "=============================================="
  echo "=== ❌ ERREUR DE BUILD ==="
  echo "=============================================="
  echo ""
  echo "Pour rollback, exécuter:"
  echo "  $SCRIPT_DIR/rollback.sh"
fi
