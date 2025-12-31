// ============================================================
// MODAL: ImportZoneModal - Importer une zone DNS
// Basé sur target SVG modal-zone-import.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { zoneService } from "./zone/ZoneTab.service";

interface Props {
  zoneName: string;
  onClose: () => void;
  onSuccess: () => void;
}

// ============ ICONS ============

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

// ============ COMPOSANT ============

export function ImportZoneModal({ zoneName, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/zone");
  const [mode, setMode] = useState<"text" | "file">("text");
  const [zoneText, setZoneText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      // Read file content
      const reader = new FileReader();
      reader.onload = (event) => {
        setZoneText(event.target?.result as string || "");
      };
      reader.readAsText(f);
    }
  };

  const handleSubmit = async () => {
    if (!zoneText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await zoneService.importZone(zoneName, zoneText);
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal dom-modal-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header">
          <h3>{t("modals.import.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <div className="dom-modal-domain">{zoneName}</div>

          <div className="dom-modal-info-banner">
            {t("modals.import.info")}
          </div>

          {/* Mode selection */}
          <div className="dom-modal-tabs">
            <button
              className={`dom-modal-tab ${mode === "text" ? "active" : ""}`}
              onClick={() => setMode("text")}
            >
              {t("modals.import.modeText")}
            </button>
            <button
              className={`dom-modal-tab ${mode === "file" ? "active" : ""}`}
              onClick={() => setMode("file")}
            >
              {t("modals.import.modeFile")}
            </button>
          </div>

          {mode === "file" && (
            <div className="dom-modal-upload">
              <input
                type="file"
                id="zone-file"
                accept=".txt,.zone"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="zone-file" className="dom-modal-upload-label">
                <UploadIcon />
                <span>{file ? file.name : t("modals.import.selectFile")}</span>
              </label>
            </div>
          )}

          <div className="dom-modal-field">
            <label>{t("modals.import.zoneContent")}</label>
            <textarea
              value={zoneText}
              onChange={(e) => setZoneText(e.target.value)}
              rows={12}
              placeholder={`; Zone file for ${zoneName}\n@ 3600 IN A 192.168.1.1\nwww 3600 IN CNAME @`}
            />
          </div>

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose} disabled={loading}>
            {t("actions.cancel")}
          </button>
          <button className="dom-btn-primary" onClick={handleSubmit} disabled={loading || !zoneText.trim()}>
            {loading ? "..." : t("modals.import.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportZoneModal;
