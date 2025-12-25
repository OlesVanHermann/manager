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
    setFormData(DEFAULT_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (record: GlueRecord) => {
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
      setFormError(t("glue.errorHostRequired"));
      return;
    }
    if (!formData.ipv4.trim() && !formData.ipv6.trim()) {
      setFormError(t("glue.errorIpRequired"));
      return;
    }
    // Build IPs array
    const ips: string[] = [];
    if (formData.ipv4.trim()) ips.push(formData.ipv4.trim());
    if (formData.ipv6.trim()) ips.push(formData.ipv6.trim());

    try {
      setSaving(true);
      setFormError(null);
      if (formData.isEdit) {
        await glueService.updateGlueRecord(domain, formData.host, ips);
      } else {
        const fullHost = formData.host.includes('.') ? formData.host : `${formData.host}.${domain}`;
        await glueService.createGlueRecord(domain, { host: fullHost, ips });
      }
      closeModal();
      await loadRecords();
    } catch (err) {
      setFormError(String(err));
    } finally {
      setSaving(false);
    }
  };

  // ---------- DELETE ----------
  const handleDeleteClick = (record: GlueRecord) => {
    setDeleteConfirm(record);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      setDeleting(true);
      await glueService.deleteGlueRecord(domain, deleteConfirm.host);
      setDeleteConfirm(null);
      await loadRecords();
    } catch (err) {
      setError(String(err));
    } finally {
      setDeleting(false);
    }
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="glue-tab">
      {/* Header */}
      <div className="tab-header">
        <div>
          <h3>{t("glue.title")}</h3>
          <p className="tab-description">{t("glue.description")}</p>
        </div>
        <div className="tab-header-actions">
          <button className="btn-primary" onClick={openCreateModal}>
            <PlusIcon /> {t("glue.add")}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="error-banner">{error}</div>}

      {/* Empty state */}
      {records.length === 0 && !error ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
          </svg>
          <h3>{t("glue.empty")}</h3>
          <p className="hint">{t("glue.emptyHint")}</p>
          <button className="btn-primary" onClick={openCreateModal}>
            <PlusIcon /> {t("glue.add")}
          </button>
        </div>
      ) : (
        /* Cards list */
        <div className="glue-cards">
          {records.map((record) => (
            <div key={record.host} className="glue-card">
              <div className="glue-header">
                <h4>{record.host}</h4>
                <div className="card-actions">
                  <button className="btn-icon" onClick={() => openEditModal(record)} title={t("glue.edit")}>
                    <EditIcon />
                  </button>
                  <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteClick(record)} title={t("glue.delete")}>
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
      <div className="info-box">
        <h4>{t("glue.info")}</h4>
        <p>{t("glue.infoDesc")}</p>
      </div>

      {/* Modal Create/Edit */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{formData.isEdit ? t("glue.modalTitleEdit") : t("glue.modalTitleCreate")}</h3>
              <button className="btn-icon" onClick={closeModal}><CloseIcon /></button>
            </div>
            <div className="modal-body">
              {formError && <div className="form-error">{formError}</div>}
              <div className="form-group">
                <label>{t("glue.hostname")} *</label>
                <div className="input-with-suffix">
                  <input
                    type="text"
                    value={formData.host.replace(`.${domain}`, '')}
                    onChange={(e) => handleFormChange('host', e.target.value)}
                    placeholder="ns1"
                    className="form-input"
                    disabled={formData.isEdit}
                  />
                  <span className="input-suffix">.{domain}</span>
                </div>
              </div>
              <div className="form-group">
                <label>{t("glue.ipv4")}</label>
                <input
                  type="text"
                  value={formData.ipv4}
                  onChange={(e) => handleFormChange('ipv4', e.target.value)}
                  placeholder="192.0.2.1"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>{t("glue.ipv6")}</label>
                <input
                  type="text"
                  value={formData.ipv6}
                  onChange={(e) => handleFormChange('ipv6', e.target.value)}
                  placeholder="2001:db8::1"
                  className="form-input"
                />
              </div>
              <small className="form-hint">{t("glue.ipHint")}</small>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>{tCommon("actions.cancel")}</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? tCommon("loading") : tCommon("actions.save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t("glue.confirmDeleteTitle")}</h3>
              <button className="btn-icon" onClick={() => setDeleteConfirm(null)}><CloseIcon /></button>
            </div>
            <div className="modal-body">
              <p>{t("glue.confirmDeleteMessage")}</p>
              <div className="delete-preview">
                <strong>{deleteConfirm.host}</strong>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>{tCommon("actions.cancel")}</button>
              <button className="btn-danger" onClick={handleDeleteConfirm} disabled={deleting}>
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
