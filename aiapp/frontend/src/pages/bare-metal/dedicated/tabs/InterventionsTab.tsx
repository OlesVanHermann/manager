import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { dedicatedService, DedicatedServerIntervention } from "../../../../services/dedicated.service";

interface Props { serviceName: string; }

export function InterventionsTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/dedicated/index");
  const [interventions, setInterventions] = useState<DedicatedServerIntervention[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await dedicatedService.listInterventions(serviceName);
        const data = await Promise.all(ids.slice(0, 50).map(id => dedicatedService.getIntervention(serviceName, id)));
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setInterventions(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="interventions-tab">
      <div className="tab-header"><h3>{t("interventions.title")}</h3><p className="tab-description">{t("interventions.description")}</p></div>
      {interventions.length === 0 ? (<div className="empty-state"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><p>{t("interventions.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("interventions.date")}</th><th>{t("interventions.type")}</th></tr></thead>
          <tbody>{interventions.map(i => (<tr key={i.interventionId}><td>{new Date(i.date).toLocaleString()}</td><td>{i.type}</td></tr>))}</tbody>
        </table>
      )}
    </div>
  );
}
export default InterventionsTab;
