// ============================================================
// DOMAINS/ALLDOM TAB - Gestion des packs AllDom
// ============================================================

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  listAllDomWithDetails,
  getTypeLabel,
  getRegisteredCount,
  formatDate,
  terminateAllDom,
  cancelTermination,
} from "./AlldomTab.service";
import type { AllDomEntry } from "../../domains.types";
import "./AlldomTab.css";

// ============ ICONS ============

const PackageIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// ============ COMPOSANT ============

export function AlldomTab() {
  const { t } = useTranslation("web-cloud/domains/index");

  const [entries, setEntries] = useState<AllDomEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load all packs
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await listAllDomWithDetails();
        setEntries(data);
        if (data.length > 0) setSelectedPack(data[0].serviceName);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Selected entry
  const selected = useMemo(
    () => entries.find(e => e.serviceName === selectedPack) || null,
    [entries, selectedPack]
  );

  // Filtered domains
  const filteredDomains = useMemo(() => {
    if (!selected) return [];
    if (!searchQuery.trim()) return selected.pack.domains;
    const q = searchQuery.toLowerCase();
    return selected.pack.domains.filter(d => d.name.toLowerCase().includes(q));
  }, [selected, searchQuery]);

  // Handlers
  const handleTerminate = async () => {
    if (!selected || !confirm(t("alldom.confirmTerminate"))) return;
    await terminateAllDom(selected.serviceName);
    const data = await listAllDomWithDetails();
    setEntries(data);
  };

  const handleCancelTerminate = async () => {
    if (!selected) return;
    await cancelTermination(selected.serviceName);
    const data = await listAllDomWithDetails();
    setEntries(data);
  };

  // Loading
  if (loading) {
    return <div className="domains-alldom-loading">Chargement...</div>;
  }

  // Error
  if (error) {
    return <div className="alldom-error">{error}</div>;
  }

  // Empty
  if (entries.length === 0) {
    return (
      <div className="domains-alldom-empty">
        <PackageIcon />
        <h4>{t("alldom.empty.title")}</h4>
        <p>{t("alldom.empty.description")}</p>
      </div>
    );
  }

  return (
    <div className="domains-alldom-tab">
      {/* Pack selector */}
      <div className="domains-alldom-selector">
        <select value={selectedPack || ""} onChange={e => setSelectedPack(e.target.value)}>
          {entries.map(e => (
            <option key={e.serviceName} value={e.serviceName}>
              {e.serviceName} ({e.pack.domains.length} domaines)
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <>
          {/* Warning if terminating */}
          {selected.serviceInfo?.isTerminating && (
            <div className="domains-alldom-warning">
              <WarningIcon />
              <span>{t("alldom.terminatingWarning")}</span>
              <button className="btn-link" onClick={handleCancelTerminate}>
                {t("alldom.cancelTermination")}
              </button>
            </div>
          )}

          {/* Pack info */}
          <div className="domains-alldom-info">
            <div className="domains-alldom-info-header">
              <h4>{selected.serviceName}</h4>
              <span className="alldom-badge info">{getTypeLabel(selected.pack.type)}</span>
            </div>
            <div className="domains-alldom-info-grid">
              <div className="domains-alldom-info-item">
                <label>{t("alldom.extensions")}</label>
                <span>{selected.pack.extensions.map(e => `.${e.toLowerCase()}`).join(", ")}</span>
              </div>
              <div className="domains-alldom-info-item">
                <label>{t("alldom.domainsCount")}</label>
                <span>{getRegisteredCount(selected.pack.domains)} / {selected.pack.domains.length}</span>
              </div>
            </div>
          </div>

          {/* Subscription */}
          {selected.serviceInfo && (
            <div className="domains-alldom-subscription">
              <h4>{t("alldom.subscription")}</h4>
              <div className="domains-alldom-subscription-grid">
                <div className="domains-alldom-info-item">
                  <label>{t("alldom.creation")}</label>
                  <span>{formatDate(selected.serviceInfo.creation)}</span>
                </div>
                <div className="domains-alldom-info-item">
                  <label>{t("alldom.expiration")}</label>
                  <span>{formatDate(selected.serviceInfo.expiration)}</span>
                </div>
                <div className="domains-alldom-info-item">
                  <label>{t("alldom.renewMode")}</label>
                  <span className={`alldom-badge ${selected.serviceInfo.renewMode === 'automatic' ? 'success' : 'warning'}`}>
                    {selected.serviceInfo.renewMode === 'automatic' ? t("alldom.automatic") : t("alldom.manual")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Domains list */}
          <div className="domains-alldom-domains">
            <div className="domains-alldom-domains-header">
              <h4>{t("alldom.domains")}</h4>
              <span className="domains-alldom-domains-count">
                {filteredDomains.length} / {selected.pack.domains.length}
              </span>
            </div>
            <div className="domains-alldom-search">
              <input
                type="text"
                placeholder={t("alldom.searchDomains")}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <table className="domains-alldom-table">
              <thead>
                <tr>
                  <th>{t("alldom.domain")}</th>
                  <th>{t("alldom.status")}</th>
                  <th>{t("alldom.expiration")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredDomains.map(d => (
                  <tr key={d.name}>
                    <td className="alldom-font-mono">{d.name}</td>
                    <td>
                      <span className={`alldom-badge ${d.registrationStatus === 'REGISTERED' ? 'success' : 'inactive'}`}>
                        {d.registrationStatus === 'REGISTERED' ? '✓' : '○'} {d.registrationStatus}
                      </span>
                    </td>
                    <td>{formatDate(d.expiresAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          {!selected.serviceInfo?.isTerminating && (
            <div className="domains-alldom-actions">
              <button className="alldom-btn-danger" onClick={handleTerminate}>
                {t("alldom.terminate")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AlldomTab;
