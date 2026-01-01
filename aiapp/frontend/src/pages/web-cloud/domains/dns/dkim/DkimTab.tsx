// ============================================================
// DKIM TAB - Wizard DKIM configuration
// Groupe: DNS
// ============================================================

import "./DkimTab.css";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { dkimService, type DkimRecord } from "./DkimTab.service";

interface DkimTabProps {
  zoneName: string;
}

export const DkimTab: React.FC<DkimTabProps> = ({ zoneName }) => {
  const { t } = useTranslation("web-cloud/domains/dkim");
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<DkimRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selector, setSelector] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRecords();
  }, [zoneName]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await dkimService.getDkimRecords(zoneName);
      setRecords(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!selector || !publicKey) return;
    setSaving(true);
    try {
      await dkimService.createDkim(zoneName, selector, publicKey);
      await loadRecords();
      setShowAddForm(false);
      setSelector("");
      setPublicKey("");
    } catch (err) {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record: DkimRecord) => {
    if (!confirm(t("confirm.delete"))) return;
    try {
      await dkimService.deleteDkim(zoneName, record.id);
      await loadRecords();
    } catch (err) {
    }
  };

  if (loading) {
    return <div className="dkim-loading"><div className="dkim-skeleton" /></div>;
  }

  return (
    <div className="dkim-container">
      <div className="dkim-header">
        <div>
          <h3>{t("title")}</h3>
          <p className="dkim-description">{t("description")}</p>
        </div>
        <button className="dkim-btn primary" onClick={() => setShowAddForm(true)}>
          {t("action.add")}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="dkim-form">
          <div className="dkim-form-field">
            <label>{t("label.selector")}</label>
            <input
              type="text"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              placeholder="default, google, microsoft..."
            />
          </div>
          <div className="dkim-form-field">
            <label>{t("label.publicKey")}</label>
            <textarea
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              placeholder="MIGfMA0GCSqGSIb3DQEBAQUAA4..."
              rows={4}
            />
          </div>
          <div className="dkim-form-preview">
            <span className="dkim-preview-label">{t("label.preview")}</span>
            <code>{selector}._domainkey.{zoneName}</code>
          </div>
          <div className="dkim-form-actions">
            <button className="dkim-btn secondary" onClick={() => setShowAddForm(false)}>
              {t("action.cancel")}
            </button>
            <button className="dkim-btn primary" onClick={handleAdd} disabled={saving}>
              {saving ? t("action.saving") : t("action.create")}
            </button>
          </div>
        </div>
      )}

      {/* Records List */}
      {records.length > 0 ? (
        <div className="dkim-list">
          {records.map((record) => (
            <div key={record.id} className="dkim-record">
              <div className="dkim-record-info">
                <div className="dkim-record-selector">{record.selector}._domainkey</div>
                <code className="dkim-record-value">{record.target}</code>
              </div>
              <button className="dkim-btn danger-text" onClick={() => handleDelete(record)}>
                {t("action.delete")}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="dkim-empty">
          <p>{t("empty.title")}</p>
          <p className="dkim-empty-hint">{t("empty.hint")}</p>
        </div>
      )}
    </div>
  );
};

export default DkimTab;
