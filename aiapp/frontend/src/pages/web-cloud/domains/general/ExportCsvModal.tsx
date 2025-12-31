// ============================================================
// MODAL: Export CSV - Exporter liste domaines en CSV
// Ref: target_.web-cloud.domain.modal-export-csv.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { alldomService } from "./alldom/AlldomTab.service";

interface Props {
  domains: string[];
  onClose: () => void;
}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

type ExportField = "domain" | "expiration" | "status" | "dns" | "dnssec" | "lock" | "contacts";

const ALL_FIELDS: { key: ExportField; labelKey: string }[] = [
  { key: "domain", labelKey: "export.fieldDomain" },
  { key: "expiration", labelKey: "export.fieldExpiration" },
  { key: "status", labelKey: "export.fieldStatus" },
  { key: "dns", labelKey: "export.fieldDns" },
  { key: "dnssec", labelKey: "export.fieldDnssec" },
  { key: "lock", labelKey: "export.fieldLock" },
  { key: "contacts", labelKey: "export.fieldContacts" },
];

export function ExportCsvModal({ domains, onClose }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  const [selectedFields, setSelectedFields] = useState<Set<ExportField>>(new Set(["domain", "expiration", "status"]));
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleField = (field: ExportField) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) {
        if (field === "domain") return prev; // Domain is mandatory
        next.delete(field);
      } else {
        next.add(field);
      }
      return next;
    });
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      setError(null);
      const fields = Array.from(selectedFields);
      const csvContent = await alldomService.exportCsv(domains, fields);

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `domains_export_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="alldom-modal-overlay" onClick={onClose}>
      <div className="alldom-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="alldom-modal-header">
          <h3>{t("export.title")}</h3>
          <button className="alldom-btn-icon" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="alldom-modal-body">
          <div className="batch-info-banner">
            <p>{t("export.description", { count: domains.length })}</p>
          </div>
          <div className="export-fields">
            <h4>{t("export.selectFields")}</h4>
            {ALL_FIELDS.map((field) => (
              <label key={field.key} className="export-field-option">
                <input
                  type="checkbox"
                  checked={selectedFields.has(field.key)}
                  onChange={() => toggleField(field.key)}
                  disabled={field.key === "domain"}
                />
                <span>{t(field.labelKey)}</span>
              </label>
            ))}
          </div>
          {error && <div className="alldom-form-error">{error}</div>}
        </div>
        <div className="alldom-modal-footer">
          <button className="alldom-btn-secondary" onClick={onClose}>{tCommon("actions.cancel")}</button>
          <button className="alldom-btn-primary" onClick={handleExport} disabled={exporting}>
            <DownloadIcon />
            {exporting ? tCommon("loading") : t("export.download")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportCsvModal;
