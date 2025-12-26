// ============================================================
import "./DsRecordsTab.css";
// TAB: DS RECORDS - DNSSEC détaillé
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { dsRecordsService } from "./DsRecordsTab.service";
import type { DsRecord, DsRecordCreate } from "../../domains.types";

interface Props { domain: string; }

const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const ALGORITHMS = [{ value: 5, label: "RSA/SHA-1" }, { value: 7, label: "RSASHA1-NSEC3-SHA1" }, { value: 8, label: "RSA/SHA-256" }, { value: 10, label: "RSA/SHA-512" }, { value: 13, label: "ECDSA/SHA-256" }, { value: 14, label: "ECDSA/SHA-384" }];

export function DsRecordsTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/dsrecords");
  const [records, setRecords] = useState<DsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ algorithm: 13, flags: 257, publicKey: "", tag: 0 });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<DsRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadRecords = useCallback(async () => {
    try { setLoading(true); setError(null); const ids = await dsRecordsService.listDsRecords(domain); if (ids.length === 0) { setRecords([]); return; } const data = await Promise.all(ids.map((id) => dsRecordsService.getDsRecord(domain, id))); setRecords(data); }
    catch (err) { if (String(err).includes("not supported") || String(err).includes("403")) setSupported(false); else setError(String(err)); }
    finally { setLoading(false); }
  }, [domain]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  const handleSave = async () => { try { setSaving(true); await dsRecordsService.createDsRecord(domain, form); setModalOpen(false); await loadRecords(); } catch (err) { alert(String(err)); } finally { setSaving(false); } };
  const handleDelete = async () => { if (!deleteConfirm) return; try { setDeleting(true); await dsRecordsService.deleteDsRecord(domain, deleteConfirm.id); setDeleteConfirm(null); await loadRecords(); } catch (err) { alert(String(err)); } finally { setDeleting(false); } };
  const getAlgorithmLabel = (a: number) => ALGORITHMS.find((x) => x.value === a)?.label || `Algorithm ${a}`;

  if (loading) return <div className="dsrecords-loading"><div className="dsrecords-skeleton" /></div>;

  return (
    <div className="dsrecords-tab">
      <div className="dsrecords-header"><div><h3>{t("title")}</h3><p className="dsrecords-description">{t("description")}</p></div></div>
      <div className="zone-layout">
        <div className="zone-main">
          {!supported && <div className="warning-banner"><span>⚠️</span><p>{t("notSupported")}</p></div>}
          {error && <div className="dsrecords-error-banner">{error}</div>}
          {supported && records.length === 0 && !error && <div className="dsrecords-info-banner"><span>ℹ️</span><p>{t("noRecords")}</p></div>}
          {records.length > 0 && <table className="dsrecords-table"><thead><tr><th>Tag</th><th>{t("algorithm")}</th><th>Flags</th><th>{t("publicKey")}</th><th>{t("status")}</th><th></th></tr></thead><tbody>{records.map((r) => <tr key={r.id}><td>{r.tag}</td><td>{getAlgorithmLabel(r.algorithm)}</td><td>{r.flags}</td><td className="dsrecords-font-mono" style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }} title={r.publicKey}>{r.publicKey.substring(0, 30)}...</td><td><span className={`dsrecords-badge ${r.status === "active" ? "success" : "warning"}`}>{r.status}</span></td><td><button className="btn-icon btn-icon-danger" onClick={() => setDeleteConfirm(r)}><TrashIcon /></button></td></tr>)}</tbody></table>}
        </div>
        <div className="zone-sidebar"><button className="btn-outline-full" onClick={() => setModalOpen(true)} disabled={!supported}>{t("modify")}</button><div className="sidebar-divider" /><div className="sidebar-guides"><h4>{t("guides")}</h4><details open><summary>DS Records</summary><ul><li><a href="https://docs.ovh.com/fr/domains/securiser-votre-domaine-avec-dnssec/" target="_blank" rel="noopener noreferrer">{t("documentation")}</a></li></ul></details></div></div>
      </div>
      {modalOpen && <div className="dsrecords-modal-overlay" onClick={() => setModalOpen(false)}><div className="dsrecords-modal-content" onClick={(e) => e.stopPropagation()}><div className="dsrecords-modal-header"><h3>{t("addRecord")}</h3><button className="dsrecords-btn-icon" onClick={() => setModalOpen(false)}><CloseIcon /></button></div><div className="dsrecords-modal-body"><div className="dsrecords-form-group"><label>Tag *</label><input type="number" value={form.tag} onChange={(e) => setForm({ ...form, tag: Number(e.target.value) })} className="dsrecords-input" /></div><div className="dsrecords-form-group"><label>{t("algorithm")} *</label><select value={form.algorithm} onChange={(e) => setForm({ ...form, algorithm: Number(e.target.value) })} className="dsrecords-input">{ALGORITHMS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}</select></div><div className="dsrecords-form-group"><label>Flags *</label><select value={form.flags} onChange={(e) => setForm({ ...form, flags: Number(e.target.value) })} className="dsrecords-input"><option value={256}>256 (ZSK)</option><option value={257}>257 (KSK)</option></select></div><div className="dsrecords-form-group"><label>{t("publicKey")} *</label><textarea value={form.publicKey} onChange={(e) => setForm({ ...form, publicKey: e.target.value })} className="dsrecords-input" rows={4} /></div></div><div className="dsrecords-modal-footer"><button className="btn-secondary" onClick={() => setModalOpen(false)}>{t("cancel")}</button><button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? t("saving") : t("save")}</button></div></div></div>}
      {deleteConfirm && <div className="dsrecords-modal-overlay" onClick={() => setDeleteConfirm(null)}><div className="dsrecords-modal-content modal-sm" onClick={(e) => e.stopPropagation()}><div className="dsrecords-modal-header"><h3>{t("confirmDelete")}</h3></div><div className="dsrecords-modal-body"><p>{t("confirmDeleteMessage")}</p><div className="delete-preview">Tag: <strong>{deleteConfirm.tag}</strong></div></div><div className="dsrecords-modal-footer"><button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>{t("cancel")}</button><button className="btn-danger" onClick={handleDelete} disabled={deleting}>{deleting ? t("deleting") : t("delete")}</button></div></div></div>}
    </div>
  );
}

export default DsRecordsTab;
