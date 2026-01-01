// ============================================================
import "./GlueTab.css";
// TAB: GLUE RECORDS - CRUD complet des enregistrements Glue
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { glueService } from "./GlueTab.service";
import type { GlueRecord } from "../../domains.types";

interface Props {
  domain: string;
}

interface GlueForm {
  host: string;
  ipv4: string;
  ipv6: string;
  isEdit: boolean;
}

const DEFAULT_FORM: GlueForm = { host: '', ipv4: '', ipv6: '', isEdit: false };

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

export function GlueTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- DEBUG LOGGING ----------
  const logAction = (action: string, data?: Record<string, unknown>) => {
  };

  // ---------- STATE ----------
  const [records, setRecords] = useState<GlueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- MODAL STATE ----------
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<GlueForm>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ---------- DELETE STATE ----------
  const [deleteConfirm, setDeleteConfirm] = useState<GlueRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ---------- LOAD DATA ----------
  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const hosts = await glueService.listGlueRecords(domain);
      if (hosts.length === 0) {
        setRecords([]);
        return;
      }
      const details = await Promise.all(hosts.map((host) => glueService.getGlueRecord(domain, host)));
      setRecords(details);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // ---------- MODAL HANDLERS ----------
  const openCreateModal = () => {
    logAction("OPEN_CREATE_MODAL");
    setFormData(DEFAULT_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (record: GlueRecord) => {
    logAction("OPEN_EDIT_MODAL", { host: record.host });
    const ipv4 = record.ips.find(ip => ip.includes('.')) || '';
    const ipv6 = record.ips.find(ip => ip.includes(':')) || '';
    setFormData({
      host: record.host,
      ipv4,
      ipv6,
      isEdit: true,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    logAction("CLOSE_MODAL", { isEdit: formData.isEdit });
    setModalOpen(false);
    setFormError(null);
  };

  const handleFormChange = (field: keyof GlueForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  // ---------- SAVE ----------
  const handleSave = async () => {
    if (!formData.isEdit && !formData.host.trim()) {
      logAction("SAVE_ERROR_HOST_REQUIRED");
      setFormError(t("glue.errorHostRequired"));
      return;
    }
    if (!formData.ipv4.trim() && !formData.ipv6.trim()) {
      logAction("SAVE_ERROR_IP_REQUIRED");
      setFormError(t("glue.errorIpRequired"));
      return;
    }
    // Build IPs array
    const ips: string[] = [];
    if (formData.ipv4.trim()) ips.push(formData.ipv4.trim());
    if (formData.ipv6.trim()) ips.push(formData.ipv6.trim());

    logAction("SAVE_GLUE_START", { mode: formData.isEdit ? "edit" : "create", formData });
    try {
      setSaving(true);
      setFormError(null);
      if (formData.isEdit) {
        await glueService.updateGlueRecord(domain, formData.host, ips);
        logAction("UPDATE_GLUE_SUCCESS", { host: formData.host });
      } else {
        const fullHost = formData.host.includes('.') ? formData.host : `${formData.host}.${domain}`;
        await glueService.createGlueRecord(domain, { host: fullHost, ips });
        logAction("CREATE_GLUE_SUCCESS", { host: fullHost });
      }
      closeModal();
      await loadRecords();
    } catch (err) {
      logAction("SAVE_GLUE_ERROR", { error: String(err) });
      setFormError(String(err));
    } finally {
      setSaving(false);
    }
  };

  // ---------- DELETE ----------
  const handleDeleteClick = (record: GlueRecord) => {
    logAction("DELETE_GLUE_CLICK", { host: record.host });
    setDeleteConfirm(record);
  };

  const handleDeleteCancel = () => {
    logAction("DELETE_GLUE_CANCEL", { host: deleteConfirm?.host });
    setDeleteConfirm(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    logAction("DELETE_GLUE_CONFIRM", { host: deleteConfirm.host });
    try {
      setDeleting(true);
      await glueService.deleteGlueRecord(domain, deleteConfirm.host);
      logAction("DELETE_GLUE_SUCCESS", { host: deleteConfirm.host });
      setDeleteConfirm(null);
      await loadRecords();
    } catch (err) {
      logAction("DELETE_GLUE_ERROR", { host: deleteConfirm.host, error: String(err) });
      setError(String(err));
    } finally {
      setDeleting(false);
    }
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="glue-loading">
        <div className="glue-skeleton" />
        <div className="glue-skeleton" />
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="glue-tab">
      {/* Header */}
      <div className="glue-header">
        <div>
          <h3>{t("glue.title")}</h3>
          <p className="glue-description">{t("glue.description")}</p>
        </div>
        <div className="glue-header-actions">
          <button className="glue-btn-primary" onClick={openCreateModal}>
            <PlusIcon /> {t("glue.add")}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="glue-error-banner">{error}</div>}

      {/* Empty state */}
      {records.length === 0 && !error ? (
        <div className="glue-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
          </svg>
          <h3>{t("glue.empty")}</h3>
          <p className="glue-hint">{t("glue.emptyHint")}</p>
          <button className="glue-btn-primary" onClick={openCreateModal}>
            <PlusIcon /> {t("glue.add")}
          </button>
        </div>
      ) : (
        /* Cards list */
        <div className="glue-cards">
          {records.map((record) => (
            <div key={record.host} className="glue-card">
              <div className="glue-card-header">
                <h4>{record.host}</h4>
                <div className="glue-card-actions">
                  <button className="glue-btn-icon" onClick={() => openEditModal(record)} title={t("glue.edit")}>
                    <EditIcon />
                  </button>
                  <button className="glue-btn-icon danger" onClick={() => handleDeleteClick(record)} title={t("glue.delete")}>
                    <TrashIcon />
                  </button>
                </div>
              </div>
              <div className="glue-ips">
                {record.ips.map((ip, idx) => (
                  <div key={idx} className="glue-ip">
                    <label>{ip.includes(':') ? 'IPv6' : 'IPv4'}:</label>
                    <span>{ip}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="glue-info-box">
        <h4>{t("glue.info")}</h4>
        <p>{t("glue.infoDesc")}</p>
      </div>

      {/* Modal Create/Edit */}
      {modalOpen && (
        <div className="glue-modal-overlay" onClick={closeModal}>
          <div className="glue-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="glue-modal-header">
              <h3>{formData.isEdit ? t("glue.modalTitleEdit") : t("glue.modalTitleCreate")}</h3>
              <button className="glue-btn-icon" onClick={closeModal}><CloseIcon /></button>
            </div>
            <div className="glue-modal-body">
              {formError && <div className="glue-form-error">{formError}</div>}
              <div className="glue-form-group">
                <label>{t("glue.hostname")} *</label>
                <div className="glue-input-with-suffix">
                  <input
                    type="text"
                    value={formData.host.replace(`.${domain}`, '')}
                    onChange={(e) => handleFormChange('host', e.target.value)}
                    placeholder="ns1"
                    className="glue-input"
                    disabled={formData.isEdit}
                  />
                  <span className="glue-input-suffix">.{domain}</span>
                </div>
              </div>
              <div className="glue-form-group">
                <label>{t("glue.ipv4")}</label>
                <input
                  type="text"
                  value={formData.ipv4}
                  onChange={(e) => handleFormChange('ipv4', e.target.value)}
                  placeholder="192.0.2.1"
                  className="glue-input"
                />
              </div>
              <div className="glue-form-group">
                <label>{t("glue.ipv6")}</label>
                <input
                  type="text"
                  value={formData.ipv6}
                  onChange={(e) => handleFormChange('ipv6', e.target.value)}
                  placeholder="2001:db8::1"
                  className="glue-input"
                />
              </div>
              <small className="glue-form-hint">{t("glue.ipHint")}</small>
            </div>
            <div className="glue-modal-footer">
              <button className="glue-btn-secondary" onClick={closeModal}>{tCommon("actions.cancel")}</button>
              <button className="glue-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? tCommon("loading") : tCommon("actions.save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete Confirm */}
      {deleteConfirm && (
        <div className="glue-modal-overlay" onClick={handleDeleteCancel}>
          <div className="glue-modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="glue-modal-header">
              <h3>{t("glue.confirmDeleteTitle")}</h3>
              <button className="glue-btn-icon" onClick={handleDeleteCancel}><CloseIcon /></button>
            </div>
            <div className="glue-modal-body">
              <p>{t("glue.confirmDeleteMessage")}</p>
              <div className="glue-delete-preview">
                <strong>{deleteConfirm.host}</strong>
              </div>
            </div>
            <div className="glue-modal-footer">
              <button className="glue-btn-secondary" onClick={handleDeleteCancel}>{tCommon("actions.cancel")}</button>
              <button className="glue-btn-danger" onClick={handleDeleteConfirm} disabled={deleting}>
                {deleting ? tCommon("loading") : tCommon("actions.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GlueTab;
