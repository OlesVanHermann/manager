// ============================================================
// OTB REMOTE ADD MODAL - Ajouter un accès distant
// ============================================================

import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../connections/Modal";
import "./OtbModals.css";

type Protocol = "ssh" | "http" | "https" | "tcp";

interface OtbRemoteAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  otbServiceName: string;
  otbHostname: string;
  onAdd: (data: {
    name: string;
    protocol: Protocol;
    localIp: string;
    localPort: number;
    exposedPort?: number;
  }) => void;
}

export function OtbRemoteAddModal({ isOpen, onClose, otbServiceName: _otbServiceName, otbHostname, onAdd }: OtbRemoteAddModalProps) {
  const { t } = useTranslation("web-cloud/access/overthebox/modals");
  const [name, setName] = useState("");
  const [protocol, setProtocol] = useState<Protocol>("ssh");
  const [localIp, setLocalIp] = useState("");
  const [localPort, setLocalPort] = useState("");
  const [exposedPort, setExposedPort] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const protocols: Protocol[] = ["ssh", "http", "https", "tcp"];

  const isValidIp = useCallback((ip: string) => {
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(ip)) return false;
    const parts = ip.split(".").map(Number);
    return parts.every((part) => part >= 0 && part <= 255);
  }, []);

  const isValidPort = useCallback((port: string) => {
    const portNum = parseInt(port, 10);
    return !isNaN(portNum) && portNum >= 1 && portNum <= 65535;
  }, []);

  const isFormValid = useMemo(() => {
    return (
      name.trim() !== "" &&
      isValidIp(localIp) &&
      isValidPort(localPort) &&
      (exposedPort === "" || isValidPort(exposedPort))
    );
  }, [name, localIp, localPort, exposedPort, isValidIp, isValidPort]);

  const previewUrl = useMemo(() => {
    if (!localPort) return null;
    const port = exposedPort || "auto";
    return `${protocol}://${otbHostname}:${port}`;
  }, [protocol, otbHostname, exposedPort, localPort]);

  const handleCreate = useCallback(async () => {
    if (!isFormValid) return;
    setIsCreating(true);
    try {
      await onAdd({
        name: name.trim(),
        protocol,
        localIp,
        localPort: parseInt(localPort, 10),
        exposedPort: exposedPort ? parseInt(exposedPort, 10) : undefined,
      });
      onClose();
    } finally {
      setIsCreating(false);
    }
  }, [isFormValid, name, protocol, localIp, localPort, exposedPort, onAdd, onClose]);

  const handleClose = useCallback(() => {
    setName("");
    setProtocol("ssh");
    setLocalIp("");
    setLocalPort("");
    setExposedPort("");
    onClose();
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("remoteAdd.title")}
      size="medium"
      footer={
        <>
          <button className="conn-modal-btn conn-modal-btn-outline" onClick={handleClose}>
            {t("common.cancel")}
          </button>
          <button
            className="conn-modal-btn conn-modal-btn-primary"
            onClick={handleCreate}
            disabled={!isFormValid || isCreating}
          >
            {isCreating ? t("common.creating") : t("remoteAdd.submit")}
          </button>
        </>
      }
    >
      <div className="otb-modal-content">
        <p className="otb-modal-description">{t("remoteAdd.description")}</p>

        <div className="otb-form">
          <div className="otb-form-group">
            <label className="otb-form-label">{t("remoteAdd.name")} *</label>
            <input
              type="text"
              className="otb-form-input"
              placeholder={t("remoteAdd.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="otb-form-group">
            <label className="otb-form-label">{t("remoteAdd.protocol")}</label>
            <div className="otb-protocol-buttons">
              {protocols.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`otb-protocol-btn ${protocol === p ? "selected" : ""}`}
                  onClick={() => setProtocol(p)}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="otb-form-row">
            <div className="otb-form-group otb-form-ip">
              <label className="otb-form-label">{t("remoteAdd.localIp")} *</label>
              <input
                type="text"
                className={`otb-form-input ${localIp && !isValidIp(localIp) ? "invalid" : ""}`}
                placeholder="192.168.1.100"
                value={localIp}
                onChange={(e) => setLocalIp(e.target.value)}
              />
            </div>

            <div className="otb-form-group otb-form-port">
              <label className="otb-form-label">{t("remoteAdd.localPort")} *</label>
              <input
                type="number"
                className={`otb-form-input ${localPort && !isValidPort(localPort) ? "invalid" : ""}`}
                placeholder="22"
                value={localPort}
                onChange={(e) => setLocalPort(e.target.value)}
                min="1"
                max="65535"
              />
            </div>
          </div>

          <div className="otb-form-group">
            <label className="otb-form-label">
              {t("remoteAdd.exposedPort")}
              <span className="otb-form-hint">{t("remoteAdd.recommended")}</span>
            </label>
            <input
              type="number"
              className="otb-form-input otb-form-exposed-port"
              placeholder={t("remoteAdd.auto")}
              value={exposedPort}
              onChange={(e) => setExposedPort(e.target.value)}
              min="1"
              max="65535"
            />
          </div>
        </div>

        {previewUrl && (
          <div className="otb-info-box otb-preview-box">
            <span className="otb-info-icon">ℹ️</span>
            <div className="otb-preview-content">
              <span className="otb-preview-label">{t("remoteAdd.previewUrl")}</span>
              <span className="otb-preview-url">{previewUrl}</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
