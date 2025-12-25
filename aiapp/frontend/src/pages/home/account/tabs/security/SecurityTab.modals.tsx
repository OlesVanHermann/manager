// ============================================================
// SECURITY TAB MODALS - Modales ISOLÉES pour le tab sécurité
// ============================================================

import { useTranslation } from "react-i18next";
import type { ModalState } from "./SecurityTab.hooks";

// ============ TYPES ============

interface SecurityModalsProps {
  modal: ModalState;
  onClose: () => void;
  onSetFormData: (data: Record<string, string>) => void;
  onChangePassword: () => void;
  onAddSmsStep1: (phone: string) => void;
  onAddSmsStep2: (code: string) => void;
  onResendSmsCode: () => void;
  onDeleteSms: () => void;
  onAddTotp: (code?: string) => void;
  onDeleteTotp: () => void;
  onAddU2f: () => void;
  onDeleteU2f: () => void;
  onGenerateBackupCodes: () => void;
  onValidateBackupCodes: (code: string) => void;
  onDisable2fa: (code: string) => void;
  onAddIpRestriction: (ip: string, rule: "accept" | "deny", warning: boolean) => void;
}

// ============ COMPOSANT ============

export function SecurityModals({
  modal,
  onClose,
  onSetFormData,
  onChangePassword,
  onAddSmsStep1,
  onAddSmsStep2,
  onResendSmsCode,
  onDeleteSms,
  onAddTotp,
  onDeleteTotp,
  onAddU2f,
  onDeleteU2f,
  onGenerateBackupCodes,
  onValidateBackupCodes,
  onDisable2fa,
  onAddIpRestriction,
}: SecurityModalsProps) {
  const { t } = useTranslation("home/account/security");
  const { activeModal, modalLoading, modalError, modalSuccess, totpSecret, formData, smsStep } = modal;

  if (!activeModal) return null;

  const updateForm = (key: string, value: string) => onSetFormData({ ...formData, [key]: value });

  return (
    <div className="security-modal-overlay" onClick={onClose}>
      <div className="security-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="security-modal-close" onClick={onClose}>
          &times;
        </button>

        {/* PASSWORD MODAL */}
        {activeModal === "password" && (
          <>
            <h3>{t("modals.password.title")}</h3>
            <p>{t("modals.password.description")}</p>
            {modalError && <p className="security-modal-error">{modalError}</p>}
            {modalSuccess && <p className="security-modal-success">{t(`success.${modalSuccess}`)}</p>}
            <div className="security-modal-actions">
              <button className="security-btn security-btn-secondary" onClick={onClose}>
                {t("actions.close")}
              </button>
              {!modalSuccess && (
                <button className="security-btn security-btn-primary" onClick={onChangePassword} disabled={modalLoading}>
                  {modalLoading ? "..." : t("modals.password.sendButton")}
                </button>
              )}
            </div>
          </>
        )}

        {/* SMS MODAL */}
        {activeModal === "sms" && (
          <>
            <h3>{t("modals.sms.title")}</h3>
            {smsStep === "phone" ? (
              <>
                <p>{t("modals.sms.phoneDescription")}</p>
                <div className="security-form-group">
                  <label>{t("modals.sms.phoneLabel")}</label>
                  <input
                    type="tel"
                    placeholder="+33612345678"
                    value={formData.phone || ""}
                    onChange={(e) => updateForm("phone", e.target.value)}
                  />
                </div>
                {modalError && <p className="security-modal-error">{modalError}</p>}
                <div className="security-modal-actions">
                  <button className="security-btn security-btn-secondary" onClick={onClose}>
                    {t("actions.cancel")}
                  </button>
                  <button
                    className="security-btn security-btn-primary"
                    onClick={() => onAddSmsStep1(formData.phone || "")}
                    disabled={modalLoading || !formData.phone}
                  >
                    {modalLoading ? "..." : t("modals.sms.sendCode")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>{t("modals.sms.codeDescription", { phone: formData.phone })}</p>
                <div className="security-form-group">
                  <label>{t("modals.sms.codeLabel")}</label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={formData.code || ""}
                    onChange={(e) => updateForm("code", e.target.value)}
                  />
                </div>
                {modalError && <p className="security-modal-error">{modalError}</p>}
                {modalSuccess && <p className="security-modal-success">{t(`success.${modalSuccess}`)}</p>}
                <div className="security-modal-actions">
                  <button className="security-btn security-btn-secondary" onClick={onClose}>
                    {t("actions.cancel")}
                  </button>
                  <button className="security-btn security-btn-secondary" onClick={onResendSmsCode} disabled={modalLoading}>
                    {t("actions.resend")}
                  </button>
                  <button
                    className="security-btn security-btn-primary"
                    onClick={() => onAddSmsStep2(formData.code || "")}
                    disabled={modalLoading || !formData.code}
                  >
                    {modalLoading ? "..." : t("actions.validate")}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* DELETE SMS MODAL */}
        {activeModal === "deleteSms" && (
          <>
            <h3>{t("modals.deleteSms.title")}</h3>
            <p>{t("modals.deleteSms.description")}</p>
            {modalError && <p className="security-modal-error">{modalError}</p>}
            <div className="security-modal-actions">
              <button className="security-btn security-btn-secondary" onClick={onClose}>
                {t("actions.cancel")}
              </button>
              <button className="security-btn security-btn-danger" onClick={onDeleteSms} disabled={modalLoading}>
                {modalLoading ? "..." : t("actions.delete")}
              </button>
            </div>
          </>
        )}

        {/* TOTP MODAL */}
        {activeModal === "totp" && (
          <>
            <h3>{t("modals.totp.title")}</h3>
            {!totpSecret ? (
              <>
                <p>{t("modals.totp.generateDescription")}</p>
                {modalError && <p className="security-modal-error">{modalError}</p>}
                <div className="security-modal-actions">
                  <button className="security-btn security-btn-secondary" onClick={onClose}>
                    {t("actions.cancel")}
                  </button>
                  <button className="security-btn security-btn-primary" onClick={() => onAddTotp()} disabled={modalLoading}>
                    {modalLoading ? "..." : t("modals.totp.generateButton")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="security-totp-setup">
                  <p>{t("modals.totp.scanDescription")}</p>
                  {totpSecret.qrCode && (
                    <img src={totpSecret.qrCode} alt="QR Code TOTP" className="security-totp-qr" />
                  )}
                  <p className="security-totp-secret">
                    {t("modals.totp.manualEntry")}: <code>{totpSecret.secret}</code>
                  </p>
                </div>
                <div className="security-form-group">
                  <label>{t("modals.totp.codeLabel")}</label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={formData.code || ""}
                    onChange={(e) => updateForm("code", e.target.value)}
                  />
                </div>
                {modalError && <p className="security-modal-error">{modalError}</p>}
                <div className="security-modal-actions">
                  <button className="security-btn security-btn-secondary" onClick={onClose}>
                    {t("actions.cancel")}
                  </button>
                  <button
                    className="security-btn security-btn-primary"
                    onClick={() => onAddTotp(formData.code)}
                    disabled={modalLoading || !formData.code}
                  >
                    {modalLoading ? "..." : t("actions.validate")}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* DELETE TOTP MODAL */}
        {activeModal === "deleteTotp" && (
          <>
            <h3>{t("modals.deleteTotp.title")}</h3>
            <p>{t("modals.deleteTotp.description")}</p>
            {modalError && <p className="security-modal-error">{modalError}</p>}
            <div className="security-modal-actions">
              <button className="security-btn security-btn-secondary" onClick={onClose}>
                {t("actions.cancel")}
              </button>
              <button className="security-btn security-btn-danger" onClick={onDeleteTotp} disabled={modalLoading}>
                {modalLoading ? "..." : t("actions.delete")}
              </button>
            </div>
          </>
        )}

        {/* U2F MODAL */}
        {activeModal === "u2f" && (
          <>
            <h3>{t("modals.u2f.title")}</h3>
            <p>{t("modals.u2f.description")}</p>
            {modalError && <p className="security-modal-error">{modalError}</p>}
            {modalSuccess && <p className="security-modal-success">{t(`success.${modalSuccess}`)}</p>}
            <div className="security-modal-actions">
              <button className="security-btn security-btn-secondary" onClick={onClose}>
                {t("actions.close")}
              </button>
              <button className="security-btn security-btn-primary" onClick={onAddU2f} disabled={modalLoading}>
                {modalLoading ? "..." : t("modals.u2f.addButton")}
              </button>
            </div>
          </>
        )}

        {/* DELETE U2F MODAL */}
        {activeModal === "deleteU2f" && (
          <>
            <h3>{t("modals.deleteU2f.title")}</h3>
            <p>{t("modals.deleteU2f.description")}</p>
            {modalError && <p className="security-modal-error">{modalError}</p>}
            <div className="security-modal-actions">
              <button className="security-btn security-btn-secondary" onClick={onClose}>
                {t("actions.cancel")}
              </button>
              <button className="security-btn security-btn-danger" onClick={onDeleteU2f} disabled={modalLoading}>
                {modalLoading ? "..." : t("actions.delete")}
              </button>
            </div>
          </>
        )}

        {/* BACKUP CODES MODAL */}
        {activeModal === "backup" && (
          <>
            <h3>{t("modals.backup.title")}</h3>
            {!formData.codes ? (
              <>
                <p>{t("modals.backup.generateDescription")}</p>
                {modalError && <p className="security-modal-error">{modalError}</p>}
                <div className="security-modal-actions">
                  <button className="security-btn security-btn-secondary" onClick={onClose}>
                    {t("actions.cancel")}
                  </button>
                  <button className="security-btn security-btn-primary" onClick={onGenerateBackupCodes} disabled={modalLoading}>
                    {modalLoading ? "..." : t("modals.backup.generateButton")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="security-backup-codes">
                  <p>
                    <strong>{t("modals.backup.saveWarning")}</strong>
                  </p>
                  <pre>{formData.codes}</pre>
                </div>
                <div className="security-form-group">
                  <label>{t("modals.backup.validateLabel")}</label>
                  <input
                    type="text"
                    placeholder="Code"
                    value={formData.code || ""}
                    onChange={(e) => updateForm("code", e.target.value)}
                  />
                </div>
                {modalError && <p className="security-modal-error">{modalError}</p>}
                <div className="security-modal-actions">
                  <button className="security-btn security-btn-secondary" onClick={onClose}>
                    {t("actions.cancel")}
                  </button>
                  <button
                    className="security-btn security-btn-primary"
                    onClick={() => onValidateBackupCodes(formData.code || "")}
                    disabled={modalLoading || !formData.code}
                  >
                    {modalLoading ? "..." : t("actions.validate")}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* DISABLE 2FA MODAL */}
        {activeModal === "disable2fa" && (
          <>
            <h3>{t("modals.disable2fa.title")}</h3>
            <p className="security-warning-text">{t("modals.disable2fa.warning")}</p>
            <div className="security-form-group">
              <label>{t("modals.disable2fa.codeLabel")}</label>
              <input
                type="text"
                placeholder={t("modals.disable2fa.codePlaceholder")}
                value={formData.code || ""}
                onChange={(e) => updateForm("code", e.target.value)}
              />
            </div>
            {modalError && <p className="security-modal-error">{modalError}</p>}
            <div className="security-modal-actions">
              <button className="security-btn security-btn-secondary" onClick={onClose}>
                {t("actions.cancel")}
              </button>
              <button
                className="security-btn security-btn-danger"
                onClick={() => onDisable2fa(formData.code || "")}
                disabled={modalLoading || !formData.code}
              >
                {modalLoading ? "..." : t("modals.disable2fa.disableButton")}
              </button>
            </div>
          </>
        )}

        {/* IP RESTRICTION MODAL */}
        {activeModal === "ip" && (
          <>
            <h3>{t("modals.ip.title")}</h3>
            <div className="security-form-group">
              <label>{t("modals.ip.ipLabel")}</label>
              <input
                type="text"
                placeholder="192.168.1.0/24"
                value={formData.ip || ""}
                onChange={(e) => updateForm("ip", e.target.value)}
              />
            </div>
            <div className="security-form-group">
              <label>{t("modals.ip.ruleLabel")}</label>
              <select value={formData.rule || "accept"} onChange={(e) => updateForm("rule", e.target.value)}>
                <option value="accept">{t("ipRestrictions.allow")}</option>
                <option value="deny">{t("ipRestrictions.deny")}</option>
              </select>
            </div>
            <div className="security-form-group">
              <label className="security-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.warning === "true"}
                  onChange={(e) => updateForm("warning", e.target.checked ? "true" : "false")}
                />
                {t("modals.ip.warningLabel")}
              </label>
            </div>
            {modalError && <p className="security-modal-error">{modalError}</p>}
            <div className="security-modal-actions">
              <button className="security-btn security-btn-secondary" onClick={onClose}>
                {t("actions.cancel")}
              </button>
              <button
                className="security-btn security-btn-primary"
                onClick={() =>
                  onAddIpRestriction(formData.ip || "", (formData.rule || "accept") as "accept" | "deny", formData.warning === "true")
                }
                disabled={modalLoading || !formData.ip}
              >
                {modalLoading ? "..." : t("actions.add")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
