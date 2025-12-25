// ############################################################
// #  DEDICATED/INTERVENTIONS - COMPOSANT STRICTEMENT ISOLÉ   #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./InterventionsTab.css                      #
// #  SERVICE LOCAL : ./InterventionsTab.ts                   #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { interventionsService } from "./InterventionsTab";
import type { DedicatedServerIntervention } from "../../dedicated.types";
import "./InterventionsTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface Props {
  serviceName: string;
}

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// NE JAMAIS importer depuis un autre tab
// ============================================================
const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString();
};

// ============================================================
// Composant Principal
// ============================================================
export function InterventionsTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/dedicated/index");
  const [interventions, setInterventions] = useState<DedicatedServerIntervention[]>([]);
  const [loading, setLoading] = useState(true);

  // Chargement des interventions
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await interventionsService.listInterventions(serviceName);
        const data = await Promise.all(
          ids
            .slice(0, 50)
            .map((id) => interventionsService.getIntervention(serviceName, id))
        );
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setInterventions(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  // État de chargement
  if (loading) {
    return (
      <div className="dedicated-interventions-tab">
        <div className="dedicated-interventions-loading">
          <div className="dedicated-interventions-skeleton" style={{ width: "100%" }} />
          <div className="dedicated-interventions-skeleton" style={{ width: "70%" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="dedicated-interventions-tab">
      {/* En-tête */}
      <div className="dedicated-interventions-header">
        <h3>{t("interventions.title")}</h3>
        <p className="dedicated-interventions-description">
          {t("interventions.description")}
        </p>
      </div>

      {/* Liste vide */}
      {interventions.length === 0 ? (
        <div className="dedicated-interventions-empty">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>{t("interventions.empty")}</p>
        </div>
      ) : (
        <table className="dedicated-interventions-table">
          <thead>
            <tr>
              <th>{t("interventions.date")}</th>
              <th>{t("interventions.type")}</th>
            </tr>
          </thead>
          <tbody>
            {interventions.map((i) => (
              <tr key={i.interventionId}>
                <td>{formatDateTime(i.date)}</td>
                <td>{i.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InterventionsTab;
