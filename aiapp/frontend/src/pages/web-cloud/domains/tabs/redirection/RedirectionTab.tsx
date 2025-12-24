// ============================================================
import "./RedirectionTab.css";
// TAB: REDIRECTIONS - CRUD complet des redirections web
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { redirectionService } from "./RedirectionTab";
import type { Redirection, RedirectionCreate } from "../../domains.types";

interface Props {
  domain: string;
  nameServerType?: "hosted" | "external";
}

interface RedirectionForm {
  id?: number;
  subDomain: string;
  target: string;
  type: 'visible' | 'visiblePermanent' | 'invisible';
  title: string;
  keywords: string;
  description: string;
}

const REDIRECTION_TYPES = [
  { value: 'visiblePermanent', labelKey: 'typePermanent' },
  { value: 'visible', labelKey: 'typeVisible' },
  { value: 'invisible', labelKey: 'typeInvisible' },
] as const;

const DEFAULT_FORM: RedirectionForm = { subDomain: '', target: '', type: 'visiblePermanent', title: '', keywords: '', description: '' };

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

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// ============ COMPOSANT PRINCIPAL ============

export function RedirectionTab({ domain, nameServerType }: Props) {
  const { t } = useTranslation("web-cloud/domains/redirection");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [redirections, setRedirections] = useState<Redirection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notSupported, setNotSupported] = useState(false);
  const [notSupportedReason, setNotSupportedReason] = useState<"external" | "api" | null>(null);

  // ---------- MODAL STATE ----------
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<RedirectionForm>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ---------- DELETE STATE ----------
  const [deleteConfirm, setDeleteConfirm] = useState<Redirection | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ---------- CHECK IF SUPPORTED ----------
  const isExternalDns = nameServerType === "external";

  // ---------- LOAD DATA ----------
  const loadRedirections = useCallback(async () => {
    // Si DNS externes, pas de redirections possibles
    if (isExternalDns) {
      setNotSupported(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Si DNS externes, marquer comme non supporté
      if (isExternalDns) {
        setNotSupported(true);
        setNotSupportedReason("external");
        setRedirections([]);
        return;
      }
      setNotSupported(false);
      setNotSupportedReason(null);
      const ids = await redirectionService.listRedirections(domain);
      if (ids.length === 0) {
        setRedirections([]);
        return;
      }
      const details = await Promise.all(ids.map((id) => redirectionService.getRedirection(domain, id)));
      setRedirections(details);
    } catch (err) {
      const errMsg = String(err);
      if (errMsg.includes("invalid") || errMsg.includes("empty") || errMsg.includes("URL") || errMsg.includes("404") || errMsg.includes("not found")) {
        setNotSupported(true);
        setNotSupportedReason("api");
        setRedirections([]);
        setError(null);
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [domain, isExternalDns]);

  useEffect(() => {
    loadRedirections();
  }, [loadRedirections]);

  // ---------- MODAL HANDLERS ----------
  const openCreateModal = () => {
    setFormData(DEFAULT_FORM);
    setFormError(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (redir: Redirection) => {
    setFormData({
      id: redir.id,
      subDomain: redir.subDomain,
      target: redir.target,
      type: redir.type,
      title: redir.title || '',
      keywords: redir.keywords || '',
      description: redir.description || '',
    });
    setFormError(null);
    setModalMode('edit');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError(null);
  };

  const handleFormChange = (field: keyof RedirectionForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  // ---------- SAVE ----------
  const handleSave = async () => {
    if (!formData.target.trim()) {
      setFormError(t("errorTargetRequired"));
      return;
    }
    // Validation URL basique
    if (!formData.target.startsWith("http://") && !formData.target.startsWith("https://")) {
      setFormError(t("errorInvalidUrl"));
      return;
    }
    try {
      setSaving(true);
      setFormError(null);
      if (modalMode === 'create') {
        const payload: RedirectionCreate = {
          subDomain: formData.subDomain,
          target: formData.target,
          type: formData.type,
        };
        if (formData.type === 'invisible') {
          if (formData.title) payload.title = formData.title;
          if (formData.keywords) payload.keywords = formData.keywords;
          if (formData.description) payload.description = formData.description;
        }
        await redirectionService.createRedirection(domain, payload);
      } else if (formData.id) {
        await redirectionService.updateRedirection(domain, formData.id, {
          target: formData.target,
          title: formData.title || undefined,
          keywords: formData.keywords || undefined,
          description: formData.description || undefined,
        });
      }
      await redirectionService.refreshZone(domain);
      closeModal();
      await loadRedirections();
    } catch (err) {
      setFormError(String(err));
    } finally {
      setSaving(false);
    }
  };

  // ---------- DELETE ----------
  const handleDeleteClick = (redir: Redirection) => {
    setDeleteConfirm(redir);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      setDeleting(true);
      await redirectionService.deleteRedirection(domain, deleteConfirm.id);
      await redirectionService.refreshZone(domain);
      setDeleteConfirm(null);
      await loadRedirections();
    } catch (err) {
      setError(String(err));
    } finally {
      setDeleting(false);
    }
  };

  // ---------- HELPERS ----------
  const getTypeLabel = (type: string) => {
    const found = REDIRECTION_TYPES.find((rt) => rt.value === type);
    return found ? t(found.labelKey) : type;
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'visiblePermanent': return 'type-permanent';
      case 'visible': return 'type-visible';
      case 'invisible': return 'type-invisible';
      default: return '';
    }
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  // ---------- RENDER NOT SUPPORTED ----------
  if (notSupported) {
    return (
      <div className="redirections-tab">
        <div className="tab-header">
          <div>
            <h3>{t("title")}</h3>
            <p className="tab-description">{t("description")}</p>
          </div>
        </div>

        <div className="not-supported-banner">
          <AlertIcon />
          <div className="not-supported-content">
            <h4>{notSupportedReason === "external" ? t("notSupportedTitle") : t("notSupportedApiTitle")}</h4>
            <p>{notSupportedReason === "external" ? t("notSupportedDesc") : t("notSupportedApiDesc")}</p>
          </div>
        </div>

        <div className="info-box">
          <h4>{t("info")}</h4>
          <p>{t("infoDesc")}</p>
        </div>
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="redirections-tab">
      {/* Header */}
      <div className="tab-header">
        <div>
          <h3>{t("title")}</h3>
          <p className="tab-description">{t("description")}</p>
        </div>
        <div className="tab-header-actions">
          <button className="btn-primary" onClick={openCreateModal}>
            <PlusIcon /> {t("add")}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="error-banner">{error}</div>}

      {/* Empty state */}
      {redirections.length === 0 && !error ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          <h3>{t("empty")}</h3>
          <p className="hint">{t("emptyHint")}</p>
          <button className="btn-primary" onClick={openCreateModal}>
            <PlusIcon /> {t("add")}
          </button>
        </div>
      ) : (
        /* Cards list */
        <div className="redirection-cards">
          {redirections.map((redir) => (
            <div key={redir.id} className="redirection-card">
              <div className="redirection-header">
                <span className={`redirection-type ${getTypeBadgeClass(redir.type)}`}>
                  {getTypeLabel(redir.type)}
                </span>
                <div className="card-actions">
                  <button className="btn-icon" onClick={() => openEditModal(redir)} title={t("edit")}>
                    <EditIcon />
                  </button>
                  <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteClick(redir)} title={t("delete")}>
                    <TrashIcon />
                  </button>
                </div>
              </div>
              <div className="redirection-flow">
                <span className="from">{redir.subDomain || "@"}.{domain}</span>
                <span className="arrow"><ArrowIcon /></span>
                <span className="to">{redir.target}</span>
              </div>
              {redir.title && <div className="redirection-meta"><strong>{t("metaTitle")}:</strong> {redir.title}</div>}
              {redir.keywords && <div className="redirection-meta"><strong>{t("metaKeywords")}:</strong> {redir.keywords}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="info-box">
        <h4>{t("info")}</h4>
        <p>{t("infoDesc")}</p>
      </div>

      {/* Modal Create/Edit */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalMode === 'create' ? t("modalTitleCreate") : t("modalTitleEdit")}</h3>
              <button className="btn-icon" onClick={closeModal}><CloseIcon /></button>
            </div>
            <div className="modal-body">
              {formError && <div className="form-error">{formError}</div>}
              <div className="form-group">
                <label>{t("type")}</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                  disabled={modalMode === 'edit'}
                  className="form-input"
                >
                  {REDIRECTION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{t(type.labelKey)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t("subdomain")}</label>
                <div className="input-with-suffix">
                  <input
                    type="text"
                    value={formData.subDomain}
                    onChange={(e) => handleFormChange('subDomain', e.target.value)}
                    placeholder="www"
                    className="form-input"
                    disabled={modalMode === 'edit'}
                  />
                  <span className="input-suffix">.{domain}</span>
                </div>
                <small className="form-hint">{t("subdomainHint")}</small>
              </div>
              <div className="form-group">
                <label>{t("target")} *</label>
                <input
                  type="text"
                  value={formData.target}
                  onChange={(e) => handleFormChange('target', e.target.value)}
                  placeholder="https://example.com"
                  className="form-input"
                  required
                />
              </div>
              {formData.type === 'invisible' && (
                <>
                  <div className="form-group">
                    <label>{t("metaTitle")}</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      placeholder={t("metaTitlePlaceholder")}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>{t("metaKeywords")}</label>
                    <input
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => handleFormChange('keywords', e.target.value)}
                      placeholder={t("metaKeywordsPlaceholder")}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>{t("metaDescription")}</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder={t("metaDescriptionPlaceholder")}
                      className="form-input form-textarea"
                      rows={3}
                    />
                  </div>
                </>
              )}
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
              <h3>{t("confirmDeleteTitle")}</h3>
              <button className="btn-icon" onClick={() => setDeleteConfirm(null)}><CloseIcon /></button>
            </div>
            <div className="modal-body">
              <p>{t("confirmDeleteMessage")}</p>
              <div className="delete-preview">
                <strong>{deleteConfirm.subDomain || "@"}.{domain}</strong> → {deleteConfirm.target}
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

export default RedirectionTab;
