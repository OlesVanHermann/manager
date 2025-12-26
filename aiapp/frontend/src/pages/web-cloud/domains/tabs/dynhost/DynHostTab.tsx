// ============================================================
import "./DynHostTab.css";
// TAB: DYNHOST - CRUD enregistrements + Logins
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { dynHostService } from "./DynHostTab.service";
import type { DynHostRecord, DynHostLogin } from "../../domains.types";

interface Props {
  zoneName: string;
}

interface DynHostForm {
  id?: number;
  subDomain: string;
  ip: string;
}

interface LoginForm {
  loginSuffix: string;
  password: string;
  subDomain: string;
}

const DEFAULT_FORM: DynHostForm = { subDomain: "", ip: "" };
const DEFAULT_LOGIN_FORM: LoginForm = { loginSuffix: "", password: "", subDomain: "" };

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

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

// ============ COMPOSANT PRINCIPAL ============

export function DynHostTab({ zoneName }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- VIEW STATE ----------
  const [activeView, setActiveView] = useState<"records" | "logins">("records");

  // ---------- RECORDS STATE ----------
  const [records, setRecords] = useState<DynHostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- LOGINS STATE ----------
  const [logins, setLogins] = useState<DynHostLogin[]>([]);
  const [loginsLoading, setLoginsLoading] = useState(false);

  // ---------- RECORD MODAL STATE ----------
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState<DynHostForm>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ---------- LOGIN MODAL STATE ----------
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>(DEFAULT_LOGIN_FORM);
  const [savingLogin, setSavingLogin] = useState(false);
  const [loginFormError, setLoginFormError] = useState<string | null>(null);

  // ---------- DELETE STATE ----------
  const [deleteConfirm, setDeleteConfirm] = useState<DynHostRecord | null>(null);
  const [deleteLoginConfirm, setDeleteLoginConfirm] = useState<DynHostLogin | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ---------- LOAD RECORDS ----------
  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ids = await dynHostService.listDynHostRecords(zoneName);
      if (ids.length === 0) {
        setRecords([]);
        return;
      }
      const details = await Promise.all(ids.map((id) => dynHostService.getDynHostRecord(zoneName, id)));
      setRecords(details);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [zoneName]);

  // ---------- LOAD LOGINS ----------
  const loadLogins = useCallback(async () => {
    try {
      setLoginsLoading(true);
      const loginNames = await dynHostService.listDynHostLogins(zoneName);
      if (loginNames.length === 0) {
        setLogins([]);
        return;
      }
      const details = await Promise.all(loginNames.map((login) => dynHostService.getDynHostLogin(zoneName, login)));
      setLogins(details);
    } catch (err) {
      console.error("Failed to load logins:", err);
      setLogins([]);
    } finally {
      setLoginsLoading(false);
    }
  }, [zoneName]);

  useEffect(() => {
    loadRecords();
    loadLogins();
  }, [loadRecords, loadLogins]);

  // ---------- RECORD MODAL HANDLERS ----------
  const openCreateModal = () => {
    setFormData(DEFAULT_FORM);
    setFormError(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEditModal = (record: DynHostRecord) => {
    setFormData({ id: record.id, subDomain: record.subDomain, ip: record.ip });
    setFormError(null);
    setModalMode("edit");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError(null);
  };

  const handleFormChange = (field: keyof DynHostForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  // ---------- SAVE RECORD ----------
  const handleSave = async () => {
    if (!formData.ip.trim()) {
      setFormError(t("dynhost.errorIpRequired"));
      return;
    }
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(formData.ip.trim())) {
      setFormError(t("dynhost.errorInvalidIp"));
      return;
    }
    try {
      setSaving(true);
      setFormError(null);
      if (modalMode === "create") {
        await dynHostService.createDynHostRecord(zoneName, { subDomain: formData.subDomain, ip: formData.ip.trim() });
      } else if (formData.id) {
        await dynHostService.updateDynHostRecord(zoneName, formData.id, { ip: formData.ip.trim() });
      }
      closeModal();
      await loadRecords();
    } catch (err) {
      setFormError(String(err));
    } finally {
      setSaving(false);
    }
  };

  // ---------- DELETE RECORD ----------
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      setDeleting(true);
      await dynHostService.deleteDynHostRecord(zoneName, deleteConfirm.id);
      setDeleteConfirm(null);
      await loadRecords();
    } catch (err) {
      setError(String(err));
    } finally {
      setDeleting(false);
    }
  };

  // ---------- LOGIN MODAL HANDLERS ----------
  const openLoginModal = () => {
    setLoginForm(DEFAULT_LOGIN_FORM);
    setLoginFormError(null);
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
    setLoginFormError(null);
  };

  const handleLoginFormChange = (field: keyof LoginForm, value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
    setLoginFormError(null);
  };

  // ---------- SAVE LOGIN ----------
  const handleSaveLogin = async () => {
    if (!loginForm.loginSuffix.trim() || !loginForm.password.trim()) {
      setLoginFormError(t("dynhost.errorLoginRequired"));
      return;
    }
    try {
      setSavingLogin(true);
      setLoginFormError(null);
      await dynHostService.createDynHostLogin(zoneName, {
        loginSuffix: loginForm.loginSuffix.trim(),
        password: loginForm.password,
        subDomain: loginForm.subDomain.trim(),
      });
      closeLoginModal();
      await loadLogins();
    } catch (err) {
      setLoginFormError(String(err));
    } finally {
      setSavingLogin(false);
    }
  };

  // ---------- DELETE LOGIN ----------
  const handleDeleteLoginConfirm = async () => {
    if (!deleteLoginConfirm) return;
    try {
      setDeleting(true);
      await dynHostService.deleteDynHostLogin(zoneName, deleteLoginConfirm.login);
      setDeleteLoginConfirm(null);
      await loadLogins();
    } catch (err) {
      setError(String(err));
    } finally {
      setDeleting(false);
    }
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="dynhost-loading">
        <div className="dynhost-skeleton" />
        <div className="dynhost-skeleton" />
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="dynhost-tab">
      {/* Header with view toggle */}
      <div className="dynhost-header">
        <div>
          <h3>{t("dynhost.title")}</h3>
          <p className="dynhost-description">{t("dynhost.description")}</p>
        </div>
        <div className="tab-header-actions">
          <div className="view-toggle">
            <button className={`toggle-btn ${activeView === "records" ? "active" : ""}`} onClick={() => setActiveView("records")}>
              {t("dynhost.records")}
            </button>
            <button className={`toggle-btn ${activeView === "logins" ? "active" : ""}`} onClick={() => setActiveView("logins")}>
              <UserIcon /> {t("dynhost.logins")}
            </button>
          </div>
          {activeView === "records" ? (
            <button className="btn-primary" onClick={openCreateModal}><PlusIcon /> {t("dynhost.add")}</button>
          ) : (
            <button className="btn-primary" onClick={openLoginModal}><PlusIcon /> {t("dynhost.addLogin")}</button>
          )}
        </div>
      </div>

      {error && <div className="dynhost-error-banner">{error}</div>}

      {/* RECORDS VIEW */}
      {activeView === "records" && (
        <>
          {records.length === 0 ? (
            <div className="dynhost-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
              </svg>
              <h3>{t("dynhost.empty")}</h3>
              <p className="dynhost-hint">{t("dynhost.emptyHint")}</p>
              <button className="btn-primary" onClick={openCreateModal}><PlusIcon /> {t("dynhost.add")}</button>
            </div>
          ) : (
            <div className="dynhost-cards">
              {records.map((record) => (
                <div key={record.id} className="dynhost-card">
                  <div className="dynhost-header">
                    <h4>{record.subDomain || "@"}.{zoneName}</h4>
                    <div className="dynhost-card-actions">
                      <button className="dynhost-btn-icon" onClick={() => openEditModal(record)} title={t("dynhost.edit")}><EditIcon /></button>
                      <button className="btn-icon btn-icon-danger" onClick={() => setDeleteConfirm(record)} title={t("dynhost.delete")}><TrashIcon /></button>
                    </div>
                  </div>
                  <div className="dynhost-info">
                    <label>{t("dynhost.ip")}:</label>
                    <span>{record.ip}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* LOGINS VIEW */}
      {activeView === "logins" && (
        <>
          {loginsLoading ? (
            <div className="dynhost-loading"><div className="dynhost-skeleton" /></div>
          ) : logins.length === 0 ? (
            <div className="dynhost-empty">
              <UserIcon />
              <h3>{t("dynhost.noLogins")}</h3>
              <p className="dynhost-hint">{t("dynhost.loginsHint")}</p>
              <button className="btn-primary" onClick={openLoginModal}><PlusIcon /> {t("dynhost.addLogin")}</button>
            </div>
          ) : (
            <div className="dynhost-cards">
              {logins.map((login) => (
                <div key={login.login} className="dynhost-card">
                  <div className="dynhost-header">
                    <h4><UserIcon /> {login.login}</h4>
                    <div className="dynhost-card-actions">
                      <button className="btn-icon btn-icon-danger" onClick={() => setDeleteLoginConfirm(login)} title={t("dynhost.delete")}><TrashIcon /></button>
                    </div>
                  </div>
                  <div className="dynhost-info">
                    <label>{t("dynhost.subdomain")}:</label>
                    <span>{login.subDomain || "*"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Info box */}
      <div className="dynhost-info-box">
        <h4>{t("dynhost.info")}</h4>
        <p>{t("dynhost.infoDesc")}</p>
      </div>

      {/* Record Modal */}
      {modalOpen && (
        <div className="dynhost-modal-overlay" onClick={closeModal}>
          <div className="dynhost-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="dynhost-modal-header">
              <h3>{modalMode === "create" ? t("dynhost.modalTitleCreate") : t("dynhost.modalTitleEdit")}</h3>
              <button className="dynhost-btn-icon" onClick={closeModal}><CloseIcon /></button>
            </div>
            <div className="dynhost-modal-body">
              {formError && <div className="dynhost-form-error">{formError}</div>}
              <div className="dynhost-form-group">
                <label>{t("dynhost.subdomain")}</label>
                <div className="input-with-suffix">
                  <input type="text" value={formData.subDomain} onChange={(e) => handleFormChange("subDomain", e.target.value)} placeholder="home" className="dynhost-input" disabled={modalMode === "edit"} />
                  <span className="input-suffix">.{zoneName}</span>
                </div>
              </div>
              <div className="dynhost-form-group">
                <label>{t("dynhost.ip")} *</label>
                <input type="text" value={formData.ip} onChange={(e) => handleFormChange("ip", e.target.value)} placeholder="192.168.1.1" className="dynhost-input" required />
              </div>
            </div>
            <div className="dynhost-modal-footer">
              <button className="btn-secondary" onClick={closeModal}>{tCommon("actions.cancel")}</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? tCommon("loading") : tCommon("actions.save")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {loginModalOpen && (
        <div className="dynhost-modal-overlay" onClick={closeLoginModal}>
          <div className="dynhost-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="dynhost-modal-header">
              <h3>{t("dynhost.addLogin")}</h3>
              <button className="dynhost-btn-icon" onClick={closeLoginModal}><CloseIcon /></button>
            </div>
            <div className="dynhost-modal-body">
              {loginFormError && <div className="dynhost-form-error">{loginFormError}</div>}
              <div className="dynhost-form-group">
                <label>{t("dynhost.loginSuffix")} *</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">{zoneName}-</span>
                  <input type="text" value={loginForm.loginSuffix} onChange={(e) => handleLoginFormChange("loginSuffix", e.target.value)} placeholder="user1" className="dynhost-input" />
                </div>
              </div>
              <div className="dynhost-form-group">
                <label>{t("dynhost.password")} *</label>
                <input type="password" value={loginForm.password} onChange={(e) => handleLoginFormChange("password", e.target.value)} className="dynhost-input" />
              </div>
              <div className="dynhost-form-group">
                <label>{t("dynhost.subdomain")}</label>
                <input type="text" value={loginForm.subDomain} onChange={(e) => handleLoginFormChange("subDomain", e.target.value)} placeholder="* (tous)" className="dynhost-input" />
                <small className="form-hint">{t("dynhost.subdomainLoginHint")}</small>
              </div>
            </div>
            <div className="dynhost-modal-footer">
              <button className="btn-secondary" onClick={closeLoginModal}>{tCommon("actions.cancel")}</button>
              <button className="btn-primary" onClick={handleSaveLogin} disabled={savingLogin}>{savingLogin ? tCommon("loading") : tCommon("actions.save")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Record Confirm */}
      {deleteConfirm && (
        <div className="dynhost-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="dynhost-modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="dynhost-modal-header">
              <h3>{t("dynhost.confirmDeleteTitle")}</h3>
              <button className="dynhost-btn-icon" onClick={() => setDeleteConfirm(null)}><CloseIcon /></button>
            </div>
            <div className="dynhost-modal-body">
              <p>{t("dynhost.confirmDeleteMessage")}</p>
              <div className="delete-preview"><strong>{deleteConfirm.subDomain || "@"}.{zoneName}</strong> → {deleteConfirm.ip}</div>
            </div>
            <div className="dynhost-modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>{tCommon("actions.cancel")}</button>
              <button className="btn-danger" onClick={handleDeleteConfirm} disabled={deleting}>{deleting ? tCommon("loading") : tCommon("actions.delete")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Login Confirm */}
      {deleteLoginConfirm && (
        <div className="dynhost-modal-overlay" onClick={() => setDeleteLoginConfirm(null)}>
          <div className="dynhost-modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="dynhost-modal-header">
              <h3>{t("dynhost.confirmDeleteLoginTitle")}</h3>
              <button className="dynhost-btn-icon" onClick={() => setDeleteLoginConfirm(null)}><CloseIcon /></button>
            </div>
            <div className="dynhost-modal-body">
              <p>{t("dynhost.confirmDeleteLoginMessage")}</p>
              <div className="delete-preview"><strong>{deleteLoginConfirm.login}</strong></div>
            </div>
            <div className="dynhost-modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteLoginConfirm(null)}>{tCommon("actions.cancel")}</button>
              <button className="btn-danger" onClick={handleDeleteLoginConfirm} disabled={deleting}>{deleting ? tCommon("loading") : tCommon("actions.delete")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DynHostTab;
