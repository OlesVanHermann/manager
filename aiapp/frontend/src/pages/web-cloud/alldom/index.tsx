// ============================================================
// ALLDOM PAGE - Liste et détail des packs AllDom
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAllDomList, useAllDomDetail } from "./hooks/useAllDomData";
import { PackInfo } from "./components/PackInfo";
import { DomainsTable } from "./components/DomainsTable";
import { SubscriptionCard } from "./components/SubscriptionCard";
import { TerminateModal } from "./modals/TerminateModal";
import { CancelTerminateModal } from "./modals/CancelTerminateModal";
import "./styles.css";
import "../styles.css";

// ============ ICONS ============

const PackIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

// ============ COMPOSANT PRINCIPAL ============

export default function AllDomPage() {
  const { t } = useTranslation("web-cloud/alldom/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const { packs, loading, error } = useAllDomList();
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [terminateModal, setTerminateModal] = useState(false);
  const [cancelTerminateModal, setCancelTerminateModal] = useState(false);

  // ---------- DETAIL ----------
  const { data: packDetail, loading: detailLoading, reload: reloadDetail } = useAllDomDetail(selectedPack);

  // ---------- AUTO-SELECT FIRST ----------
  useMemo(() => {
    if (packs.length > 0 && !selectedPack) {
      setSelectedPack(packs[0]);
    }
  }, [packs, selectedPack]);

  // ---------- FILTERED PACKS ----------
  const filteredPacks = useMemo(() => {
    if (!searchQuery.trim()) return packs;
    const q = searchQuery.toLowerCase();
    return packs.filter((p) => p.toLowerCase().includes(q));
  }, [packs, searchQuery]);

  // ---------- HELPERS ----------
  const hasTerminateAction = packDetail?.lifecyclePendingActions?.includes("terminateAtExpirationDate");

  // ---------- HANDLERS ----------
  const handleTerminateSuccess = () => {
    setTerminateModal(false);
    reloadDetail();
  };

  const handleCancelTerminateSuccess = () => {
    setCancelTerminateModal(false);
    reloadDetail();
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="service-list-page">
        <div className="service-list-header">
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
        </div>
        <div className="empty-state">
          <p>{tCommon("loading")}</p>
        </div>
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
        <div className="empty-state">
          <p className="status-badge error">{error}</p>
        </div>
      </div>
    );
  }

  // ---------- RENDER EMPTY ----------
  if (packs.length === 0) {
    return (
      <div className="service-list-page">
        <div className="service-list-header">
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon"><PackIcon /></div>
          <h3>{t("empty.title")}</h3>
          <p>{t("empty.description")}</p>
        </div>
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
        {/* Sidebar - Liste des packs */}
        <div className="service-list-sidebar">
          <div className="sidebar-search">
            <input
              type="text"
              placeholder={tCommon("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="section-header" style={{ padding: "var(--space-3) var(--space-4)" }}>
            <span className="section-count">{filteredPacks.length} {t("packUnit")}</span>
          </div>
          <div className="service-list-items">
            {filteredPacks.map((packName) => (
              <div
                key={packName}
                className={`service-item ${selectedPack === packName ? "selected" : ""}`}
                onClick={() => setSelectedPack(packName)}
              >
                <div className="service-item-content">
                  <div className="service-item-name">{packName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main - Détail du pack */}
        <div className="service-list-main">
          {selectedPack && packDetail ? (
            <div className="alldom-detail">
              {/* Warning résiliation */}
              {hasTerminateAction && (
                <div className="warning-banner">
                  <span>⚠️</span>
                  <div>
                    <strong>{t("terminateWarning.title")}</strong>
                    <p>{t("terminateWarning.message", { date: packDetail.expirationDate ? new Date(packDetail.expirationDate).toLocaleDateString("fr-FR") : "" })}</p>
                    <button className="btn-link" onClick={() => setCancelTerminateModal(true)}>
                      {t("terminateWarning.cancelLink")}
                    </button>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="detail-card-header">
                <h2>{selectedPack}</h2>
                <div className="header-actions">
                  {!hasTerminateAction && (
                    <button className="btn-danger-outline" onClick={() => setTerminateModal(true)}>
                      {t("actions.terminate")}
                    </button>
                  )}
                </div>
              </div>

              {/* Contenu */}
              <div className="alldom-grid">
                <PackInfo data={packDetail} />
                <SubscriptionCard 
                  data={packDetail} 
                  onTerminate={() => setTerminateModal(true)}
                  onCancelTerminate={() => setCancelTerminateModal(true)}
                  hasTerminateAction={hasTerminateAction || false}
                />
              </div>

              {/* Tableau des domaines */}
              <DomainsTable 
                domains={packDetail.pack.domains} 
                serviceName={selectedPack}
                hasTerminateAction={hasTerminateAction || false}
              />
            </div>
          ) : detailLoading ? (
            <div className="tab-loading">
              <div className="skeleton-block" />
              <div className="skeleton-block" />
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><PackIcon /></div>
              <h3>{t("empty.selectTitle")}</h3>
              <p>{t("empty.selectDescription")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {terminateModal && packDetail && (
        <TerminateModal
          serviceName={selectedPack!}
          serviceId={packDetail.service.serviceId}
          domains={packDetail.pack.domains}
          onClose={() => setTerminateModal(false)}
          onSuccess={handleTerminateSuccess}
        />
      )}

      {cancelTerminateModal && packDetail && (
        <CancelTerminateModal
          serviceName={selectedPack!}
          serviceId={packDetail.service.serviceId}
          onClose={() => setCancelTerminateModal(false)}
          onSuccess={handleCancelTerminateSuccess}
        />
      )}
    </div>
  );
}
