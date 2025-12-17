import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as securityService from "../../../../services/network.security";

interface Attack { id: string; ipAttack: string; type: string; startDate: string; endDate?: string; }
interface AttacksTabProps { ipBlock: string; }

export default function AttacksTab({ ipBlock }: AttacksTabProps) {
  const { t } = useTranslation("network/security/index");
  const { t: tCommon } = useTranslation("common");
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadAttacks(); }, [ipBlock]);

  const loadAttacks = async () => {
    try { setLoading(true); setError(null); const data = await securityService.getAttacks(ipBlock); setAttacks(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadAttacks}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="attacks-tab">
      <div className="tab-toolbar"><h2>{t("attacks.title")}</h2><button className="btn btn-outline" onClick={loadAttacks}>{tCommon("actions.refresh")}</button></div>
      {attacks.length === 0 ? (
        <div className="empty-state"><h2>{t("attacks.empty.title")}</h2><p>{t("attacks.empty.description")}</p></div>
      ) : (
        <div className="attack-timeline">
          {attacks.map((attack) => (
            <div key={attack.id} className={`attack-item ${!attack.endDate ? "ongoing" : ""}`}>
              <span className="attack-icon">{!attack.endDate ? "⚠️" : "✅"}</span>
              <div className="attack-info">
                <div className="attack-type">{attack.type}</div>
                <div className="attack-details">{t("attacks.target")}: {attack.ipAttack}</div>
              </div>
              <div className="attack-time">
                <div>{new Date(attack.startDate).toLocaleString("fr-FR")}</div>
                {attack.endDate ? <div style={{ color: "var(--color-success-500)" }}>{t("attacks.mitigated")}</div> : <div style={{ color: "var(--color-error-500)" }}>{t("attacks.ongoing")}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
