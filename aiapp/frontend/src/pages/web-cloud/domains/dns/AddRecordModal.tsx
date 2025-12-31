// ============================================================
// MODAL: AddRecordModal - Ajouter une entrée DNS (Wizard)
// Basé sur target SVG modal-add-record.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { zoneService } from "./zone/ZoneTab.service";

interface Props {
  zoneName: string;
  onClose: () => void;
  onSuccess: () => void;
}

type RecordType = "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS" | "SRV" | "CAA" | "DKIM" | "DMARC" | "SPF" | "DNAME" | "NAPTR" | "LOC" | "SSHFP" | "TLSA" | "RP" | "SVCB" | "HTTPS";

interface RecordTypeInfo {
  type: RecordType;
  category: "basic" | "advanced" | "email";
  description: string;
}

// ============ ICONS ============

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ============ RECORD TYPES ============

const RECORD_TYPES: RecordTypeInfo[] = [
  // Basic
  { type: "A", category: "basic", description: "IPv4 address" },
  { type: "AAAA", category: "basic", description: "IPv6 address" },
  { type: "NS", category: "basic", description: "Name Server" },
  { type: "CNAME", category: "basic", description: "Canonical name (alias)" },
  { type: "DNAME", category: "basic", description: "Delegation name" },
  // Advanced
  { type: "CAA", category: "advanced", description: "Certificate Authority Authorization" },
  { type: "TXT", category: "advanced", description: "Text record" },
  { type: "NAPTR", category: "advanced", description: "Naming Authority Pointer" },
  { type: "SRV", category: "advanced", description: "Service record" },
  { type: "LOC", category: "advanced", description: "Location" },
  { type: "SSHFP", category: "advanced", description: "SSH Fingerprint" },
  { type: "TLSA", category: "advanced", description: "TLS Authentication" },
  { type: "RP", category: "advanced", description: "Responsible Person" },
  { type: "SVCB", category: "advanced", description: "Service Binding" },
  { type: "HTTPS", category: "advanced", description: "HTTPS Service" },
  // Email
  { type: "MX", category: "email", description: "Mail Exchange" },
  { type: "SPF", category: "email", description: "Sender Policy Framework" },
  { type: "DKIM", category: "email", description: "DomainKeys Identified Mail" },
  { type: "DMARC", category: "email", description: "Domain-based Message Authentication" },
];

// ============ COMPOSANT ============

export function AddRecordModal({ zoneName, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/zone");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState<RecordType | null>(null);
  const [formData, setFormData] = useState({
    subDomain: "",
    ttl: 3600,
    target: "",
    priority: 10,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const basicTypes = RECORD_TYPES.filter((r) => r.category === "basic");
  const advancedTypes = RECORD_TYPES.filter((r) => r.category === "advanced");
  const emailTypes = RECORD_TYPES.filter((r) => r.category === "email");

  const handleTypeSelect = (type: RecordType) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (step === 1 && selectedType) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    setSaving(true);
    setError(null);
    try {
      await zoneService.createRecord(zoneName, {
        fieldType: selectedType,
        subDomain: formData.subDomain || "@",
        ttl: formData.ttl,
        target: formData.target,
        ...(selectedType === "MX" && { priority: formData.priority }),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const renderTypeButton = (info: RecordTypeInfo) => (
    <button
      key={info.type}
      className={`dom-modal-type-btn ${selectedType === info.type ? "selected" : ""}`}
      onClick={() => handleTypeSelect(info.type)}
    >
      <span className="dom-modal-type-name">{info.type}</span>
      {selectedType === info.type && <CheckIcon />}
    </button>
  );

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal dom-modal-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header">
          <h3>{t("modals.addRecord.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Wizard steps */}
        <div className="dom-modal-wizard">
          <div className={`dom-modal-wizard-step ${step >= 1 ? "active" : ""} ${step > 1 ? "done" : ""}`}>
            <span className="dom-modal-wizard-num">1</span>
            <span>{t("modals.addRecord.step1")}</span>
          </div>
          <div className={`dom-modal-wizard-step ${step >= 2 ? "active" : ""} ${step > 2 ? "done" : ""}`}>
            <span className="dom-modal-wizard-num">2</span>
            <span>{t("modals.addRecord.step2")}</span>
          </div>
          <div className={`dom-modal-wizard-step ${step >= 3 ? "active" : ""}`}>
            <span className="dom-modal-wizard-num">3</span>
            <span>{t("modals.addRecord.step3")}</span>
          </div>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          {/* Step 1: Select type */}
          {step === 1 && (
            <div className="dom-modal-types">
              <div className="dom-modal-type-section">
                <h4>{t("modals.addRecord.basicRecords")}</h4>
                <div className="dom-modal-type-grid">
                  {basicTypes.map(renderTypeButton)}
                </div>
              </div>

              <div className="dom-modal-type-section">
                <h4>{t("modals.addRecord.advancedRecords")}</h4>
                <div className="dom-modal-type-grid">
                  {advancedTypes.map(renderTypeButton)}
                </div>
              </div>

              <div className="dom-modal-type-section">
                <h4>{t("modals.addRecord.emailRecords")}</h4>
                <div className="dom-modal-type-grid">
                  {emailTypes.map(renderTypeButton)}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Configuration */}
          {step === 2 && selectedType && (
            <div className="dom-modal-form">
              <div className="dom-modal-field">
                <label>{t("modals.addRecord.subDomain")}</label>
                <div className="dom-modal-input-suffix">
                  <input
                    type="text"
                    value={formData.subDomain}
                    onChange={(e) => setFormData({ ...formData, subDomain: e.target.value })}
                    placeholder="www"
                  />
                  <span>.{zoneName}</span>
                </div>
                <small>{t("modals.addRecord.subDomainHelp")}</small>
              </div>

              <div className="dom-modal-field">
                <label>{t("modals.addRecord.ttl")}</label>
                <select
                  value={formData.ttl}
                  onChange={(e) => setFormData({ ...formData, ttl: Number(e.target.value) })}
                >
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                  <option value={3600}>1 heure</option>
                  <option value={86400}>1 jour</option>
                </select>
              </div>

              {selectedType === "MX" && (
                <div className="dom-modal-field">
                  <label>{t("modals.addRecord.priority")}</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    min={1}
                    max={65535}
                  />
                </div>
              )}

              <div className="dom-modal-field">
                <label>{t("modals.addRecord.target")}</label>
                <input
                  type="text"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  placeholder={selectedType === "A" ? "192.168.1.1" : selectedType === "AAAA" ? "2001:db8::1" : "target.example.com"}
                />
              </div>
            </div>
          )}

          {/* Step 3: Summary */}
          {step === 3 && selectedType && (
            <div className="dom-modal-summary">
              <h4>{t("modals.addRecord.summary")}</h4>
              <div className="dom-modal-summary-grid">
                <div className="dom-modal-summary-row">
                  <span>{t("modals.addRecord.type")}</span>
                  <strong>{selectedType}</strong>
                </div>
                <div className="dom-modal-summary-row">
                  <span>{t("modals.addRecord.subDomain")}</span>
                  <strong>{formData.subDomain || "@"}.{zoneName}</strong>
                </div>
                <div className="dom-modal-summary-row">
                  <span>{t("modals.addRecord.ttl")}</span>
                  <strong>{formData.ttl}s</strong>
                </div>
                <div className="dom-modal-summary-row">
                  <span>{t("modals.addRecord.target")}</span>
                  <strong>{formData.target}</strong>
                </div>
                {selectedType === "MX" && (
                  <div className="dom-modal-summary-row">
                    <span>{t("modals.addRecord.priority")}</span>
                    <strong>{formData.priority}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          {step > 1 && (
            <button className="dom-btn-secondary" onClick={handleBack}>
              {t("actions.back")}
            </button>
          )}
          <button className="dom-btn-secondary" onClick={onClose}>
            {t("actions.cancel")}
          </button>
          {step < 3 ? (
            <button className="dom-btn-primary" onClick={handleNext} disabled={step === 1 && !selectedType}>
              {t("actions.next")}
            </button>
          ) : (
            <button className="dom-btn-primary" onClick={handleSubmit} disabled={saving || !formData.target}>
              {saving ? "..." : t("actions.create")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddRecordModal;
