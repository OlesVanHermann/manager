// ============================================================
// ALLDOM PAGE - Liste des packs AllDom
// ============================================================

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { allDomService, AllDomEntry, AllDomDomain } from "../../../services/web-cloud.alldom";
import { TerminateModal } from "./modals/TerminateModal";
import { CancelTerminateModal } from "./modals/CancelTerminateModal";
import "../styles.css";
import "./styles.css";

// ============ ICONS ============

const PackageIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// ============ COMPOSANT PRINCIPAL ============

/** Page de listing des packs AllDom. */
export default function AllDomPage() {
  const { t } = useTranslation("web-cloud/alldom/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [entries, setEntries] = useState<AllDomEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // ---------- LOAD DATA ----------
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await allDomService.listAllDomWithDetails();
        setEntries(data);
        if (data.length > 0) setSelectedId(data[0].serviceName);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ---------- SELECTED ENTRY ----------
  const selectedEntry = useMemo(
    () => entries.find((e) => e.serviceName === selectedId) || null,
    [entries, selectedId]
  );

  // ---------- FILTERED ENTRIES ----------
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter((e) => e.serviceName.toLowerCase().includes(q));
  }, [entries, searchQuery]);

  // ---------- HELPERS ----------
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "FRENCH": return t("types.french");
      case "FRENCH+INTERNATIONAL": return t("types.frenchInternational");
      case "INTERNATIONAL": return t("types.international");
      default: return type;
    }
  };

  const getRegisteredCount = (domains: AllDomDomain[]) => domains.filter((d) => d.registrationStatus === "REGISTERED").length;

  // ---------- HANDLERS ----------
  const handleTerminate = async (selectedDomains: string[]) => {
    if (!selectedEntry) return;
    await allDomService.terminateAllDom(selectedEntry.serviceName);
    if (selectedDomains.length > 0) {
      await allDomService.terminateDomains(selectedDomains);
    }
    const data = await allDomService.listAllDomWithDetails();
    setEntries(data);
  };

  const handleCancelTermination = async () => {
    if (!selectedEntry) return;
    await allDomService.cancelTermination(selectedEntry.serviceName);
    const domains = selectedEntry.domains.filter((d) => d.registrationStatus === "REGISTERED").map((d) => d.name);
    if (domains.length > 0) {
      await allDomService.cancelDomainTerminations(domains);
    }
    const data = await allDomService.listAllDomWithDetails();
    setEntries(data);
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="service-list-page">
        <div className="service-list-header">
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
        </div>
        <div className="empty-state"><p>{tCommon("loading")}</p></div>
      </div>
    );
  }

  // ---------- RENDER ERROR ----------
  if (error) {
    return (
      <div className="service-list-page">
        <div className="service-list-header">
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
        </div>
        <div className="empty-state"><p className="status-badge error">{error}</p></div>
      </div>
    );
  }

  // ---------- RENDER EMPTY ----------
  if (entries.length === 0) {
    return (
      <div className="service-list-page">
        <div className="service-list-header">
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon"><PackageIcon /></div>
          <h3>{t("empty.title")}</h3>
          <p>{t("empty.description")}</p>
        </div>
  
        {showTerminateModal && selectedEntry && (
          <TerminateModal
            serviceName={selectedEntry.serviceName}
            domains={selectedEntry.domains}
            onConfirm={handleTerminate}
            onClose={() => setShowTerminateModal(false)}
          />
        )}
  
        {showCancelModal && selectedEntry && (
          <CancelTerminateModal
            serviceName={selectedEntry.serviceName}
            onConfirm={handleCancelTermination}
            onClose={() => setShowCancelModal(false)}
          />
        )}
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="service-list-page">
      <div className="service-list-header">
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </div>
      <div className="service-list-content">
        <div className="service-list-sidebar">
          <div className="sidebar-search">
            <input type="text" placeholder={tCommon("search")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
          </div>
          <div className="section-header" style={{ padding: "var(--space-3) var(--space-4)" }}>
            <span className="section-count">{filteredEntries.length} {t("serviceUnit")}</span>
          </div>
          <div className="service-list-items">
            {filteredEntries.map((entry) => (
              <div key={entry.serviceName} className={`service-item ${selectedId === entry.serviceName ? "selected" : ""}`} onClick={() => setSelectedId(entry.serviceName)}>
                <div className="service-item-content">
                  <div className="service-item-name">{entry.serviceName}</div>
                  <div className="service-item-badges">
                    <span className="badge-icon">{getRegisteredCount(entry.domains)}/{entry.domains.length}</span>
                    {entry.serviceInfo?.isTerminating && <span className="badge warning" title={t("terminatingTooltip")}>⚠️</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="service-list-main">
          {selectedEntry ? (
            <div className="detail-card">
              <div className="detail-card-header">
                <h2>{selectedEntry.serviceName}</h2>
                <div className="header-badges">
                  <span className="badge info">{getTypeLabel(selectedEntry.type)}</span>
                  {selectedEntry.serviceInfo?.isTerminating && <span className="badge warning"><WarningIcon /> {t("terminating")}</span>}
                </div>
              </div>

              {selectedEntry.serviceInfo?.isTerminating && (
                <div className="warning-banner">
                  <WarningIcon />
                  <span>{t("terminatingWarning", { date: formatDate(selectedEntry.serviceInfo.expiration) })}</span>
                   <button className="btn-link" onClick={() => setShowCancelModal(true)}>{t("cancelTermination")}</button>
                </div>
              )}

              <div className="alldom-sections">
                <section className="alldom-section">
                  <h3>{t("sections.info")}</h3>
                  <div className="info-grid">
                    <div className="info-item"><label>{t("fields.type")}</label><span>{getTypeLabel(selectedEntry.type)}</span></div>
                    <div className="info-item"><label>{t("fields.extensions")}</label><span>{selectedEntry.extensions.join(", ") || "-"}</span></div>
                    <div className="info-item"><label>{t("fields.domains")}</label><span>{getRegisteredCount(selectedEntry.domains)} / {selectedEntry.domains.length}</span></div>
                    {selectedEntry.serviceInfo && (
                      <>
                        <div className="info-item"><label>{t("fields.creation")}</label><span>{formatDate(selectedEntry.serviceInfo.creation)}</span></div>
                        <div className="info-item"><label>{t("fields.expiration")}</label><span>{formatDate(selectedEntry.serviceInfo.expiration)}</span></div>
                        <div className="info-item"><label>{t("fields.renewMode")}</label><span className={`badge ${selectedEntry.serviceInfo.renewMode === "automatic" ? "success" : "warning"}`}>{selectedEntry.serviceInfo.renewMode === "automatic" ? t("renewModes.automatic") : t("renewModes.manual")}</span></div>
                      </>
                    )}
                  </div>
                </section>

                <section className="alldom-section">
                  <h3>{t("sections.contacts")}</h3>
                  {selectedEntry.serviceInfo && (
                    <div className="info-grid">
                      <div className="info-item"><label>{t("fields.admin")}</label><span className="nic">{selectedEntry.serviceInfo.contactAdmin}</span></div>
                      <div className="info-item"><label>{t("fields.tech")}</label><span className="nic">{selectedEntry.serviceInfo.contactTech}</span></div>
                      <div className="info-item"><label>{t("fields.billing")}</label><span className="nic">{selectedEntry.serviceInfo.contactBilling}</span></div>
                    </div>
                  )}
                </section>

                <section className="alldom-section">
                  <h3>{t("sections.domains")} ({selectedEntry.domains.length})</h3>
                  <div className="domains-table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{t("table.domain")}</th>
                          <th>{t("table.status")}</th>
                          <th>{t("table.expiration")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEntry.domains.map((domain) => (
                          <tr key={domain.name}>
                            <td className="domain-name">{domain.name}</td>
                            <td><span className={`badge ${domain.registrationStatus === "REGISTERED" ? "success" : "muted"}`}>{domain.registrationStatus === "REGISTERED" ? t("status.registered") : t("status.unregistered")}</span></td>
                            <td>{formatDate(domain.expiresAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
 
                 <div className="actions-row">
                   {selectedEntry.serviceInfo?.isTerminating ? (
                     <button className="btn-primary" onClick={() => setShowCancelModal(true)}>
                       {t("actions.cancelTerminate")}
                     </button>
                   ) : (
                     <button className="btn-danger" onClick={() => setShowTerminateModal(true)}>
                       {t("actions.terminate")}
                     </button>
                   )}
                   <a href={`https://www.ovh.com/manager/#/dedicated/billing/autorenew?searchText=${selectedEntry.serviceName}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                     {t("actions.configureRenewal")}
                   </a>
                   <a href={`https://www.ovh.com/manager/#/dedicated/contacts/services?serviceName=${selectedEntry.serviceName}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                     {t("actions.manageContacts")}
                   </a>
                 </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><PackageIcon /></div>
              <h3>{t("empty.selectTitle")}</h3>
              <p>{t("empty.selectDescription")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
