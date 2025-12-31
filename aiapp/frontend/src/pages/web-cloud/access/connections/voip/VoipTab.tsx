// ============================================================
// VOIP TAB - Lignes VoIP et EcoFax
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connectionsService } from "../connections.service";
import type { VoipLine, EcoFax } from "../connections.types";
import "./VoipTab.css";

interface VoipTabProps {
  connectionId: string;
}

export function VoipTab({ connectionId }: VoipTabProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const [lines, setLines] = useState<VoipLine[]>([]);
  const [ecoFax, setEcoFax] = useState<EcoFax | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [linesData, faxData] = await Promise.all([
          connectionsService.getVoipLines(connectionId),
          connectionsService.getEcoFax(connectionId),
        ]);
        setLines(linesData);
        setEcoFax(faxData);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [connectionId]);

  const formatPhoneNumber = (number: string): string => {
    // Format FR: 01 23 45 67 89
    if (number.length === 10) {
      return number.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
    }
    return number;
  };

  if (loading) {
    return (
      <div className="voip-tab">
        <div className="voip-loading">
          <div className="spinner" />
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="voip-tab">
        <div className="voip-error">
          <p>{t("error")}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="voip-tab">
      {/* VoIP Lines */}
      <div className="voip-section">
        <div className="section-header">
          <h4>{t("voip.lines.title")}</h4>
          <button className="btn-primary">+ {t("voip.lines.add")}</button>
        </div>

        {lines.length > 0 ? (
          <div className="voip-lines">
            {lines.map((line) => (
              <div key={line.id} className="voip-line">
                <div className="line-icon">
                  {line.type === "fax" ? "📠" : "📞"}
                </div>
                <div className="line-info">
                  <span className="line-number">{formatPhoneNumber(line.number)}</span>
                  <span className="line-type">{t(`voip.lines.${line.type}`)}</span>
                </div>
                <span className={`line-status ${line.status}`}>
                  ● {line.status}
                </span>
                <div className="line-actions">
                  <button className="btn-icon">⚙</button>
                  <button className="btn-link">{t("voip.lines.manage")}</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="voip-empty">
            <span className="empty-icon">📞</span>
            <p>{t("voip.lines.empty")}</p>
          </div>
        )}
      </div>

      {/* EcoFax */}
      <div className="voip-section">
        <div className="section-header">
          <h4>EcoFax</h4>
        </div>

        <div className="ecofax-card">
          <div className="ecofax-info">
            <span className="ecofax-icon">📠</span>
            <div className="ecofax-details">
              <span className="ecofax-title">{t("voip.ecofax.title")}</span>
              <span className="ecofax-desc">{t("voip.ecofax.description")}</span>
            </div>
          </div>

          {ecoFax?.enabled ? (
            <div className="ecofax-config">
              <div className="ecofax-row">
                <span>{t("voip.ecofax.email")}</span>
                <span className="mono">{ecoFax.email}</span>
              </div>
              {ecoFax.number && (
                <div className="ecofax-row">
                  <span>{t("voip.ecofax.number")}</span>
                  <span className="mono">{formatPhoneNumber(ecoFax.number)}</span>
                </div>
              )}
              <div className="ecofax-actions">
                <button className="btn-action">{t("voip.ecofax.edit")}</button>
                <button className="btn-action btn-danger">{t("voip.ecofax.disable")}</button>
              </div>
            </div>
          ) : (
            <div className="ecofax-cta">
              <p>{t("voip.ecofax.notEnabled")}</p>
              <button className="btn-primary">{t("voip.ecofax.enable")}</button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="voip-info">
        <span className="info-icon">ℹ</span>
        <p>{t("voip.info")}</p>
      </div>
    </div>
  );
}
