// ============================================================
// SECURITY Attacks Tab - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { SecurityAttack } from "../../security.types";
import { attacksService } from "./AttacksTab.service";
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
      const data = await attacksService.getAttacks(ipBlock);
      setAttacks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="attacks-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="attacks-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadAttacks}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="attacks-tab">
      <div className="attacks-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadAttacks}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {attacks.length === 0 ? (
        <div className="attacks-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <div className="attacks-timeline">
          {attacks.map((attack) => (
            <div
              key={attack.id}
              className={`attacks-item ${!attack.endDate ? "ongoing" : ""}`}
            >
              <span className="attacks-icon">
                {!attack.endDate ? "⚠️" : "✅"}
              </span>
              <div className="attacks-info">
                <div className="attacks-type">{attack.type}</div>
                <div className="attacks-details">
                  {t("target")}: {attack.ipAttack}
                </div>
              </div>
              <div className="attacks-time">
                <div>{attacksService.formatDate(attack.startDate)}</div>
                {attack.endDate ? (
                  <div style={{ color: "var(--color-success-500)" }}>
                    {t("mitigated")}
                  </div>
                ) : (
                  <div style={{ color: "var(--color-error-500)" }}>
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
