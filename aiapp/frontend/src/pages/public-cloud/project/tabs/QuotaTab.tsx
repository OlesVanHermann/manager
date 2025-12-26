import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as quotaService from "./QuotaTab.service";
import type { CloudQuota } from "../project.types";
import "./QuotaTab.css";

interface Props { projectId: string; }

export function QuotaTab({ projectId }: Props) {
  const { t } = useTranslation("public-cloud/project/quota");
  const [quotas, setQuotas] = useState<CloudQuota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await quotaService.getQuota(projectId); setQuotas(data); }
      finally { setLoading(false); }
    };
    load();
  }, [projectId]);

  const QuotaBar = ({ used, max, label }: { used: number; max: number; label: string }) => {
    const percent = max > 0 ? Math.round((used / max) * 100) : 0;
    return (
      <div className="quota-item">
        <div className="quota-label"><span>{label}</span><span>{used} / {max}</span></div>
        <div className="quota-bar"><div className="quota-fill" style={{ width: `${Math.min(percent, 100)}%`, background: percent > 90 ? '#ef4444' : percent > 70 ? '#f59e0b' : '#22c55e' }} /></div>
      </div>
    );
  };

  if (loading) return <div className="quota-loading"><div className="quota-skeleton-block" /></div>;

  return (
    <div className="quota-tab">
      <div className="quota-header"><h3>{t("title")}</h3><p className="quota-description">{t("description")}</p></div>
      {quotas.length === 0 ? (<div className="quota-empty-state"><p>{t("empty")}</p></div>) : (
        <div className="quota-regions">
          {quotas.map(q => (
            <div key={q.region} className="quota-region">
              <h4>{q.region}</h4>
              <div className="quota-grid">
                <div className="quota-section">
                  <h5>{t("instances")}</h5>
                  <QuotaBar used={q.instance.usedInstances} max={q.instance.maxInstances} label={t("instanceCount")} />
                  <QuotaBar used={q.instance.usedCores} max={q.instance.maxCores} label={t("cores")} />
                  <QuotaBar used={Math.round(q.instance.usedRAM / 1024)} max={Math.round(q.instance.maxRam / 1024)} label={t("ram")} />
                </div>
                <div className="quota-section">
                  <h5>{t("volumes")}</h5>
                  <QuotaBar used={q.volume.volumeCount} max={q.volume.maxVolumeCount} label={t("volumeCount")} />
                  <QuotaBar used={q.volume.usedGigabytes} max={q.volume.maxGigabytes} label={t("storage")} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default QuotaTab;
