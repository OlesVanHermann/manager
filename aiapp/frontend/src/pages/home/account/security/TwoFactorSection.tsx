import { useTranslation } from "react-i18next";
import { IconSms, IconTotp, IconKey, IconBackup, IconCheck } from "./SecurityIcons";
import type { ModalType } from "./useSecurityData";
import type * as securityService from "../tabs/security/SecurityTab.service";

interface TwoFactorSectionProps {
  status: securityTabService.TwoFactorStatus | null;
  onOpenModal: (type: ModalType, targetId?: number) => void;
}

export default function TwoFactorSection({ status, onOpenModal }: TwoFactorSectionProps) {
  const { t } = useTranslation('home/account/security');

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR");

  return (
    <div className="security-box">
      <div className="security-box-header">
        <div className="security-box-header-left">
          <h3>{t('twoFactor.title')}</h3>
          <p>{t('twoFactor.description')}</p>
        </div>
        {status?.isEnabled && (
          <span className="status-badge status-badge-success">{t('twoFactor.enabled')}</span>
        )}
      </div>

      <div className="twofa-methods-list">
        {/* SMS */}
        <div className="twofa-method-card">
          <div className="twofa-method-header">
            <div className="twofa-method-icon"><IconSms /></div>
            <div className="twofa-method-title">
              <h4>
                {status?.sms?.some(s => s.status === "enabled") && <IconCheck />}
                {t('twoFactor.sms.title')}
              </h4>
              <p>{t('twoFactor.sms.description')}</p>
            </div>
          </div>
          {status?.sms && status.sms.length > 0 && (
            <div className="twofa-method-content">
              <table className="twofa-table">
                <thead><tr><th>{t('twoFactor.sms.phone')}</th><th>{t('twoFactor.description')}</th><th></th></tr></thead>
                <tbody>
                  {status.sms.map(s => (
                    <tr key={s.id}>
                      <td className="phone-cell">{s.phoneNumber}</td>
                      <td>
                        <span>{s.description || "-"}</span>
                        {s.lastUsedDate && <span className="last-used">{t('twoFactor.lastUsed')}: {formatDate(s.lastUsedDate)}</span>}
                      </td>
                      <td className="actions-cell">
                        <button className="btn btn-outline-danger btn-sm" onClick={() => onOpenModal("deleteSms", s.id)}>{t('actions.delete')}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="twofa-method-footer">
            <button className="btn btn-secondary btn-sm" onClick={() => onOpenModal("sms")}>{t('twoFactor.sms.addButton')}</button>
          </div>
        </div>

        {/* TOTP */}
        <div className="twofa-method-card">
          <div className="twofa-method-header">
            <div className="twofa-method-icon"><IconTotp /></div>
            <div className="twofa-method-title">
              <h4>
                {status?.totp?.some(t => t.status === "enabled") && <IconCheck />}
                {t('twoFactor.totp.title')}
              </h4>
              <p>{t('twoFactor.totp.description')}</p>
            </div>
          </div>
          {status?.totp && status.totp.length > 0 && (
            <div className="twofa-method-content">
              <table className="twofa-table">
                <thead><tr><th>{t('twoFactor.description')}</th><th></th></tr></thead>
                <tbody>
                  {status.totp.map(item => (
                    <tr key={item.id}>
                      <td>
                        <span>{item.description || t('twoFactor.totp.defaultName')}</span>
                        {item.lastUsedDate && <span className="last-used">{t('twoFactor.lastUsed')}: {formatDate(item.lastUsedDate)}</span>}
                      </td>
                      <td className="actions-cell">
                        <button className="btn btn-danger btn-sm" onClick={() => onOpenModal("deleteTotp", item.id)}>{t('actions.delete')}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="twofa-method-footer">
            <button className="btn btn-secondary btn-sm" onClick={() => onOpenModal("totp")}>{t('twoFactor.totp.configureButton')}</button>
          </div>
        </div>

        {/* U2F */}
        <div className="twofa-method-card">
          <div className="twofa-method-header">
            <div className="twofa-method-icon"><IconKey /></div>
            <div className="twofa-method-title">
              <h4>
                {status?.u2f?.some(u => u.status === "enabled") && <IconCheck />}
                {t('twoFactor.u2f.title')}
              </h4>
              <p>{t('twoFactor.u2f.description')}</p>
            </div>
          </div>
          {status?.u2f && status.u2f.length > 0 && (
            <div className="twofa-method-content">
              <table className="twofa-table">
                <thead><tr><th>{t('twoFactor.description')}</th><th></th></tr></thead>
                <tbody>
                  {status.u2f.map(u => (
                    <tr key={u.id}>
                      <td>
                        <span>{u.description || t('twoFactor.u2f.defaultName')}</span>
                        {u.lastUsedDate && <span className="last-used">{t('twoFactor.lastUsed')}: {formatDate(u.lastUsedDate)}</span>}
                      </td>
                      <td className="actions-cell">
                        <button className="btn btn-danger btn-sm" onClick={() => onOpenModal("deleteU2f", u.id)}>{t('actions.delete')}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="twofa-method-footer">
            <button className="btn btn-secondary btn-sm" onClick={() => onOpenModal("u2f")}>{t('twoFactor.u2f.addButton')}</button>
          </div>
        </div>

        {/* Backup Codes */}
        <div className="twofa-method-card">
          <div className="twofa-method-header">
            <div className="twofa-method-icon"><IconBackup /></div>
            <div className="twofa-method-title">
              <h4>
                {status?.backupCode?.status === "enabled" && <IconCheck />}
                {t('twoFactor.backup.title')}
              </h4>
              <p>{t('twoFactor.backup.description')}</p>
            </div>
          </div>
          {status?.backupCode && (
            <div className="twofa-method-content">
              <div className="backup-status">
                <span className="backup-count">{t('twoFactor.backup.remaining', { count: status.backupCode.remaining })}</span>
                {status.backupCode.status === "enabled" && <span className="status-badge status-badge-success">{t('twoFactor.active')}</span>}
              </div>
            </div>
          )}
          <div className="twofa-method-footer">
            <button className="btn btn-secondary btn-sm" onClick={() => onOpenModal("backup")}>{t('twoFactor.backup.regenerateButton')}</button>
          </div>
        </div>
      </div>

      {status?.isEnabled && (
        <div className="twofa-disable-section">
          <button className="btn btn-danger" onClick={() => onOpenModal("disable2fa")}>{t('twoFactor.disableButton')}</button>
        </div>
      )}
    </div>
  );
}
