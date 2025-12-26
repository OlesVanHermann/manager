// ============================================================
// SECURITY Attacks Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .security-attacks-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { SecurityAttack } from "../../security.types";
import { securityAttacksService } from "./AttacksTab.service";
import "./AttacksTab.css";

interface AttacksTabProps {
  ipBlock: string;
}

export default function AttacksTab({ ipBlock }: AttacksTabProps) {
  const { t } = useTranslation("network/security/attacks");
  const { t: tCommon } = useTranslation("common");
  const [attacks, setAttacks] = useState<SecurityAttack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAttacks();
  }, [ipBlock]);

  const loadAttacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await securityAttacksService.getAttacks(ipBlock);
      setAttacks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="security-attacks-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="security-attacks-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadAttacks}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="security-attacks-tab">
      <div className="security-attacks-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadAttacks}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {attacks.length === 0 ? (
        <div className="security-attacks-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <div className="security-attacks-timeline">
          {attacks.map((attack) => (
            <div
              key={attack.id}
              className={`security-attacks-item ${!attack.endDate ? "security-attacks-ongoing" : ""}`}
            >
              <span className="security-attacks-icon">
                {!attack.endDate ? "⚠️" : "✅"}
              </span>
              <div className="security-attacks-info">
                <div className="security-attacks-type">{attack.type}</div>
                <div className="security-attacks-details">
                  {t("target")}: {attack.ipAttack}
                </div>
              </div>
              <div className="security-attacks-time">
                <div>{securityAttacksService.formatDate(attack.startDate)}</div>
                {attack.endDate ? (
                  <div className="security-attacks-status-mitigated">
                    {t("mitigated")}
                  </div>
                ) : (
                  <div className="security-attacks-status-ongoing">
                    {t("ongoing")}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
