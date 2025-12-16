// ============================================================
// KYC TAB - Vérification d'identité avec upload de documents
// ============================================================

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as proceduresService from "../../../services/home.account.procedures";

// ============ TYPES ============

interface SelectedFile {
  file: File;
  preview: string;
  uploaded: boolean;
  error?: string;
}

type UploadStep = "status" | "select" | "uploading" | "done";

// ============ COMPOSANT ============

/** Affiche le statut KYC et permet l'upload de documents d'identité. */
export function KycTab() {
  const { t } = useTranslation('home/account/kyc');
  const { t: tCommon } = useTranslation('common');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<proceduresService.FraudStatus | null>(null);
  const [step, setStep] = useState<UploadStep>("status");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => { loadStatus(); }, []);

  // ---------- LOADERS ----------
  const loadStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await proceduresService.getFraudStatus();
      setStatus(data);
    } catch (err) {
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
    const newFiles: SelectedFile[] = Array.from(files).map(file => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      uploaded: false,
    }));
    setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 5));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;
    const newFiles: SelectedFile[] = Array.from(files).map(file => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      uploaded: false,
    }));
    setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 5));
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => {
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
      // 1. Initier la procédure et obtenir les liens d'upload
      const { uploadLinks } = await proceduresService.initFraudProcedure(selectedFiles.length);

      // 2. Uploader chaque fichier
      for (let i = 0; i < selectedFiles.length; i++) {
        const sf = selectedFiles[i];
        const link = uploadLinks[i];
        if (!link) {
          throw new Error(t('upload.errors.noLink'));
        }
        try {
          await proceduresService.uploadDocument(link, sf.file);
          setSelectedFiles(prev => {
            const updated = [...prev];
            updated[i] = { ...updated[i], uploaded: true };
            return updated;
          });
        } catch (err) {
          setSelectedFiles(prev => {
            const updated = [...prev];
            updated[i] = { ...updated[i], error: err instanceof Error ? err.message : "Upload failed" };
            return updated;
          });
          throw err;
        }
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      // 3. Finaliser la procédure
      await proceduresService.finalizeFraudProcedure();
      setStep("done");
      await loadStatus();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : t('upload.errors.generic'));
      setStep("select");
    }
  };

  const handleCancel = () => {
    selectedFiles.forEach(sf => { if (sf.preview) URL.revokeObjectURL(sf.preview); });
    setSelectedFiles([]);
    setStep("status");
    setUploadError(null);
  };

  // ---------- HELPERS ----------
  const getStatusInfo = (statusVal: string) => {
    const map: Record<string, { label: string; className: string; description: string }> = {
      required: { label: t('status.required.label'), className: "badge-warning", description: t('status.required.description') },
      pending: { label: t('status.pending.label'), className: "badge-info", description: t('status.pending.description') },
      open: { label: t('status.open.label'), className: "badge-info", description: t('status.open.description') },
      closed: { label: t('status.closed.label'), className: "badge-success", description: t('status.closed.description') },
      none: { label: t('status.none.label'), className: "badge-neutral", description: t('status.none.description') },
    };
    return map[statusVal] || map.none;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="tab-content"><div className="loading-state"><div className="spinner"></div><p>{t('loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-content"><div className="error-banner">{error}<button onClick={loadStatus} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  const statusInfo = getStatusInfo(status?.status || "none");

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </div>

      {/* Statut actuel */}
      <div className="kyc-status-card" style={{ padding: "2rem", background: "var(--color-background-subtle)", borderRadius: "12px", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <span className={"status-badge " + statusInfo.className} style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>{statusInfo.label}</span>
        </div>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>{statusInfo.description}</p>

        {/* Step: status - Bouton pour commencer */}
        {step === "status" && status?.status === "required" && (
          <button onClick={handleStartUpload} className="btn btn-primary">{t('upload.startButton')}</button>
        )}

        {/* Step: select - Sélection des fichiers */}
        {step === "select" && (
          <div className="kyc-upload-section">
            <h4 style={{ marginBottom: "1rem" }}>{t('upload.selectTitle')}</h4>
            <div
              className="drop-zone"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              style={{ border: "2px dashed var(--color-border)", borderRadius: "8px", padding: "2rem", textAlign: "center", cursor: "pointer", marginBottom: "1rem" }}
            >
              <p style={{ color: "var(--color-text-secondary)", marginBottom: "0.5rem" }}>{t('upload.dropZone')}</p>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-tertiary)" }}>{t('upload.formats')}</p>
              <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple onChange={handleFileSelect} style={{ display: "none" }} />
            </div>

            {/* Liste des fichiers sélectionnés */}
            {selectedFiles.length > 0 && (
              <div className="selected-files" style={{ marginBottom: "1rem" }}>
                {selectedFiles.map((sf, idx) => (
                  <div key={idx} className="file-item" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem", background: "var(--color-background)", borderRadius: "6px", marginBottom: "0.5rem" }}>
                    {sf.preview ? (
                      <img src={sf.preview} alt="" style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "4px" }} />
                    ) : (
                      <div style={{ width: "48px", height: "48px", background: "var(--color-border)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>PDF</div>
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: "0.9rem" }}>{sf.file.name}</p>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-text-tertiary)" }}>{formatFileSize(sf.file.size)}</p>
                    </div>
                    {sf.uploaded && <span className="status-badge badge-success">✓</span>}
                    {sf.error && <span className="status-badge badge-error">✗</span>}
                    <button onClick={() => handleRemoveFile(idx)} className="btn btn-sm btn-secondary">{tCommon('actions.delete')}</button>
                  </div>
                ))}
              </div>
            )}

            {uploadError && <div className="error-banner" style={{ marginBottom: "1rem" }}>{uploadError}</div>}

            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={handleCancel} className="btn btn-secondary">{tCommon('actions.cancel')}</button>
              <button onClick={handleSubmitDocuments} className="btn btn-primary" disabled={selectedFiles.length === 0}>{t('upload.submitButton')} ({selectedFiles.length})</button>
            </div>
          </div>
        )}

        {/* Step: uploading - Progress */}
        {step === "uploading" && (
          <div className="kyc-uploading-section">
            <h4 style={{ marginBottom: "1rem" }}>{t('upload.uploading')}</h4>
            <div style={{ background: "var(--color-border)", borderRadius: "4px", height: "8px", marginBottom: "1rem" }}>
              <div style={{ background: "var(--color-primary)", borderRadius: "4px", height: "100%", width: uploadProgress + "%", transition: "width 0.3s" }}></div>
            </div>
            <p style={{ color: "var(--color-text-secondary)" }}>{Math.round(uploadProgress)}%</p>
          </div>
        )}

        {/* Step: done - Succès */}
        {step === "done" && (
          <div className="kyc-done-section">
            <h4 style={{ marginBottom: "1rem", color: "var(--color-success)" }}>{t('upload.successTitle')}</h4>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "1rem" }}>{t('upload.successMessage')}</p>
            <button onClick={() => setStep("status")} className="btn btn-primary">{tCommon('actions.close')}</button>
          </div>
        )}

        {status?.status === "pending" && (
          <p style={{ color: "var(--color-text-secondary)" }}>{t('pending.processingTime')}</p>
        )}

        {status?.status === "none" && step === "status" && (
          <p style={{ color: "var(--color-text-secondary)" }}>{t('none.futureNotice')}</p>
        )}
      </div>

      {/* Info box */}
      <div className="kyc-info" style={{ padding: "1.5rem", border: "1px solid var(--color-border)", borderRadius: "8px", background: "var(--color-background)" }}>
        <h4 style={{ marginBottom: "0.5rem" }}>{t('info.title')}</h4>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: "1rem" }}>{t('info.description')}</p>
        <a href="https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", fontSize: "0.9rem" }}>{t('info.privacyLink')}</a>
      </div>
    </div>
  );
}
