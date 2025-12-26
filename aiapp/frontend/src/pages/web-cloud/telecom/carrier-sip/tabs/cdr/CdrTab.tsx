// ============================================================
// CDR TAB - Composant ISOLÉ (défactorisé)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { CdrRecord } from "../../carrier-sip.types";
import { cdrService } from "./CdrTab.service";
import "./CdrTab.css";

interface Props {
  billingAccount: string;
  serviceName: string;
}

export function CdrTab({ billingAccount, serviceName }: Props) {
  const { t } = useTranslation("web-cloud/telecom/carrier-sip/cdr");
  const [records, setRecords] = useState<CdrRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await cdrService.getCdr(billingAccount, serviceName);
        data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        setRecords(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [billingAccount, serviceName]);

  if (loading) {
    return (
      <div className="cdr-loading">
        <div className="skeleton-block" />
      </div>
    );
  }

  return (
    <div className="cdr-tab">
      <div className="cdr-tab-header">
        <div>
          <h3>{t("title")}</h3>
          <p className="cdr-tab-description">{t("description")}</p>
        </div>
        <span className="cdr-records-count">{records.length}</span>
      </div>

      <div className="cdr-stats">
        <div className="cdr-stat-card">
          <div className="cdr-stat-value">{records.length}</div>
          <div className="cdr-stat-label">Appels</div>
        </div>
        <div className="cdr-stat-card">
          <div className="cdr-stat-value">{records.filter((r) => r.status === "answered").length}</div>
          <div className="cdr-stat-label">Répondus</div>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="cdr-empty-state">
          <p>{t("empty")}</p>
        </div>
      ) : (
        <table className="data-table cdr-table">
          <thead>
            <tr>
              <th>{t("caller")}</th>
              <th>{t("callee")}</th>
              <th>{t("duration")}</th>
              <th>{t("date")}</th>
              <th>{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td className="font-mono">{r.caller}</td>
                <td className="font-mono">{r.callee}</td>
                <td className="cdr-duration">{cdrService.formatDuration(r.duration)}</td>
                <td>{cdrService.formatDate(r.startDate)}</td>
                <td>
                  <span className={`cdr-status ${r.status}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CdrTab;
