// ============================================================
// MODAL: AddDsRecordModal - Ajouter un DS Record
// Basé sur target SVG modal-ds-add.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { dnssecService } from "./dnssec/DnssecTab.service";

interface Props {
  domain: string;
  onClose: () => void;
  onSuccess: () => void;
}

// ============ ICONS ============

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

// ============ ALGORITHMS ============

const ALGORITHMS = [
  { id: 8, name: "RSASHA256" },
  { id: 10, name: "RSASHA512" },
  { id: 13, name: "ECDSAP256SHA256" },
  { id: 14, name: "ECDSAP384SHA384" },
  { id: 15, name: "ED25519" },
];

const FLAGS = [
  { value: 256, label: "ZSK (Zone Signing Key)" },
  { value: 257, label: "KSK (Key Signing Key)" },
];

// ============ COMPOSANT ============

export function AddDsRecordModal({ domain, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/dnssec");
  const [formData, setFormData] = useState({
    keyTag: "",
    algorithm: 13,
    flags: 257,
    publicKey: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await dnssecService.addDsRecord(domain, {
        keyTag: parseInt(formData.keyTag, 10),
        algorithm: formData.algorithm,
        flags: formData.flags,
        publicKey: formData.publicKey,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.keyTag && formData.publicKey;

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal dom-modal-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header">
          <h3>{t("modals.addDs.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <div className="dom-modal-domain">{domain}</div>

          <div className="dom-modal-info-banner">
            {t("modals.addDs.info")}
          </div>

          <div className="dom-modal-form">
            <div className="dom-modal-field">
              <label>{t("modals.addDs.keyTag")} *</label>
              <input
                type="number"
                value={formData.keyTag}
                onChange={(e) => setFormData({ ...formData, keyTag: e.target.value })}
                placeholder="12345"
                min={0}
                max={65535}
              />
              <small>{t("modals.addDs.keyTagHelp")}</small>
            </div>

            <div className="dom-modal-row">
              <div className="dom-modal-field">
                <label>{t("modals.addDs.algorithm")}</label>
                <select
                  value={formData.algorithm}
                  onChange={(e) => setFormData({ ...formData, algorithm: Number(e.target.value) })}
                >
                  {ALGORITHMS.map((algo) => (
                    <option key={algo.id} value={algo.id}>
                      {algo.id} - {algo.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dom-modal-field">
                <label>{t("modals.addDs.flags")}</label>
                <select
                  value={formData.flags}
                  onChange={(e) => setFormData({ ...formData, flags: Number(e.target.value) })}
                >
                  {FLAGS.map((flag) => (
                    <option key={flag.value} value={flag.value}>
                      {flag.value} - {flag.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="dom-modal-field">
              <label>{t("modals.addDs.publicKey")} *</label>
              <textarea
                value={formData.publicKey}
                onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
                rows={4}
                placeholder="AwEAAb..."
              />
              <small>{t("modals.addDs.publicKeyHelp")}</small>
            </div>
          </div>

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose} disabled={loading}>
            {t("actions.cancel")}
          </button>
          <button className="dom-btn-primary" onClick={handleSubmit} disabled={loading || !isValid}>
            {loading ? "..." : t("actions.add")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddDsRecordModal;
