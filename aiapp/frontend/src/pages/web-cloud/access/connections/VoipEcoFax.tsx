// ============================================================
// VOIP ECOFAX - NAV4 EcoFax (config + envoi + historique)
// ============================================================

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { EcoFax, FaxHistoryItem } from "./connections.types";

interface EcoFaxConfig {
  email: string;
  format: "pdf" | "tiff" | "pdf_tiff";
  quality: "standard" | "high" | "ultra";
}

interface VoipEcoFaxProps {
  connectionId: string;
  ecoFax: EcoFax | null;
  history: FaxHistoryItem[];
  loading: boolean;
  onSaveConfig: (config: EcoFaxConfig) => Promise<void>;
  onSendFax: (number: string, file: File) => Promise<void>;
  onDownloadFax: (faxId: string) => void;
  onResendFax: (faxId: string) => Promise<void>;
  onEnable: () => void;
}

export function VoipEcoFax({
  connectionId,
  ecoFax,
  history,
  loading,
  onSaveConfig,
  onSendFax,
  onDownloadFax,
  onResendFax,
  onEnable,
}: VoipEcoFaxProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const [localConfig, setLocalConfig] = useState<Partial<EcoFaxConfig>>({});
  const [sendNumber, setSendNumber] = useState("");
  const [sendFile, setSendFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const mergedConfig = ecoFax ? {
    email: localConfig.email ?? ecoFax.email,
    format: localConfig.format ?? (ecoFax.format || "pdf"),
    quality: localConfig.quality ?? (ecoFax.quality || "high"),
  } : null;

  const hasChanges = Object.keys(localConfig).length > 0;

  const formatPhoneNumber = (number: string): string => {
    if (number.length === 10) {
      return number.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
    }
    return number;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleConfigChange = useCallback((field: keyof EcoFaxConfig, value: string) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveConfig = useCallback(async () => {
    if (!mergedConfig) return;
    setSaving(true);
    try {
      await onSaveConfig(mergedConfig as EcoFaxConfig);
      setLocalConfig({});
    } finally {
      setSaving(false);
    }
  }, [mergedConfig, onSaveConfig]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      setSendFile(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSendFile(file);
    }
  }, []);

  const handleSendFax = useCallback(async () => {
    if (!sendNumber || !sendFile) return;
    setSending(true);
    try {
      await onSendFax(sendNumber, sendFile);
      setSendNumber("");
      setSendFile(null);
    } finally {
      setSending(false);
    }
  }, [sendNumber, sendFile, onSendFax]);

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      success: "badge-fax-success",
      error: "badge-fax-error",
      pending: "badge-fax-pending",
      sending: "badge-fax-sending",
    };
    return statusClasses[status] || "badge-fax-default";
  };

  const getTypeBadge = (type: string) => {
    return type === "received" ? "badge-fax-received" : "badge-fax-sent";
  };

  const formats = [
    { value: "pdf", label: "PDF (recommandé)" },
    { value: "tiff", label: "TIFF" },
    { value: "pdf_tiff", label: "PDF + TIFF" },
  ];

  const qualities = [
    { value: "standard", label: `${t("voip.ecofax.standard")} (100 dpi)` },
    { value: "high", label: `${t("voip.ecofax.high")} (200 dpi)` },
    { value: "ultra", label: `${t("voip.ecofax.ultra")} (300 dpi)` },
  ];

  if (loading) {
    return (
      <div className="voip-ecofax">
        <div className="voip-loading-inline">
          <div className="spinner-small" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (!ecoFax?.enabled) {
    return (
      <div className="voip-ecofax">
        <div className="ecofax-disabled">
          <div className="disabled-icon">📠</div>
          <h4>{t("voip.ecofax.notEnabled")}</h4>
          <p>{t("voip.ecofax.notEnabledDesc")}</p>
          <button className="btn-primary" onClick={onEnable}>
            {t("voip.ecofax.enable")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="voip-ecofax">
      {/* EcoFax Config */}
      <div className="ecofax-section">
        <div className="section-header">
          <h4>⚙ {t("voip.ecofax.configuration")}</h4>
          <span className={`badge-status ${ecoFax.status === "active" ? "on" : "off"}`}>
            {ecoFax.status === "active" ? t("voip.ecofax.active") : t("voip.ecofax.inactive")}
          </span>
        </div>

        <div className="ecofax-config-card">
          <div className="config-row">
            <span className="config-label">{t("voip.ecofax.faxNumber")}</span>
            <span className="config-value mono">{formatPhoneNumber(ecoFax.number || "")}</span>
          </div>

          <div className="config-row">
            <label className="config-label">{t("voip.ecofax.emailReception")}</label>
            <input
              type="email"
              className="config-input"
              value={mergedConfig?.email || ""}
              onChange={(e) => handleConfigChange("email", e.target.value)}
              placeholder="fax@entreprise.fr"
            />
          </div>

          <div className="config-row">
            <label className="config-label">{t("voip.ecofax.format")}</label>
            <select
              className="config-select"
              value={mergedConfig?.format || "pdf"}
              onChange={(e) => handleConfigChange("format", e.target.value)}
            >
              {formats.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          <div className="config-row">
            <label className="config-label">{t("voip.ecofax.quality")}</label>
            <select
              className="config-select"
              value={mergedConfig?.quality || "high"}
              onChange={(e) => handleConfigChange("quality", e.target.value)}
            >
              {qualities.map(q => (
                <option key={q.value} value={q.value}>{q.label}</option>
              ))}
            </select>
          </div>

          {hasChanges && (
            <div className="config-actions">
              <button className="btn-secondary" onClick={() => setLocalConfig({})}>
                {t("cancel")}
              </button>
              <button className="btn-primary" onClick={handleSaveConfig} disabled={saving}>
                {saving ? t("saving") : t("save")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Send Fax */}
      <div className="ecofax-section">
        <div className="section-header">
          <h4>📤 {t("voip.ecofax.sendFax")}</h4>
        </div>

        <div className="send-fax-card">
          <div className="send-row">
            <label className="send-label">{t("voip.ecofax.recipientNumber")}</label>
            <input
              type="tel"
              className="send-input"
              value={sendNumber}
              onChange={(e) => setSendNumber(e.target.value)}
              placeholder="01 23 45 67 89"
            />
          </div>

          <div className="send-row">
            <label className="send-label">{t("voip.ecofax.document")}</label>
            <div
              className={`file-dropzone ${dragOver ? "dragover" : ""} ${sendFile ? "has-file" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {sendFile ? (
                <div className="file-preview">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{sendFile.name}</span>
                  <button className="btn-remove" onClick={() => setSendFile(null)}>×</button>
                </div>
              ) : (
                <>
                  <span className="dropzone-icon">📎</span>
                  <p>{t("voip.ecofax.dropzone")}</p>
                  <label className="btn-browse">
                    {t("voip.ecofax.browse")}
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileSelect}
                      hidden
                    />
                  </label>
                </>
              )}
            </div>
          </div>

          <button
            className="btn-primary send-btn"
            onClick={handleSendFax}
            disabled={!sendNumber || !sendFile || sending}
          >
            {sending ? t("voip.ecofax.sending") : t("voip.ecofax.send")}
          </button>
        </div>
      </div>

      {/* Fax History */}
      <div className="ecofax-section">
        <div className="section-header">
          <h4>📋 {t("voip.ecofax.history")}</h4>
        </div>

        {history.length > 0 ? (
          <div className="fax-table-wrapper">
            <table className="fax-table">
              <thead>
                <tr>
                  <th>{t("voip.ecofax.date")}</th>
                  <th>{t("voip.ecofax.type")}</th>
                  <th>{t("voip.ecofax.correspondent")}</th>
                  <th>{t("voip.ecofax.pages")}</th>
                  <th>{t("voip.ecofax.status")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {history.map((fax) => (
                  <tr key={fax.id}>
                    <td className="mono">{formatDate(fax.date)}</td>
                    <td>
                      <span className={`badge-fax-type ${getTypeBadge(fax.type)}`}>
                        {fax.type === "received" ? "📥 Reçu" : "📤 Envoyé"}
                      </span>
                    </td>
                    <td className="mono">{fax.correspondent}</td>
                    <td>{fax.pages}</td>
                    <td>
                      <span className={`badge-fax-status ${getStatusBadge(fax.status)}`}>
                        {t(`voip.ecofax.statuses.${fax.status}`)}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn-icon"
                        onClick={() => onDownloadFax(fax.id)}
                        title={t("voip.ecofax.download")}
                      >
                        ⬇
                      </button>
                      {fax.type === "sent" && fax.status === "error" && (
                        <button
                          className="btn-icon"
                          onClick={() => onResendFax(fax.id)}
                          title={t("voip.ecofax.resend")}
                        >
                          🔄
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="fax-empty">
            <span className="empty-icon">📋</span>
            <p>{t("voip.ecofax.noHistory")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoipEcoFax;
