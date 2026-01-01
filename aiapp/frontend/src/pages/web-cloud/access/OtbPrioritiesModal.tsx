// ============================================================
// OTB PRIORITIES MODAL - Réorganiser les priorités des connexions
// ============================================================

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import "./OtbModals.css";

interface OtbConnection {
  serviceName: string;
  name: string;
  downloadSpeed: number;
  uploadSpeed: number;
  priority: number;
}

interface OtbPrioritiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  connections: OtbConnection[];
  onApply: (priorities: { serviceName: string; priority: number }[]) => void;
}

export function OtbPrioritiesModal({ isOpen, onClose, connections, onApply }: OtbPrioritiesModalProps) {
  const { t } = useTranslation("web-cloud/access/overthebox/modals");
  const [orderedConnections, setOrderedConnections] = useState<OtbConnection[]>(
    [...connections].sort((a, b) => a.priority - b.priority)
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrder = [...orderedConnections];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    setOrderedConnections(newOrder);
    setDraggedIndex(index);
  }, [draggedIndex, orderedConnections]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const handleApply = useCallback(async () => {
    setIsApplying(true);
    try {
      const priorities = orderedConnections.map((conn, index) => ({
        serviceName: conn.serviceName,
        priority: index + 1,
      }));
      await onApply(priorities);
      onClose();
    } finally {
      setIsApplying(false);
    }
  }, [orderedConnections, onApply, onClose]);

  const handleClose = useCallback(() => {
    setOrderedConnections([...connections].sort((a, b) => a.priority - b.priority));
    onClose();
  }, [connections, onClose]);

  const formatSpeed = (mbps: number) => {
    return mbps >= 1000 ? `${(mbps / 1000).toFixed(1)} Gbps` : `${mbps} Mbps`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("priorities.title")}
      size="medium"
      footer={
        <>
          <button className="conn-modal-btn conn-modal-btn-outline" onClick={handleClose}>
            {t("common.cancel")}
          </button>
          <button
            className="conn-modal-btn conn-modal-btn-primary"
            onClick={handleApply}
            disabled={isApplying}
          >
            {isApplying ? t("common.applying") : t("priorities.submit")}
          </button>
        </>
      }
    >
      <div className="otb-modal-content">
        <p className="otb-modal-description">{t("priorities.description")}</p>

        <div className="otb-priorities-list">
          {orderedConnections.map((conn, index) => (
            <div
              key={conn.serviceName}
              className={`otb-priority-item ${draggedIndex === index ? "dragging" : ""}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="otb-drag-handle">⋮⋮</div>
              <div className={`otb-priority-badge ${index === 0 ? "primary" : "secondary"}`}>
                {index + 1}
              </div>
              <div className="otb-priority-content">
                <div className="otb-priority-name">{conn.name}</div>
                <div className="otb-priority-details">
                  {formatSpeed(conn.downloadSpeed)} ↓ / {formatSpeed(conn.uploadSpeed)} ↑ •{" "}
                  <span className={index === 0 ? "text-primary" : "text-muted"}>
                    {index === 0 ? t("priorities.main") : t("priorities.backup")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="otb-info-box">
          <span className="otb-info-icon">ℹ️</span>
          <div className="otb-info-text">
            <div>{t("priorities.infoFailover1")}</div>
            <div>{t("priorities.infoFailover2")}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
