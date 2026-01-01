// ============================================================
// OTB LINK MODAL - Lier une connexion à un OverTheBox
// ============================================================

import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import "./OtbModals.css";

interface OtbItem {
  serviceName: string;
  name: string;
  connectionsCount: number;
  status: "active" | "inactive";
}

interface OtbLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionName: string;
  onLink: (otbServiceName: string) => void;
}

export function OtbLinkModal({ isOpen, onClose, connectionName: _connectionName, onLink }: OtbLinkModalProps) {
  const { t } = useTranslation("web-cloud/access/overthebox/modals");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOtb, setSelectedOtb] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  // Mock data - will be replaced by API call
  const otbList: OtbItem[] = [
    { serviceName: "otb-abc123xyz", name: "OTB Siège Paris", connectionsCount: 3, status: "active" },
    { serviceName: "otb-def456uvw", name: "OTB Agence Lyon", connectionsCount: 2, status: "active" },
    { serviceName: "otb-ghi789rst", name: "OTB Entrepôt Marseille", connectionsCount: 1, status: "active" },
  ];

  const filteredOtbs = useMemo(() => {
    if (!searchQuery.trim()) return otbList;
    const query = searchQuery.toLowerCase();
    return otbList.filter(
      (otb) =>
        otb.name.toLowerCase().includes(query) ||
        otb.serviceName.toLowerCase().includes(query)
    );
  }, [searchQuery, otbList]);

  const handleLink = useCallback(async () => {
    if (!selectedOtb) return;
    setIsLinking(true);
    try {
      await onLink(selectedOtb);
      onClose();
    } finally {
      setIsLinking(false);
    }
  }, [selectedOtb, onLink, onClose]);

  const handleClose = useCallback(() => {
    setSearchQuery("");
    setSelectedOtb(null);
    onClose();
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("link.title")}
      size="medium"
      footer={
        <>
          <button className="conn-modal-btn conn-modal-btn-outline" onClick={handleClose}>
            {t("common.cancel")}
          </button>
          <button
            className="conn-modal-btn conn-modal-btn-primary"
            onClick={handleLink}
            disabled={!selectedOtb || isLinking}
          >
            {isLinking ? t("common.linking") : t("link.submit")}
          </button>
        </>
      }
    >
      <div className="otb-modal-content">
        <p className="otb-modal-description">{t("link.description")}</p>

        <div className="otb-search-container">
          <input
            type="text"
            className="otb-search-input"
            placeholder={t("link.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="otb-list">
          {filteredOtbs.map((otb) => (
            <div
              key={otb.serviceName}
              className={`otb-list-item ${selectedOtb === otb.serviceName ? "selected" : ""}`}
              onClick={() => setSelectedOtb(otb.serviceName)}
            >
              <div className="otb-item-icon">📦</div>
              <div className="otb-item-content">
                <div className="otb-item-name">{otb.name}</div>
                <div className="otb-item-details">
                  {otb.serviceName} • {otb.connectionsCount}{" "}
                  {otb.connectionsCount === 1 ? t("link.connection") : t("link.connections")} •{" "}
                  <span className={`otb-status-${otb.status}`}>
                    {t(`link.status.${otb.status}`)}
                  </span>
                </div>
              </div>
              {selectedOtb === otb.serviceName && (
                <div className="otb-item-check">✓</div>
              )}
            </div>
          ))}
          {filteredOtbs.length === 0 && (
            <div className="otb-list-empty">{t("link.noResults")}</div>
          )}
        </div>

        <div className="otb-info-box">
          <span className="otb-info-icon">ℹ️</span>
          <span>{t("link.infoAggregation")}</span>
        </div>
      </div>
    </Modal>
  );
}
