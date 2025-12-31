// ============================================================
// NAT RULE MODAL - Ajouter/Modifier une règle NAT
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import { connectionsService } from "../connections.service";
import type { ModemNatRule } from "../connections.types";

interface NatRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: string;
  rule?: ModemNatRule;
  onSuccess: () => void;
}

export function NatRuleModal({ isOpen, onClose, connectionId, rule, onSuccess }: NatRuleModalProps) {
  const { t } = useTranslation("web-cloud/access/modals");
  const isEdit = !!rule;

  const [name, setName] = useState("");
  const [protocol, setProtocol] = useState<"TCP" | "UDP" | "TCP/UDP">("TCP");
  const [externalPort, setExternalPort] = useState("");
  const [internalIp, setInternalIp] = useState("");
  const [internalPort, setInternalPort] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (rule) {
      setName(rule.name);
      setProtocol(rule.protocol);
      setExternalPort(String(rule.externalPort));
      setInternalIp(rule.internalIp);
      setInternalPort(String(rule.internalPort));
      setEnabled(rule.enabled);
    } else {
      setName("");
      setProtocol("TCP");
      setExternalPort("");
      setInternalIp("");
      setInternalPort("");
      setEnabled(true);
    }
  }, [rule, isOpen]);

  const handleSubmit = async () => {
    if (!name || !externalPort || !internalIp || !internalPort) {
      setError(t("natRule.errorRequired"));
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await connectionsService.addModemNatRule(connectionId, {
        name,
        protocol,
        externalPort: parseInt(externalPort),
        internalIp,
        internalPort: parseInt(internalPort),
        enabled,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t("natRule.titleEdit") : t("natRule.titleAdd")}
      size="medium"
      footer={
        <>
          <button className="conn-modal-btn-secondary" onClick={onClose}>
            {t("cancel")}
          </button>
          <button className="conn-modal-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? t("saving") : t("save")}
          </button>
        </>
      }
    >
      <div className="conn-modal-field">
        <label className="conn-modal-label">{t("natRule.name")}</label>
        <input
          type="text"
          className="conn-modal-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("natRule.namePlaceholder")}
        />
      </div>

      <div className="conn-modal-row">
        <div className="conn-modal-field">
          <label className="conn-modal-label">{t("natRule.protocol")}</label>
          <select
            className="conn-modal-select"
            value={protocol}
            onChange={(e) => setProtocol(e.target.value as "TCP" | "UDP" | "TCP/UDP")}
          >
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
            <option value="TCP/UDP">TCP/UDP</option>
          </select>
        </div>
        <div className="conn-modal-field">
          <label className="conn-modal-label">{t("natRule.externalPort")}</label>
          <input
            type="number"
            className="conn-modal-input"
            value={externalPort}
            onChange={(e) => setExternalPort(e.target.value)}
            placeholder="80"
          />
        </div>
      </div>

      <div className="conn-modal-row">
        <div className="conn-modal-field">
          <label className="conn-modal-label">{t("natRule.internalIp")}</label>
          <input
            type="text"
            className="conn-modal-input"
            value={internalIp}
            onChange={(e) => setInternalIp(e.target.value)}
            placeholder="192.168.1.10"
          />
        </div>
        <div className="conn-modal-field">
          <label className="conn-modal-label">{t("natRule.internalPort")}</label>
          <input
            type="number"
            className="conn-modal-input"
            value={internalPort}
            onChange={(e) => setInternalPort(e.target.value)}
            placeholder="80"
          />
        </div>
      </div>

      <div className="conn-modal-field">
        <label className="conn-modal-checkbox">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          <span>{t("natRule.enabled")}</span>
        </label>
      </div>

      {error && <span className="conn-modal-error">{error}</span>}
    </Modal>
  );
}
