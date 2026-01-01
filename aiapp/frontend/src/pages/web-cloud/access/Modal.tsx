// ============================================================
// MODAL - Composant modal de base pour connections
// ============================================================

import { ReactNode, useEffect } from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "small" | "medium" | "large";
}

export function Modal({ isOpen, onClose, title, children, footer, size = "medium" }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="conn-modal-overlay" onClick={onClose}>
      <div
        className={`conn-modal-container conn-modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="conn-modal-header">
          <h2 className="conn-modal-title">{title}</h2>
          <button className="conn-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="conn-modal-body">
          {children}
        </div>
        {footer && (
          <div className="conn-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
