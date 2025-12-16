import { useTranslation } from "react-i18next";
import { IconNetwork } from "./SecurityIcons";
import type { ModalType } from "./useSecurityData";
import type * as securityService from "../../../../services/home.account.security";

interface IpRestrictionsSectionProps {
  ipRestrictions: securityService.IpRestriction[];
  ipDefaultRule: securityService.IpDefaultRule | null;
  onOpenModal: (type: ModalType) => void;
  onDeleteIp: (id: number) => void;
}

export default function IpRestrictionsSection({ ipRestrictions, ipDefaultRule, onOpenModal, onDeleteIp }: IpRestrictionsSectionProps) {
  const { t } = useTranslation('home/account/security');

  return (
    <div className="security-box">
      <div className="security-box-header">
        <div className="security-box-header-left">
          <div className="security-box-icon"><IconNetwork /></div>
          <div>
            <h3>{t('ipRestrictions.title')}</h3>
            <p>{t('ipRestrictions.description')}</p>
          </div>
        </div>
      </div>

      {ipDefaultRule && (
        <div className="ip-default-rule">
          <span>{t('ipRestrictions.defaultRule')}: </span>
          <strong>{ipDefaultRule.rule === "accept" ? t('ipRestrictions.allow') : t('ipRestrictions.deny')}</strong>
          {ipDefaultRule.warning && <span className="status-badge status-badge-info">{t('ipRestrictions.alertsEnabled')}</span>}
        </div>
      )}

      {ipRestrictions.length > 0 && (
        <div className="ip-restrictions-content">
          <table className="twofa-table">
            <thead>
              <tr>
                <th>{t('ipRestrictions.columns.ip')}</th>
                <th>{t('ipRestrictions.columns.alert')}</th>
                <th>{t('ipRestrictions.columns.rule')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ipRestrictions.map(ip => (
                <tr key={ip.id}>
                  <td>{ip.ip}</td>
                  <td>{ip.warning ? t('common.yes') : t('common.no')}</td>
                  <td>
                    <span className={`status-badge ${ip.rule === "accept" ? "status-badge-success" : "status-badge-danger"}`}>
                      {ip.rule === "accept" ? t('ipRestrictions.allow') : t('ipRestrictions.deny')}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn btn-sm btn-danger" onClick={() => onDeleteIp(ip.id)}>{t('actions.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="security-box-footer">
        <button className="btn btn-secondary" onClick={() => onOpenModal("ip")}>{t('ipRestrictions.addButton')}</button>
      </div>
    </div>
  );
}
