// ============================================================
// SUB-TAB - Signature (Signatures email / Disclaimer)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EmailOffer } from "../../types";

interface SignatureTabProps {
  domain?: string;
  offers: EmailOffer[];
}

interface EmailSignature {
  id: string;
  name: string;
  content: string;
  htmlContent: string;
  isDefault: boolean;
  scope: "all" | "specific";
  appliedTo?: string[];
  createdAt: string;
}

/** Sous-onglet Signatures - Gestion des signatures email. */
export default function SignatureTab({ domain, offers }: SignatureTabProps) {
  const { t } = useTranslation("web-cloud/emails/security");

  const [selectedSignature, setSelectedSignature] = useState<string | null>(null);

  // Mock data - remplacer par appel API
  const signatures: EmailSignature[] = useMemo(() => [
    {
      id: "1",
      name: "Signature entreprise",
      content: "Cordialement,\n\nL'équipe Example\nwww.example.com\n+33 1 23 45 67 89",
      htmlContent: `<p>Cordialement,</p><p><strong>L'équipe Example</strong><br>www.example.com<br>+33 1 23 45 67 89</p>`,
      isDefault: true,
      scope: "all",
      createdAt: "2023-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Signature commercial",
      content: "Bien cordialement,\n\nService Commercial\ncommercial@example.com",
      htmlContent: `<p>Bien cordialement,</p><p>Service Commercial<br><a href="mailto:commercial@example.com">commercial@example.com</a></p>`,
      isDefault: false,
      scope: "specific",
      appliedTo: ["sales@example.com", "commercial@example.com"],
      createdAt: "2023-06-15T00:00:00Z",
    },
    {
      id: "3",
      name: "Disclaimer légal",
      content: "Ce message et ses pièces jointes sont confidentiels...",
      htmlContent: `<p style="font-size: 10px; color: #666;">Ce message et ses pièces jointes sont confidentiels...</p>`,
      isDefault: false,
      scope: "all",
      createdAt: "2022-03-01T00:00:00Z",
    },
  ], []);

  const handleCreate = () => {
    console.log("Create signature");
  };

  const handleEdit = (signature: EmailSignature) => {
    console.log("Edit signature", signature.id);
  };

  const handleDelete = (signature: EmailSignature) => {
    console.log("Delete signature", signature.id);
  };

  const handleSetDefault = (signature: EmailSignature) => {
    console.log("Set as default", signature.id);
  };

  const handlePreview = (signature: EmailSignature) => {
    setSelectedSignature(selectedSignature === signature.id ? null : signature.id);
  };

  // Check if signatures are available for these offers
  const hasSignatures = offers.some((o) => ["exchange", "email-pro"].includes(o));

  if (!hasSignatures) {
    return (
      <div className="emails-empty">
        <div className="emails-empty-icon">✒️</div>
        <h3 className="emails-empty-title">{t("signature.notAvailable.title")}</h3>
        <p className="emails-empty-text">{t("signature.notAvailable.description")}</p>
      </div>
    );
  }

  return (
    <div className="signature-tab">
      {/* Toolbar */}
      <div className="emails-toolbar">
        <div className="emails-toolbar-left">
          <button className="btn btn-primary" onClick={handleCreate}>
            + {t("signature.actions.create")}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="info-banner">
        <span className="info-icon">ℹ</span>
        <p>{t("signature.info")}</p>
      </div>

      {/* Signatures list */}
      {signatures.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">✒️</div>
          <h3 className="emails-empty-title">{t("signature.empty.title")}</h3>
          <p className="emails-empty-text">{t("signature.empty.description")}</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            + {t("signature.actions.create")}
          </button>
        </div>
      ) : (
        <div className="signatures-list">
          {signatures.map((signature) => (
            <div key={signature.id} className={`signature-card ${selectedSignature === signature.id ? "expanded" : ""}`}>
              <div className="signature-header">
                <div className="signature-info">
                  <h4 className="signature-name">
                    {signature.name}
                    {signature.isDefault && (
                      <span className="default-badge">{t("signature.default")}</span>
                    )}
                  </h4>
                  <span className="signature-scope">
                    {signature.scope === "all"
                      ? t("signature.scopeAll")
                      : `${t("signature.scopeSpecific")}: ${signature.appliedTo?.join(", ")}`}
                  </span>
                </div>
                <div className="signature-actions">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handlePreview(signature)}
                  >
                    {selectedSignature === signature.id ? t("signature.actions.hidePreview") : t("signature.actions.preview")}
                  </button>
                  {!signature.isDefault && (
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleSetDefault(signature)}
                    >
                      {t("signature.actions.setDefault")}
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleEdit(signature)}
                  >
                    {t("signature.actions.edit")}
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-danger"
                    onClick={() => handleDelete(signature)}
                  >
                    {t("signature.actions.delete")}
                  </button>
                </div>
              </div>

              {/* Preview */}
              {selectedSignature === signature.id && (
                <div className="signature-preview">
                  <div className="preview-tabs">
                    <span className="preview-tab active">{t("signature.preview.html")}</span>
                    <span className="preview-tab">{t("signature.preview.text")}</span>
                  </div>
                  <div
                    className="preview-content"
                    dangerouslySetInnerHTML={{ __html: signature.htmlContent }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
