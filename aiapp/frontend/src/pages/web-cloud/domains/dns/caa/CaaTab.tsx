// ============================================================
// CAA TAB - Wizard CAA configuration
// Groupe: DNS
// ============================================================

import "./CaaTab.css";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { caaService, type CaaRecord } from "./CaaTab.service";

interface CaaTabProps {
  zoneName: string;
}

const COMMON_CAS = [
  { name: "Let's Encrypt", value: "letsencrypt.org" },
  { name: "DigiCert", value: "digicert.com" },
  { name: "Sectigo", value: "sectigo.com" },
  { name: "GlobalSign", value: "globalsign.com" },
  { name: "GoDaddy", value: "godaddy.com" },
];

export const CaaTab: React.FC<CaaTabProps> = ({ zoneName }) => {
  const { t } = useTranslation("web-cloud/domains/caa");
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<CaaRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCa, setNewCa] = useState("");
  const [tagType, setTagType] = useState<"issue" | "issuewild" | "iodef">("issue");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRecords();
  }, [zoneName]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await caaService.getCaaRecords(zoneName);
      setRecords(data);
    } catch (err) {
      console.error("Failed to load CAA:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newCa) return;
    setSaving(true);
    try {
      await caaService.createCaa(zoneName, tagType, newCa);
      await loadRecords();
      setShowAddForm(false);
      setNewCa("");
    } catch (err) {
      console.error("Failed to add CAA:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record: CaaRecord) => {
    if (!confirm(t("confirm.delete"))) return;
    try {
      await caaService.deleteCaa(zoneName, record.id);
      await loadRecords();
    } catch (err) {
      console.error("Failed to delete CAA:", err);
    }
  };

  if (loading) {
    return <div className="caa-loading"><div className="caa-skeleton" /></div>;
  }

  return (
    <div className="caa-container">
      <div className="caa-header">
        <div>
          <h3>{t("title")}</h3>
          <p className="caa-description">{t("description")}</p>
        </div>
        <button className="caa-btn primary" onClick={() => setShowAddForm(true)}>
          {t("action.add")}
        </button>
      </div>

      {showAddForm && (
        <div className="caa-form">
          <div className="caa-form-row">
            <div className="caa-form-field">
              <label>{t("label.tagType")}</label>
              <select value={tagType} onChange={(e) => setTagType(e.target.value as typeof tagType)}>
                <option value="issue">issue</option>
                <option value="issuewild">issuewild</option>
                <option value="iodef">iodef</option>
              </select>
            </div>
            <div className="caa-form-field flex-1">
              <label>{t("label.value")}</label>
              <input
                type="text"
                value={newCa}
                onChange={(e) => setNewCa(e.target.value)}
                placeholder={tagType === "iodef" ? "mailto:security@example.com" : "letsencrypt.org"}
              />
            </div>
          </div>
          <div className="caa-quick-add">
            <span>{t("label.quickAdd")}:</span>
            {COMMON_CAS.map((ca) => (
              <button key={ca.value} className="caa-quick-btn" onClick={() => setNewCa(ca.value)}>
                {ca.name}
              </button>
            ))}
          </div>
          <div className="caa-form-actions">
            <button className="caa-btn secondary" onClick={() => setShowAddForm(false)}>
              {t("action.cancel")}
            </button>
            <button className="caa-btn primary" onClick={handleAdd} disabled={saving}>
              {saving ? t("action.saving") : t("action.create")}
            </button>
          </div>
        </div>
      )}

      {records.length > 0 ? (
        <div className="caa-list">
          {records.map((record) => (
            <div key={record.id} className="caa-record">
              <div className="caa-record-info">
                <span className="caa-record-tag">{record.tag}</span>
                <span className="caa-record-value">{record.value}</span>
              </div>
              <button className="caa-btn danger-text" onClick={() => handleDelete(record)}>
                {t("action.delete")}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="caa-empty">
          <p>{t("empty.title")}</p>
          <p className="caa-empty-hint">{t("empty.hint")}</p>
        </div>
      )}
    </div>
  );
};

export default CaaTab;
