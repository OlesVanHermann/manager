import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { voipService } from "./VoipTab.service";
import type { VoipLine } from "../../pack-xdsl.types";
import "./VoipTab.css";

interface Props {
  packName: string;
}

export function VoipTab({ packName }: Props) {
  const { t } = useTranslation("web-cloud/pack-xdsl/index");
  const [lines, setLines] = useState<VoipLine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await voipService.getVoipLines(packName);
        setLines(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [packName]);

  if (loading) {
    return <div className="tab-loading"><div className="skeleton-block" /></div>;
  }

  return (
    <div className="voip-container">
      <div className="voip-header">
        <div>
          <h3>{t("voip.title")}</h3>
        </div>
        <span className="voip-records-count">{lines.length}</span>
      </div>
      {lines.length === 0 ? (
        <div className="voip-empty">
          <p>{t("voip.empty")}</p>
        </div>
      ) : (
        <div className="voip-line-cards">
          {lines.map(l => (
            <div key={l.serviceName} className="voip-line-card">
              <div className="voip-icon">📞</div>
              <div className="voip-info">
                <h4>{l.number}</h4>
                <p>{l.description || l.serviceName}</p>
                <span className={`badge ${l.status === 'active' ? 'success' : 'warning'}`}>
                  {l.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VoipTab;
