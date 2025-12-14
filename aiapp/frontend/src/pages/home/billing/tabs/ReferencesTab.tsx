import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as billingService from "../../../../services/billing.service";
import { TabProps, formatDateLong, formatDateInput, isNotFoundError } from "../utils";
import { EditIcon, PauseIcon, PlayIcon, TagIcon } from "../icons";

export function ReferencesTab({ credentials }: TabProps) {
  const { t } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');
  const [references, setReferences] = useState<billingService.PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRef, setEditingRef] = useState<billingService.PurchaseOrder | null>(null);
  const [formData, setFormData] = useState({ reference: "", startDate: "", endDate: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadReferences(); }, []);

  const loadReferences = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await billingService.getPurchaseOrders();
      setReferences(data);
    } catch (err) {
      if (isNotFoundError(err)) { setReferences([]); }
      else { setError(err instanceof Error ? err.message : t('errors.loadError')); }
    } finally {
      setLoading(false);
    }
  };

  const getDisplayStatus = (ref: billingService.PurchaseOrder): "actif" | "inactif" | "desactivate" => {
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
      case "actif": return <span className="status-badge badge-success">{t('references.status.active')}</span>;
      case "inactif": return <span className="status-badge badge-warning">{t('references.status.inactive')}</span>;
      case "desactivate": return <span className="status-badge badge-error">{t('references.status.disabled')}</span>;
      default: return <span className="status-badge">{status}</span>;
    }
  };

  const openCreateForm = () => {
    setEditingRef(null);
    setFormData({ reference: "", startDate: new Date().toISOString().split("T")[0], endDate: "" });
    setShowForm(true);
  };

  const openEditForm = (ref: billingService.PurchaseOrder) => {
    setEditingRef(ref);
    setFormData({ reference: ref.reference, startDate: formatDateInput(ref.startDate), endDate: ref.endDate ? formatDateInput(ref.endDate) : "" });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingRef) {
        await billingService.updatePurchaseOrder(editingRef.id, { reference: formData.reference, startDate: formData.startDate, endDate: formData.endDate || undefined });
      } else {
        await billingService.createPurchaseOrder({ reference: formData.reference, startDate: formData.startDate, endDate: formData.endDate || undefined });
      }
      setShowForm(false);
      await loadReferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('references.errors.saveError'));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (ref: billingService.PurchaseOrder) => {
    try {
      await billingService.updatePurchaseOrder(ref.id, { active: !ref.active });
      await loadReferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('references.errors.statusError'));
    }
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{t('references.loading')}</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}<button onClick={loadReferences} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;

  return (
    <div className="tab-panel">
      <div className="section-description" style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--color-background-subtle)", borderRadius: "8px" }}>
        <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>{t('references.description')}</p>
      </div>

      {showForm && (
        <div className="form-card" style={{ marginBottom: "1.5rem", padding: "1.5rem", border: "1px solid var(--color-border)", borderRadius: "8px", background: "var(--color-background)" }}>
          <h4 style={{ marginBottom: "1rem" }}>{editingRef ? t('references.modal.editTitle') : t('references.modal.addTitle')}</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>{t('references.modal.referenceLabel')} *</label>
              <input type="text" value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} required className="form-input" style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--color-border)" }} placeholder={t('references.modal.referencePlaceholder')} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>{t('references.startDate')} *</label>
                <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required className="form-input" style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--color-border)" }} />
              </div>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>{t('references.endDate')} <span style={{ fontWeight: 400, color: "var(--color-text-tertiary)" }}>({t('references.optional')})</span></label>
                <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="form-input" style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--color-border)" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">{tCommon('actions.cancel')}</button>
              <button type="submit" disabled={submitting} className="btn btn-primary">{submitting ? t('references.saving') : (editingRef ? tCommon('actions.edit') : tCommon('actions.create'))}</button>
            </div>
          </form>
        </div>
      )}

      <div className="toolbar">
        <span className="result-count">{t('references.count', { count: references.length })}</span>
        {!showForm && <button className="btn btn-primary btn-sm" onClick={openCreateForm}>{references.length > 0 ? t('references.addButton') : t('references.createButton')}</button>}
      </div>

      {references.length === 0 ? (
        <div className="empty-state">
          <TagIcon />
          <h3>{t('references.empty.title')}</h3>
          <p>{t('references.empty.description')}</p>
          {!showForm && <button className="btn btn-primary" onClick={openCreateForm}>{t('references.createButton')}</button>}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>{t('columns.reference')}</th><th>{t('references.creationDate')}</th><th>{t('references.startDate')}</th><th>{t('references.endDate')}</th><th>{t('columns.status')}</th><th>{t('columns.actions')}</th></tr></thead>
            <tbody>
              {references.map((r) => (
                <tr key={r.id}>
                  <td><span className="ref-badge" style={{ fontWeight: 600 }}>{r.reference}</span></td>
                  <td>{formatDateLong(r.creationDate)}</td>
                  <td>{formatDateLong(r.startDate)}</td>
                  <td>{r.endDate ? formatDateLong(r.endDate) : "-"}</td>
                  <td>{getStatusBadge(getDisplayStatus(r))}</td>
                  <td className="actions-cell">
                    <button className="action-btn" title={tCommon('actions.edit')} onClick={() => openEditForm(r)}><EditIcon /></button>
                    <button className="action-btn" title={r.active ? t('references.deactivate') : t('references.reactivate')} onClick={() => toggleStatus(r)}>{r.active ? <PauseIcon /> : <PlayIcon />}</button>
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
