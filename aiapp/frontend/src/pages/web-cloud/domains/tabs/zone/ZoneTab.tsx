// ============================================================
import "./ZoneTab.css";
// TAB: ZONE DNS - Enregistrements DNS avec CRUD + Historique
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { zoneService } from "./ZoneTab.service";
import type { DnsZone, DnsRecord, DnsRecordCreate } from "../../domains.types";

interface Props {
  zoneName: string;
}

interface RecordForm {
  id?: number;
  fieldType: string;
  subDomain: string;
  target: string;
  ttl: number;
}

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV", "CAA", "DKIM", "SPF", "DMARC", "PTR"];
const DEFAULT_TTL = 3600;

// ============ ICONS ============

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ============ COMPOSANT PRINCIPAL ============

/** Onglet Zone DNS - Gestion des enregistrements avec CRUD + historique. */
export function ZoneTab({ zoneName }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE VIEW ----------
  const [view, setView] = useState<"records" | "history">("records");

  // ---------- STATE RECORDS ----------
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("");
  const [filterSubdomain, setFilterSubdomain] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // ---------- STATE HISTORY ----------
  const [history, setHistory] = useState<string[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  // ---------- STATE MODAL ----------
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState<RecordForm>({ fieldType: "A", subDomain: "", target: "", ttl: DEFAULT_TTL });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<DnsRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ---------- LOAD RECORDS ----------
  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setRecords([]);
      setLoadedCount(0);
      const ids = await zoneService.listRecords(zoneName, filterType || undefined);
      setTotalCount(ids.length);
      const all: DnsRecord[] = [];
      for (let i = 0; i < ids.length; i += 10) {
        const batch = ids.slice(i, i + 10);
        const data = await Promise.all(batch.map((id) => zoneService.getRecord(zoneName, id)));
        all.push(...data);
        setRecords([...all]);
        setLoadedCount(all.length);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [zoneName, filterType]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // ---------- LOAD HISTORY ----------
  const loadHistory = async () => {
    if (historyLoaded) return;
    try {
      setHistoryLoading(true);
      const dates = await zoneService.listHistory(zoneName);
      setHistory(dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()));
      setHistoryLoaded(true);
    } catch (err) {
      console.error("Failed to load history:", err);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ---------- HANDLERS VIEW ----------
  const handleShowHistory = () => {
    setView("history");
    loadHistory();
  };

  // ---------- REFRESH ZONE ----------
  const handleRefreshZone = async () => {
    try {
      setRefreshing(true);
      await zoneService.refreshZone(zoneName);
      await loadRecords();
    } catch (err) {
      setError(String(err));
    } finally {
      setRefreshing(false);
    }
  };

  // ---------- RESTORE HISTORY ----------
  const handleRestore = async (createdAt: string) => {
    if (!confirm(t("history.confirmRestore"))) return;
    try {
      setRestoring(createdAt);
      await zoneService.restoreHistory(zoneName, createdAt);
      alert(t("history.restored"));
      setHistoryLoaded(false);
      setView("records");
      await loadRecords();
    } catch (err) {
      alert(String(err));
    } finally {
      setRestoring(null);
    }
  };

  // ---------- MODAL HANDLERS ----------
  const openCreateModal = () => {
    setFormData({ fieldType: "A", subDomain: "", target: "", ttl: DEFAULT_TTL });
    setModalMode("create");
    setModalOpen(true);
  };

  const openEditModal = (record: DnsRecord) => {
    setFormData({ id: record.id, fieldType: record.fieldType, subDomain: record.subDomain, target: record.target, ttl: record.ttl });
    setModalMode("edit");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({ fieldType: "A", subDomain: "", target: "", ttl: DEFAULT_TTL });
  };

  const handleFormChange = (field: keyof RecordForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.target.trim()) {
      alert(t("zone.errorTargetRequired"));
      return;
    }
    try {
      setSaving(true);
      if (modalMode === "create") {
        await zoneService.createRecord(zoneName, { fieldType: formData.fieldType, subDomain: formData.subDomain, target: formData.target, ttl: formData.ttl });
      } else if (formData.id) {
        await zoneService.updateRecord(zoneName, formData.id, { subDomain: formData.subDomain, target: formData.target, ttl: formData.ttl });
      }
      closeModal();
      await loadRecords();
    } catch (err) {
      alert(String(err));
    } finally {
      setSaving(false);
    }
  };

  // ---------- DELETE HANDLERS ----------
  const handleDeleteClick = (record: DnsRecord) => {
    setDeleteConfirm(record);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      setDeleting(true);
      await zoneService.deleteRecord(zoneName, deleteConfirm.id);
      setDeleteConfirm(null);
      await loadRecords();
    } catch (err) {
      alert(String(err));
    } finally {
      setDeleting(false);
    }
  };

  // ---------- FILTERED RECORDS ----------
  const filteredRecords = records.filter((r) => {
    if (filterSubdomain && !r.subDomain.toLowerCase().includes(filterSubdomain.toLowerCase())) return false;
    return true;
  });

  // ---------- FORMAT DATE ----------
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  // ---------- RENDER HISTORY VIEW ----------
  if (view === "history") {
    return (
      <div className="zone-tab">
        <div className="zone-header">
          <div>
            <h3>{t("history.title")}</h3>
            <p className="zone-description">{t("history.description")}</p>
          </div>
          <button className="zone-btn-secondary" onClick={() => setView("records")}>← {t("zone.backToRecords")}</button>
        </div>
        {historyLoading ? (
          <div className="zone-loading"><div className="zone-skeleton" /><div className="zone-skeleton" /></div>
        ) : history.length === 0 ? (
          <div className="zone-empty"><p>{t("history.empty")}</p></div>
        ) : (
          <div className="zone-history-timeline">
            {history.map((date, index) => (
              <div key={date} className="zone-history-item">
                <div className="zone-history-dot" />
                <div className="zone-history-content">
                  <div className="zone-history-info">
                    <div className="zone-history-date">{formatDate(date)}</div>
                    {index === 0 && <span className="zone-badge success">{t("history.current")}</span>}
                  </div>
                  {index > 0 && (
                    <button className="zone-btn-secondary zone-btn-sm" onClick={() => handleRestore(date)} disabled={restoring === date}>
                      {restoring === date ? tCommon("loading") : t("history.restore")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="zone-info-box"><h4>{t("history.info")}</h4><p>{t("history.infoDesc")}</p></div>
      </div>
    );
  }

  // ---------- RENDER LOADING ----------
  if (loading && records.length === 0) {
    return <div className="zone-loading"><div className="zone-skeleton" /><div className="zone-skeleton" /><div className="zone-skeleton" /></div>;
  }

  // ---------- RENDER RECORDS VIEW ----------
  return (
    <div className="zone-tab">
      {/* Header */}
      <div className="zone-header">
        <div>
          <h3>{t("zone.title")}</h3>
          <p className="zone-description">{t("zone.description")}</p>
        </div>
        <div className="zone-header-actions">
          <button className="zone-btn-secondary" onClick={handleShowHistory}>📜 {t("zone.history")}</button>
          <button className="zone-btn-secondary" onClick={handleRefreshZone} disabled={refreshing}>{refreshing ? tCommon("loading") : t("zone.refresh")}</button>
          <button className="zone-btn-primary" onClick={openCreateModal}><PlusIcon /> {t("zone.addRecord")}</button>
        </div>
      </div>

      {/* Stats */}
      <div className="zone-stats">
        <div className="zone-stat-card"><div className="zone-stat-value">{totalCount}</div><div className="zone-stat-label">{t("zone.totalRecords")}</div></div>
        <div className="zone-stat-card"><div className="zone-stat-value">{records.filter((r) => r.fieldType === "A").length}</div><div className="zone-stat-label">A</div></div>
        <div className="zone-stat-card"><div className="zone-stat-value">{records.filter((r) => r.fieldType === "CNAME").length}</div><div className="zone-stat-label">CNAME</div></div>
        <div className="zone-stat-card"><div className="zone-stat-value">{records.filter((r) => r.fieldType === "MX").length}</div><div className="zone-stat-label">MX</div></div>
        <div className="zone-stat-card"><div className="zone-stat-value">{records.filter((r) => r.fieldType === "TXT").length}</div><div className="zone-stat-label">TXT</div></div>
      </div>

      {/* Filters */}
      <div className="zone-filters-row">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="zone-filter-select">
          <option value="">{t("zone.allTypes")}</option>
          {RECORD_TYPES.map((type) => (<option key={type} value={type}>{type}</option>))}
        </select>
        <input type="text" placeholder={t("zone.filterSubdomain")} value={filterSubdomain} onChange={(e) => setFilterSubdomain(e.target.value)} className="zone-filter-input" />
        <span className="zone-records-count">{loading ? `${loadedCount}/${totalCount}` : `${filteredRecords.length}`} {t("zone.records")}</span>
      </div>

      {/* Error */}
      {error && <div className="zone-error-banner">{error}</div>}

      {/* Records table */}
      {filteredRecords.length === 0 && !loading ? (
        <div className="zone-empty">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="48" height="48">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
          <p>{t("zone.empty")}</p>
          <button className="zone-btn-primary" onClick={openCreateModal}><PlusIcon /> {t("zone.addRecord")}</button>
        </div>
      ) : (
        <table className="zone-table">
          <thead>
            <tr>
              <th>{t("zone.type")}</th>
              <th>{t("zone.subdomain")}</th>
              <th>{t("zone.target")}</th>
              <th>{t("zone.ttl")}</th>
              <th>{t("zone.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id}>
                <td><span className={`zone-record-type type-${record.fieldType.toLowerCase()}`}>{record.fieldType}</span></td>
                <td className="zone-font-mono">{record.subDomain || "@"}</td>
                <td className="zone-target-cell" title={record.target}>{record.target}</td>
                <td>{record.ttl}s</td>
                <td className="zone-actions-cell">
                  <button className="zone-btn-icon" onClick={() => openEditModal(record)} title={t("zone.edit")}><EditIcon /></button>
                  <button className="zone-btn-icon danger" onClick={() => handleDeleteClick(record)} title={t("zone.delete")}><TrashIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Create/Edit */}
      {modalOpen && (
        <div className="zone-modal-overlay" onClick={closeModal}>
          <div className="zone-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="zone-modal-header">
              <h3>{modalMode === "create" ? t("zone.modalTitleCreate") : t("zone.modalTitleEdit")}</h3>
              <button className="zone-btn-icon" onClick={closeModal}><CloseIcon /></button>
            </div>
            <div className="zone-modal-body">
              <div className="zone-form-group">
                <label>{t("zone.type")}</label>
                <select value={formData.fieldType} onChange={(e) => handleFormChange("fieldType", e.target.value)} disabled={modalMode === "edit"} className="zone-input">
                  {RECORD_TYPES.map((type) => (<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
              <div className="zone-form-group">
                <label>{t("zone.subdomain")}</label>
                <div className="zone-input-with-suffix">
                  <input type="text" value={formData.subDomain} onChange={(e) => handleFormChange("subDomain", e.target.value)} placeholder="www" className="zone-input" />
                  <span className="zone-input-suffix">.{zoneName}</span>
                </div>
                <small className="zone-form-hint">{t("zone.subdomainHint")}</small>
              </div>
              <div className="zone-form-group">
                <label>{t("zone.target")} *</label>
                <input type="text" value={formData.target} onChange={(e) => handleFormChange("target", e.target.value)} placeholder={formData.fieldType === "A" ? "192.168.1.1" : formData.fieldType === "CNAME" ? "example.com." : ""} className="zone-input" required />
              </div>
              <div className="zone-form-group">
                <label>{t("zone.ttl")}</label>
                <select value={formData.ttl} onChange={(e) => handleFormChange("ttl", Number(e.target.value))} className="zone-input">
                  <option value={60}>60s (1 min)</option>
                  <option value={300}>300s (5 min)</option>
                  <option value={600}>600s (10 min)</option>
                  <option value={3600}>3600s (1 h)</option>
                  <option value={86400}>86400s (24 h)</option>
                </select>
              </div>
            </div>
            <div className="zone-modal-footer">
              <button className="zone-btn-secondary" onClick={closeModal}>{tCommon("actions.cancel")}</button>
              <button className="zone-btn-primary" onClick={handleSave} disabled={saving}>{saving ? tCommon("loading") : tCommon("actions.save")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete Confirm */}
      {deleteConfirm && (
        <div className="zone-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="zone-modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="zone-modal-header">
              <h3>{t("zone.confirmDeleteTitle")}</h3>
              <button className="zone-btn-icon" onClick={() => setDeleteConfirm(null)}><CloseIcon /></button>
            </div>
            <div className="zone-modal-body">
              <p>{t("zone.confirmDeleteMessage")}</p>
              <div className="zone-delete-preview">
                <strong>{deleteConfirm.fieldType}</strong> {deleteConfirm.subDomain || "@"}.{zoneName} → {deleteConfirm.target}
              </div>
            </div>
            <div className="zone-modal-footer">
              <button className="zone-btn-secondary" onClick={() => setDeleteConfirm(null)}>{tCommon("actions.cancel")}</button>
              <button className="zone-btn-danger" onClick={handleDeleteConfirm} disabled={deleting}>{deleting ? tCommon("loading") : tCommon("actions.delete")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ZoneTab;
