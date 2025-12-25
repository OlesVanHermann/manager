// ============================================================
// KYC TAB - Vérification d'identité avec upload de documents
// Styles: ./KycTab.css (préfixe .kyc-)
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

export default function KycTab() {
  const { t } = useTranslation("home/account/kyc");
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
      required: "kyc-badge-warning",
      pending: "kyc-badge-info",
      open: "kyc-badge-info",
      closed: "kyc-badge-success",
      none: "kyc-badge-neutral",
      ok: "kyc-badge-success",
      refused: "kyc-badge-error",
    };
    return map[statusVal] || "kyc-badge-neutral";
  };

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div className="kyc-content">
        <div className="kyc-loading">
          <div className="kyc-spinner"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  // ---------- ERROR ----------
  if (error) {
    return (
      <div className="kyc-content">
        <div className="kyc-error">
          <p>{error}</p>
          <button onClick={loadStatus} className="kyc-btn kyc-btn-primary">
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  // ---------- RENDER ----------
  const currentStatus = status?.status || "none";

  return (
    <div className="kyc-content">
      <div className="kyc-header">
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>
      </div>

      {/* Status Card */}
      <div className="kyc-status-card">
        <div className="kyc-status-header">
          <span className={`kyc-badge ${getStatusBadgeClass(currentStatus)}`}>
            {t(`status.${currentStatus}.label`, { defaultValue: kycService.getStatusLabel(currentStatus) })}
          </span>
        </div>
        <p className="kyc-status-description">
          {t(`status.${currentStatus}.description`, { defaultValue: "" })}
        </p>

        {/* Step: status */}
        {step === "status" && currentStatus === "required" && (
          <button onClick={handleStartUpload} className="kyc-btn kyc-btn-primary">
            {t("upload.startButton")}
          </button>
        )}

        {step === "status" && currentStatus === "pending" && (
          <p className="kyc-status-notice">{t("pending.processingTime")}</p>
        )}

        {step === "status" && currentStatus === "none" && (
          <p className="kyc-status-notice">{t("none.futureNotice")}</p>
        )}

        {/* Step: select */}
        {step === "select" && (
          <div className="kyc-upload-section">
            <h4 className="kyc-upload-title">{t("upload.selectTitle")}</h4>

            <div
              className="kyc-drop-zone"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <p className="kyc-drop-zone-text">{t("upload.dropZone")}</p>
              <p className="kyc-drop-zone-hint">{t("upload.formats")}</p>
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
              <div className="kyc-files-list">
                {selectedFiles.map((sf, idx) => (
                  <div key={idx} className="kyc-file-item">
                    {sf.preview ? (
                      <img src={sf.preview} alt="" className="kyc-file-preview" />
                    ) : (
                      <div className="kyc-file-placeholder">PDF</div>
                    )}
                    <div className="kyc-file-info">
                      <p className="kyc-file-name">{sf.file.name}</p>
                      <p className="kyc-file-size">{kycService.formatFileSize(sf.file.size)}</p>
                    </div>
                    {sf.uploaded && <span className="kyc-badge kyc-badge-success kyc-badge-sm">✓</span>}
                    {sf.error && <span className="kyc-badge kyc-badge-error kyc-badge-sm">✗</span>}
                    <button onClick={() => handleRemoveFile(idx)} className="kyc-btn kyc-btn-secondary kyc-btn-sm">
                      {tCommon("actions.delete")}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadError && <div className="kyc-error-banner">{uploadError}</div>}

            <div className="kyc-upload-actions">
              <button onClick={handleCancel} className="kyc-btn kyc-btn-secondary">
                {tCommon("actions.cancel")}
              </button>
              <button
                onClick={handleSubmitDocuments}
                className="kyc-btn kyc-btn-primary"
                disabled={selectedFiles.length === 0}
              >
                {t("upload.submitButton")} ({selectedFiles.length})
              </button>
            </div>
          </div>
        )}

        {/* Step: uploading */}
        {step === "uploading" && (
          <div className="kyc-progress-section">
            <h4 className="kyc-progress-title">{t("upload.uploading")}</h4>
            <div className="kyc-progress-bar">
              <div className="kyc-progress-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <p className="kyc-progress-text">{Math.round(uploadProgress)}%</p>
          </div>
        )}

        {/* Step: done */}
        {step === "done" && (
          <div className="kyc-success-section">
            <h4 className="kyc-success-title">{t("upload.successTitle")}</h4>
            <p className="kyc-success-message">{t("upload.successMessage")}</p>
            <button onClick={() => setStep("status")} className="kyc-btn kyc-btn-primary">
              {tCommon("actions.close")}
            </button>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="kyc-info-box">
        <h4 className="kyc-info-title">{t("info.title")}</h4>
        <p className="kyc-info-description">{t("info.description")}</p>
        <a
          href="https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          className="kyc-info-link"
        >
          {t("info.privacyLink")}
        </a>
      </div>
    </div>
  );
}
