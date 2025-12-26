// ============================================================
// KYC TAB - Vérification d'identité avec upload de documents
// Styles: ./KycTab.css (préfixe .account-kyc-)
// Service: ./KycTab.service.ts (ISOLÉ)
// ============================================================

import "./KycTab.css";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as kycService from "./KycTab.service";

// ============ TYPES LOCAUX ============

interface SelectedFile {
  file: File;
  preview: string;
  uploaded: boolean;
  error?: string;
}

type UploadStep = "status" | "select" | "uploading" | "done";

// ============ COMPOSANT ============

export function KycTab() {
  const { t } = useTranslation("general/account/kyc");
  const { t: tCommon } = useTranslation("common");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<kycService.FraudStatus | null>(null);
  const [step, setStep] = useState<UploadStep>("status");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadStatus();
  }, []);

  // ---------- LOADERS ----------
  const loadStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await kycService.getFraudStatus();
      setStatus(data);
    } catch {
      setStatus({ status: "none" });
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleStartUpload = () => {
    setStep("select");
    setSelectedFiles([]);
    setUploadError(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: SelectedFile[] = Array.from(files).map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      uploaded: false,
    }));
    setSelectedFiles((prev) => [...prev, ...newFiles].slice(0, 5));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;
    const newFiles: SelectedFile[] = Array.from(files).map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      uploaded: false,
    }));
    setSelectedFiles((prev) => [...prev, ...newFiles].slice(0, 5));
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => {
      const updated = [...prev];
      if (updated[index].preview) URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmitDocuments = async () => {
    if (selectedFiles.length === 0) return;
    setStep("uploading");
    setUploadProgress(0);
    setUploadError(null);

    try {
      const { uploadLinks } = await kycService.initFraudProcedure(selectedFiles.length);

      for (let i = 0; i < selectedFiles.length; i++) {
        const sf = selectedFiles[i];
        const link = uploadLinks[i];
        if (!link) throw new Error(t("upload.errors.noLink"));

        try {
          await kycService.uploadDocument(link, sf.file);
          setSelectedFiles((prev) => {
            const updated = [...prev];
            updated[i] = { ...updated[i], uploaded: true };
            return updated;
          });
        } catch (err) {
          setSelectedFiles((prev) => {
            const updated = [...prev];
            updated[i] = { ...updated[i], error: err instanceof Error ? err.message : "Upload failed" };
            return updated;
          });
          throw err;
        }
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      await kycService.finalizeFraudProcedure();
      setStep("done");
      await loadStatus();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : t("upload.errors.generic"));
      setStep("select");
    }
  };

  const handleCancel = () => {
    selectedFiles.forEach((sf) => {
      if (sf.preview) URL.revokeObjectURL(sf.preview);
    });
    setSelectedFiles([]);
    setStep("status");
    setUploadError(null);
  };

  // ---------- HELPERS ----------
  const getStatusBadgeClass = (statusVal: string) => {
    const map: Record<string, string> = {
      required: "account-kyc-badge-warning",
      pending: "account-kyc-badge-info",
      open: "account-kyc-badge-info",
      closed: "account-kyc-badge-success",
      none: "account-kyc-badge-neutral",
      ok: "account-kyc-badge-success",
      refused: "account-kyc-badge-error",
    };
    return map[statusVal] || "account-kyc-badge-neutral";
  };

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div className="account-kyc-content">
        <div className="account-kyc-loading">
          <div className="account-kyc-spinner"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  // ---------- ERROR ----------
  if (error) {
    return (
      <div className="account-kyc-content">
        <div className="account-kyc-error">
          <p>{error}</p>
          <button onClick={loadStatus} className="account-kyc-btn kyc-btn-primary">
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  // ---------- RENDER ----------
  const currentStatus = status?.status || "none";

  return (
    <div className="account-kyc-content">
      <div className="account-kyc-header">
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>
      </div>

      {/* Status Card */}
      <div className="account-kyc-status-card">
        <div className="account-kyc-status-header">
          <span className={`kyc-badge ${getStatusBadgeClass(currentStatus)}`}>
            {t(`status.${currentStatus}.label`, { defaultValue: kycService.getStatusLabel(currentStatus) })}
          </span>
        </div>
        <p className="account-kyc-status-description">
          {t(`status.${currentStatus}.description`, { defaultValue: "" })}
        </p>

        {/* Step: status */}
        {step === "status" && currentStatus === "required" && (
          <button onClick={handleStartUpload} className="account-kyc-btn kyc-btn-primary">
            {t("upload.startButton")}
          </button>
        )}

        {step === "status" && currentStatus === "pending" && (
          <p className="account-kyc-status-notice">{t("pending.processingTime")}</p>
        )}

        {step === "status" && currentStatus === "none" && (
          <p className="account-kyc-status-notice">{t("none.futureNotice")}</p>
        )}

        {/* Step: select */}
        {step === "select" && (
          <div className="account-kyc-upload-section">
            <h4 className="account-kyc-upload-title">{t("upload.selectTitle")}</h4>

            <div
              className="account-kyc-drop-zone"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <p className="account-kyc-drop-zone-text">{t("upload.dropZone")}</p>
              <p className="account-kyc-drop-zone-hint">{t("upload.formats")}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="account-kyc-files-list">
                {selectedFiles.map((sf, idx) => (
                  <div key={idx} className="account-kyc-file-item">
                    {sf.preview ? (
                      <img src={sf.preview} alt="" className="account-kyc-file-preview" />
                    ) : (
                      <div className="account-kyc-file-placeholder">PDF</div>
                    )}
                    <div className="account-kyc-file-info">
                      <p className="account-kyc-file-name">{sf.file.name}</p>
                      <p className="account-kyc-file-size">{kycService.formatFileSize(sf.file.size)}</p>
                    </div>
                    {sf.uploaded && <span className="account-kyc-badge kyc-badge-success kyc-badge-sm">✓</span>}
                    {sf.error && <span className="account-kyc-badge kyc-badge-error kyc-badge-sm">✗</span>}
                    <button onClick={() => handleRemoveFile(idx)} className="account-kyc-btn kyc-btn-secondary kyc-btn-sm">
                      {tCommon("actions.delete")}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadError && <div className="account-kyc-error-banner">{uploadError}</div>}

            <div className="account-kyc-upload-actions">
              <button onClick={handleCancel} className="account-kyc-btn kyc-btn-secondary">
                {tCommon("actions.cancel")}
              </button>
              <button
                onClick={handleSubmitDocuments}
                className="account-kyc-btn kyc-btn-primary"
                disabled={selectedFiles.length === 0}
              >
                {t("upload.submitButton")} ({selectedFiles.length})
              </button>
            </div>
          </div>
        )}

        {/* Step: uploading */}
        {step === "uploading" && (
          <div className="account-kyc-progress-section">
            <h4 className="account-kyc-progress-title">{t("upload.uploading")}</h4>
            <div className="account-kyc-progress-bar">
              <div className="account-kyc-progress-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <p className="account-kyc-progress-text">{Math.round(uploadProgress)}%</p>
          </div>
        )}

        {/* Step: done */}
        {step === "done" && (
          <div className="account-kyc-success-section">
            <h4 className="account-kyc-success-title">{t("upload.successTitle")}</h4>
            <p className="account-kyc-success-message">{t("upload.successMessage")}</p>
            <button onClick={() => setStep("status")} className="account-kyc-btn kyc-btn-primary">
              {tCommon("actions.close")}
            </button>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="account-kyc-info-box">
        <h4 className="account-kyc-info-title">{t("info.title")}</h4>
        <p className="account-kyc-info-description">{t("info.description")}</p>
        <a
          href="https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          className="account-kyc-info-link"
        >
          {t("info.privacyLink")}
        </a>
      </div>
    </div>
  );
}
