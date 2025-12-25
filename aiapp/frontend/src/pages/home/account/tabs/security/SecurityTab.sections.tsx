// ============================================================
// SECURITY TAB SECTIONS - Sous-composants ISOLÉS
// ============================================================

import { useTranslation } from "react-i18next";
import { IconPassword, IconSms, IconTotp, IconKey, IconBackup, IconNetwork, IconCheck } from "./SecurityTab.icons";
import type { ModalType } from "./SecurityTab.hooks";
import type * as securityService from "./SecurityTab.service";

// ============ HELPERS LOCAUX ============

const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR");

// ============ PASSWORD SECTION ============

interface PasswordSectionProps {
  onOpenModal: (type: ModalType) => void;
}

export function PasswordSection({ onOpenModal }: PasswordSectionProps) {
  const { t } = useTranslation("home/account/security");

  return (
    <div className="security-box">
      <div className="security-box-row">
        <div className="security-box-icon">
          <IconPassword />
        </div>
        <div className="security-box-content">
          <h3>{t("password.title")}</h3>
          <p>{t("password.description")}</p>
        </div>
        <div className="security-box-action">
          <button className="security-btn security-btn-primary" onClick={() => onOpenModal("password")}>
            {t("password.changeButton")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ TWO FACTOR SECTION ============

interface TwoFactorSectionProps {
  status: securityService.TwoFactorStatus | null;
  onOpenModal: (type: ModalType, targetId?: number) => void;
}

export function TwoFactorSection({ status, onOpenModal }: TwoFactorSectionProps) {
  const { t } = useTranslation("home/account/security");

  const isEnabled = status?.sms?.status === "enabled" || 
                    status?.totp?.status === "enabled" || 
                    status?.u2f?.status === "enabled";

  return (
    <div className="security-box">
      <div className="security-box-header">
        <div className="security-box-header-left">
          <h3>{t("twoFactor.title")}</h3>
          <p>{t("twoFactor.description")}</p>
        </div>
        {isEnabled && (
          <span className="security-badge security-badge-success">{t("twoFactor.enabled")}</span>
        )}
      </div>

      <div className="security-2fa-grid">
        {/* SMS */}
        <div className="security-2fa-card">
          <div className="security-2fa-card-header">
            <div className="security-2fa-card-icon">
              <IconSms />
            </div>
            <div className="security-2fa-card-title">
              <h4>
                {status?.sms?.status === "enabled" && <IconCheck />}
                {t("twoFactor.sms.title")}
              </h4>
              <p>{t("twoFactor.sms.description")}</p>
            </div>
          </div>
          {status?.sms?.phone && (
            <div className="security-2fa-card-content">
              <span className="security-phone">{status.sms.phone}</span>
            </div>
          )}
          <div className="security-2fa-card-footer">
            <button className="security-btn security-btn-secondary security-btn-sm" onClick={() => onOpenModal("sms")}>
              {t("twoFactor.sms.addButton")}
            </button>
            {status?.sms?.status === "enabled" && (
              <button className="security-btn security-btn-danger security-btn-sm" onClick={() => onOpenModal("deleteSms")}>
                {t("actions.delete")}
              </button>
            )}
          </div>
        </div>

        {/* TOTP */}
        <div className="security-2fa-card">
          <div className="security-2fa-card-header">
            <div className="security-2fa-card-icon">
              <IconTotp />
            </div>
            <div className="security-2fa-card-title">
              <h4>
                {status?.totp?.status === "enabled" && <IconCheck />}
                {t("twoFactor.totp.title")}
              </h4>
              <p>{t("twoFactor.totp.description")}</p>
            </div>
          </div>
          <div className="security-2fa-card-footer">
            <button className="security-btn security-btn-secondary security-btn-sm" onClick={() => onOpenModal("totp")}>
              {t("twoFactor.totp.configureButton")}
            </button>
            {status?.totp?.status === "enabled" && (
              <button className="security-btn security-btn-danger security-btn-sm" onClick={() => onOpenModal("deleteTotp")}>
                {t("actions.delete")}
              </button>
            )}
          </div>
        </div>

        {/* U2F */}
        <div className="security-2fa-card">
          <div className="security-2fa-card-header">
            <div className="security-2fa-card-icon">
              <IconKey />
            </div>
            <div className="security-2fa-card-title">
              <h4>
                {status?.u2f?.status === "enabled" && <IconCheck />}
                {t("twoFactor.u2f.title")}
              </h4>
              <p>{t("twoFactor.u2f.description")}</p>
            </div>
          </div>
          <div className="security-2fa-card-footer">
            <button className="security-btn security-btn-secondary security-btn-sm" onClick={() => onOpenModal("u2f")}>
              {t("twoFactor.u2f.addButton")}
            </button>
            {status?.u2f?.status === "enabled" && (
              <button className="security-btn security-btn-danger security-btn-sm" onClick={() => onOpenModal("deleteU2f")}>
                {t("actions.delete")}
              </button>
            )}
          </div>
        </div>

        {/* Backup Codes */}
        <div className="security-2fa-card">
          <div className="security-2fa-card-header">
            <div className="security-2fa-card-icon">
              <IconBackup />
            </div>
            <div className="security-2fa-card-title">
              <h4>
                {status?.backupCodes?.status === "enabled" && <IconCheck />}
                {t("twoFactor.backup.title")}
              </h4>
              <p>{t("twoFactor.backup.description")}</p>
            </div>
          </div>
          {status?.backupCodes && (
            <div className="security-2fa-card-content">
              <span className="security-backup-count">
                {t("twoFactor.backup.remaining", { count: status.backupCodes.remaining || 0 })}
              </span>
            </div>
          )}
          <div className="security-2fa-card-footer">
            <button className="security-btn security-btn-secondary security-btn-sm" onClick={() => onOpenModal("backup")}>
              {t("twoFactor.backup.regenerateButton")}
            </button>
          </div>
        </div>
      </div>

      {isEnabled && (
        <div className="security-2fa-disable">
          <button className="security-btn security-btn-danger" onClick={() => onOpenModal("disable2fa")}>
            {t("twoFactor.disableButton")}
          </button>
        </div>
      )}
    </div>
  );
}

// ============ IP RESTRICTIONS SECTION ============

interface IpRestrictionsSectionProps {
  ipRestrictions: securityService.IpRestriction[];
  ipDefaultRule: securityService.IpDefaultRule | null;
  onOpenModal: (type: ModalType) => void;
  onDeleteIp: (id: number) => void;
}

export function IpRestrictionsSection({
  ipRestrictions,
  ipDefaultRule,
  onOpenModal,
  onDeleteIp,
}: IpRestrictionsSectionProps) {
  const { t } = useTranslation("home/account/security");

  return (
    <div className="security-box">
      <div className="security-box-header">
        <div className="security-box-header-left">
          <div className="security-box-icon">
            <IconNetwork />
          </div>
          <div>
            <h3>{t("ipRestrictions.title")}</h3>
            <p>{t("ipRestrictions.description")}</p>
          </div>
        </div>
      </div>

      {ipDefaultRule && (
        <div className="security-ip-default">
          <span>{t("ipRestrictions.defaultRule")}: </span>
          <strong>{ipDefaultRule.rule === "accept" ? t("ipRestrictions.allow") : t("ipRestrictions.deny")}</strong>
          {ipDefaultRule.warning && (
            <span className="security-badge security-badge-info">{t("ipRestrictions.alertsEnabled")}</span>
          )}
        </div>
      )}

      {ipRestrictions.length > 0 && (
        <div className="security-ip-content">
          <table className="security-table">
            <thead>
              <tr>
                <th>{t("ipRestrictions.columns.ip")}</th>
                <th>{t("ipRestrictions.columns.alert")}</th>
                <th>{t("ipRestrictions.columns.rule")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ipRestrictions.map((ip) => (
                <tr key={ip.id}>
                  <td>{ip.ip}</td>
                  <td>{ip.warning ? t("common.yes") : t("common.no")}</td>
                  <td>
                    <span className={`security-badge ${ip.rule === "accept" ? "security-badge-success" : "security-badge-danger"}`}>
                      {ip.rule === "accept" ? t("ipRestrictions.allow") : t("ipRestrictions.deny")}
                    </span>
                  </td>
                  <td className="security-actions-cell">
                    <button className="security-btn security-btn-danger security-btn-sm" onClick={() => onDeleteIp(ip.id)}>
                      {t("actions.delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="security-box-footer">
        <button className="security-btn security-btn-secondary" onClick={() => onOpenModal("ip")}>
          {t("ipRestrictions.addButton")}
        </button>
      </div>
    </div>
  );
}
