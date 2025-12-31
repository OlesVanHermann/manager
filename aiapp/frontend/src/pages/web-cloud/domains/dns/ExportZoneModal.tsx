// ============================================================
// MODAL: ExportZoneModal - Exporter une zone DNS
// Basé sur target SVG modal-zone-export.svg
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { zoneService } from "./zone/ZoneTab.service";

interface Props {
  zoneName: string;
  onClose: () => void;
}

// ============ ICONS ============

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

// ============ COMPOSANT ============

export function ExportZoneModal({ zoneName, onClose }: Props) {
  const { t } = useTranslation("web-cloud/domains/zone");
  const [zoneContent, setZoneContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadZone = async () => {
      try {
        const content = await zoneService.exportZone(zoneName);
        setZoneContent(content);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    loadZone();
  }, [zoneName]);

  const handleCopy = () => {
    navigator.clipboard.writeText(zoneContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([zoneContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${zoneName}.zone`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal dom-modal-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header">
          <h3>{t("modals.export.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <div className="dom-modal-domain">{zoneName}</div>

          {loading ? (
            <div className="dom-modal-loading">{t("common.loading")}</div>
          ) : error ? (
            <div className="dom-modal-error">{error}</div>
          ) : (
            <>
              <div className="dom-modal-export-actions">
                <button className="dom-btn-secondary" onClick={handleCopy}>
                  <CopyIcon />
                  {copied ? t("actions.copied") : t("actions.copy")}
                </button>
                <button className="dom-btn-secondary" onClick={handleDownload}>
                  <DownloadIcon />
                  {t("modals.export.download")}
                </button>
              </div>

              <div className="dom-modal-field">
                <label>{t("modals.export.zoneContent")}</label>
                <textarea
                  value={zoneContent}
                  readOnly
                  rows={15}
                  className="dom-modal-code"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose}>
            {t("actions.close")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportZoneModal;
