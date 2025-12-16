import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { voipService, TelephonyVoicemail } from "../../../../services/web-cloud.voip";

interface Props { billingAccount: string; }

export function VoicemailsTab({ billingAccount }: Props) {
  const { t } = useTranslation("web-cloud/voip/index");
  const [voicemails, setVoicemails] = useState<TelephonyVoicemail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await voipService.listVoicemails(billingAccount);
        const data = await Promise.all(names.map(n => voipService.getVoicemail(billingAccount, n)));
        setVoicemails(data);
      } finally { setLoading(false); }
    };
    load();
  }, [billingAccount]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="voicemails-tab">
      <div className="tab-header"><h3>{t("voicemails.title")}</h3><span className="records-count">{voicemails.length}</span></div>
      {voicemails.length === 0 ? (<div className="empty-state"><p>{t("voicemails.empty")}</p></div>) : (
        <div className="voicemail-cards">
          {voicemails.map(vm => (
            <div key={vm.serviceName} className="voicemail-card">
              <div className="voicemail-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" /></svg></div>
              <h4>{vm.serviceName}</h4>
              <p>{vm.description || t("voicemails.noDescription")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default VoicemailsTab;
