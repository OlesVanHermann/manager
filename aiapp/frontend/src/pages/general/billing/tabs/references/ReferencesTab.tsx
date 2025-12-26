// ============================================================
// REFERENCES TAB - Composant ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as referencesService from "./ReferencesTab.service";
import type { TabProps } from "../../billing.types";
import { formatDateLong, formatDateInput, isNotFoundError } from "./ReferencesTab.helpers";
import { EditIcon, PauseIcon, PlayIcon, TagIcon } from "./ReferencesTab.icons";
import "./ReferencesTab.css";

export function ReferencesTab({ credentials }: TabProps) {
  const { t } = useTranslation("general/billing/references");
  const { t: tCommon } = useTranslation("common");
  const [references, setReferences] = useState<referencesService.PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRef, setEditingRef] = useState<referencesService.PurchaseOrder | null>(null);
  const [formData, setFormData] = useState({ reference: "", startDate: "", endDate: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadReferences(); }, []);

  const loadReferences = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await referencesService.getPurchaseOrders();
      setReferences(data);
    } catch (err) {
      if (isNotFoundError(err)) { setReferences([]); }
      else { setError(err instanceof Error ? err.message : t("errors.loadError")); }
    } finally {
      setLoading(false);
    }
  };

  const getDisplayStatus = (ref: referencesService.PurchaseOrder): "actif" | "inactif" | "desactivate" => {
    if (!ref.active) return "desactivate";
    const now = new Date();
    const start = new Date(ref.startDate);
    const end = ref.endDate ? new Date(ref.endDate) : null;
    if (end) {
      if (now >= start && now < end) return "actif";
      return "inactif";
    }
    if (now >= start) return "actif";
    return "inactif";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "actif": return <span className="billing-references-badge references-badge-success">{t("references.status.active")}</span>;
      case "inactif": return <span className="billing-references-badge references-badge-warning">{t("references.status.inactive")}</span>;
      case "desactivate": return <span className="billing-references-badge references-badge-error">{t("references.status.disabled")}</span>;
      default: return <span className="billing-references-badge">{status}</span>;
    }
  };

  const openCreateForm = () => {
    setEditingRef(null);
    setFormData({ reference: "", startDate: new Date().toISOString().split("T")[0], endDate: "" });
    setShowForm(true);
  };

  const openEditForm = (ref: referencesService.PurchaseOrder) => {
    setEditingRef(ref);
    setFormData({ reference: ref.reference, startDate: formatDateInput(ref.startDate), endDate: ref.endDate ? formatDateInput(ref.endDate) : "" });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingRef) {
        await referencesService.updatePurchaseOrder(editingRef.id, { reference: formData.reference, startDate: formData.startDate, endDate: formData.endDate || undefined });
      } else {
        await referencesService.createPurchaseOrder({ reference: formData.reference, startDate: formData.startDate, endDate: formData.endDate || undefined });
      }
      setShowForm(false);
      await loadReferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("references.errors.saveError"));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (ref: referencesService.PurchaseOrder) => {
    try {
      await referencesService.updatePurchaseOrder(ref.id, { active: !ref.active });
      await loadReferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("references.errors.statusError"));
    }
  };

  if (loading) {
    return (
      <div className="billing-references-panel">
        <div className="billing-references-loading-state">
          <div className="billing-references-spinner"></div>
          <p>{t("references.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-references-panel">
        <div className="billing-references-error-banner">
          {error}
          <button onClick={loadReferences} className="billing-references-btn references-btn-secondary references-btn-sm" style={{ marginLeft: "1rem" }}>
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-references-panel">
      <div className="billing-references-section-description">
        <p>{t("references.description")}</p>
      </div>

      {showForm && (
        <div className="billing-references-form-card">
          <h4>{editingRef ? t("references.modal.editTitle") : t("references.modal.addTitle")}</h4>
          <form onSubmit={handleSubmit}>
            <div className="billing-references-form-group">
              <label>{t("references.modal.referenceLabel")} *</label>
              <input type="text" value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} required className="billing-references-form-input" placeholder={t("references.modal.referencePlaceholder")} />
            </div>
            <div className="billing-references-form-row">
              <div className="billing-references-form-group">
                <label>{t("references.startDate")} *</label>
                <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required className="billing-references-form-input" />
              </div>
              <div className="billing-references-form-group">
                <label>{t("references.endDate")} <span className="billing-references-optional">({t("references.optional")})</span></label>
                <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="billing-references-form-input" />
              </div>
            </div>
            <div className="billing-references-form-actions">
              <button type="button" onClick={() => setShowForm(false)} className="billing-references-btn references-btn-secondary">{tCommon("actions.cancel")}</button>
              <button type="submit" disabled={submitting} className="billing-references-btn references-btn-primary">{submitting ? t("references.saving") : (editingRef ? tCommon("actions.edit") : tCommon("actions.create"))}</button>
            </div>
          </form>
        </div>
      )}

      <div className="billing-references-toolbar">
        <span className="billing-references-result-count">{t("references.count", { count: references.length })}</span>
        {!showForm && <button className="billing-references-btn references-btn-primary references-btn-sm" onClick={openCreateForm}>{references.length > 0 ? t("references.addButton") : t("references.createButton")}</button>}
      </div>

      {references.length === 0 ? (
        <div className="billing-references-empty-state">
          <TagIcon />
          <h3>{t("references.empty.title")}</h3>
          <p>{t("references.empty.description")}</p>
          {!showForm && <button className="billing-references-btn references-btn-primary" onClick={openCreateForm}>{t("references.createButton")}</button>}
        </div>
      ) : (
        <div className="billing-references-table-container">
          <table className="billing-references-table">
            <thead>
              <tr>
                <th>{t("columns.reference")}</th>
                <th>{t("references.creationDate")}</th>
                <th>{t("references.startDate")}</th>
                <th>{t("references.endDate")}</th>
                <th>{t("columns.status")}</th>
                <th>{t("columns.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {references.map((r) => (
                <tr key={r.id}>
                  <td><span className="billing-references-ref-badge">{r.reference}</span></td>
                  <td>{formatDateLong(r.creationDate)}</td>
                  <td>{formatDateLong(r.startDate)}</td>
                  <td>{r.endDate ? formatDateLong(r.endDate) : "-"}</td>
                  <td>{getStatusBadge(getDisplayStatus(r))}</td>
                  <td className="billing-references-actions-cell">
                    <button className="billing-references-action-btn" title={tCommon("actions.edit")} onClick={() => openEditForm(r)}><EditIcon /></button>
                    <button className="billing-references-action-btn" title={r.active ? t("references.deactivate") : t("references.reactivate")} onClick={() => toggleStatus(r)}>{r.active ? <PauseIcon /> : <PlayIcon />}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
