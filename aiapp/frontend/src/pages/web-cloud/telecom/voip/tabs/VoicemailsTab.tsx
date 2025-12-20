import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { voipService, TelephonyVoicemail } from "../../../../../services/web-cloud.voip";

interface Props { billingAccount: string; }

export function VoicemailsTab({ billingAccount }: Props) {
  const { t } = useTranslation("web-cloud/voip/index");
  const [voicemails, setVoicemails] = useState<TelephonyVoicemail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await voipService.getVoicemails(billingAccount); setVoicemails(data); }
      finally { setLoading(false); }
    };
    load();
  }, [billingAccount]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="voicemails-tab">
      <div className="tab-header"><div><h3>{t("voicemails.title")}</h3></div><span className="records-count">{voicemails.length}</span></div>
      {voicemails.length === 0 ? (
        <div className="empty-state"><p>{t("voicemails.empty")}</p></div>
      ) : (
        <div className="voicemail-cards">
          {voicemails.map(v => (
            <div key={v.serviceName} className="voicemail-card">
              <div className="voicemail-icon">📬</div>
              <h4>{v.serviceName}</h4>
              <p>{v.description || t("voicemails.noDescription")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default VoicemailsTab;
