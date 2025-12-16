// ============================================================
// HOSTING TAB: EMAILS - Emails inclus
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, EmailOption } from "../../../../services/hosting.service";

interface Props { serviceName: string; }

/** Onglet Emails inclus avec l'hebergement. */
export function EmailsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [email, setEmail] = useState<EmailOption | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await hostingService.getEmailOption(serviceName);
        setEmail(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  const getStatusBadge = (status: string) => {
    const map: Record<string, { class: string; label: string }> = {
      normal: { class: 'success', label: t("emails.statusNormal") },
      bounce: { class: 'warning', label: t("emails.statusBounce") },
      spam: { class: 'error', label: t("emails.statusSpam") },
      suspend: { class: 'error', label: t("emails.statusSuspend") },
      force: { class: 'info', label: t("emails.statusForce") },
      none: { class: 'inactive', label: t("emails.statusNone") },
    };
    const s = map[status] || { class: 'inactive', label: status };
    return <span className={`badge ${s.class}`}>{s.label}</span>;
  };

  return (
    <div className="emails-tab">
      <div className="tab-header">
        <h3>{t("emails.title")}</h3>
        <p className="tab-description">{t("emails.description")}</p>
      </div>

      {email ? (
        <div className="email-card">
          <div className="email-status">
            <div className={`status-icon ${email.status === 'normal' ? 'enabled' : 'disabled'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </div>
            <div className="status-text">
              <span className="status-label">{email.domain}</span>
              {getStatusBadge(email.status)}
            </div>
          </div>
          {email.quota && (
            <div className="email-quota">
              <label>{t("emails.quota")}</label>
              <span>{email.quota.value} {email.quota.unit}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75" /></svg>
          <p>{t("emails.noEmail")}</p>
        </div>
      )}

      <div className="info-box">
        <h4>{t("emails.info")}</h4>
        <p>{t("emails.infoDesc")}</p>
      </div>
    </div>
  );
}

export default EmailsTab;
