// ============================================================
// MODAL - Add List Member (Ajouter membre à une liste)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface AddListMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  listEmail: string;
  listType: "mailinglist" | "group";
  currentMemberCount: number;
  existingMembers: string[];
  domainAccounts: { email: string; displayName?: string }[];
  onSubmit: (members: string[]) => Promise<void>;
}

/** Modal d'ajout de membres à une liste de diffusion ou groupe. */
export function AddListMemberModal({
  isOpen,
  onClose,
  listEmail,
  listType,
  currentMemberCount,
  existingMembers,
  domainAccounts,
  onSubmit,
}: AddListMemberModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freeInput, setFreeInput] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ---------- COMPUTED ----------

  const parsedEmails = useMemo(() => {
    if (!freeInput.trim()) return [];
    const emails = freeInput
      .split(/[\n,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    return [...new Set(emails)];
  }, [freeInput]);

  const allMembers = useMemo(() => {
    const combined = [...parsedEmails, ...selectedAccounts];
    return [...new Set(combined)].filter((m) => !existingMembers.includes(m));
  }, [parsedEmails, selectedAccounts, existingMembers]);

  const filteredAccounts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return domainAccounts.filter(
      (acc) =>
        !existingMembers.includes(acc.email) &&
        (acc.email.toLowerCase().includes(query) ||
          acc.displayName?.toLowerCase().includes(query))
    );
  }, [domainAccounts, existingMembers, searchQuery]);

  // ---------- HANDLERS ----------

  const toggleAccount = (email: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const removeFromPreview = (email: string) => {
    if (selectedAccounts.includes(email)) {
      setSelectedAccounts((prev) => prev.filter((e) => e !== email));
    } else {
      const lines = freeInput.split(/[\n,;]+/).filter((l) => l.trim().toLowerCase() !== email);
      setFreeInput(lines.join("\n"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (allMembers.length === 0) {
      setError(t("addListMember.errors.noMembers"));
      return;
    }

    setLoading(true);
    try {
      await onSubmit(allMembers);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("addListMember.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFreeInput("");
    setSelectedAccounts([]);
    setSearchQuery("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("addListMember.title")}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="modal-error">
                <span className="error-icon">⚠</span>
                {error}
              </div>
            )}

            {/* List info */}
            <div className="list-info-card">
              <div className="list-info-header">
                <span className="list-email">{listEmail}</span>
                <span className="list-badge">
                  {listType === "group" ? t("addListMember.typeGroup") : t("addListMember.typeList")}
                </span>
              </div>
              <span className="list-members">
                {t("addListMember.currentMembers", { count: currentMemberCount })}
              </span>
            </div>

            {/* Free input */}
            <div className="form-group">
              <label className="form-label">{t("addListMember.fields.freeInput")}</label>
              <textarea
                className="form-textarea"
                value={freeInput}
                onChange={(e) => setFreeInput(e.target.value)}
                placeholder={t("addListMember.placeholders.freeInput")}
                rows={4}
                disabled={loading}
              />
              <span className="form-hint">{t("addListMember.hints.freeInput")}</span>
            </div>

            {/* Select from accounts */}
            <div className="form-group">
              <label className="form-label">{t("addListMember.fields.selectAccounts")}</label>
              <input
                type="text"
                className="form-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("addListMember.placeholders.search")}
                disabled={loading}
              />
              <div className="accounts-list">
                {filteredAccounts.slice(0, 10).map((acc) => (
                  <label key={acc.email} className="account-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(acc.email)}
                      onChange={() => toggleAccount(acc.email)}
                      disabled={loading}
                    />
                    <span className="account-checkbox-info">
                      <span className="account-checkbox-email">{acc.email}</span>
                      {acc.displayName && (
                        <span className="account-checkbox-name">{acc.displayName}</span>
                      )}
                    </span>
                  </label>
                ))}
                {filteredAccounts.length > 10 && (
                  <span className="accounts-more">
                    {t("addListMember.moreAccounts", { count: filteredAccounts.length - 10 })}
                  </span>
                )}
              </div>
            </div>

            {/* Preview */}
            {allMembers.length > 0 && (
              <div className="members-preview">
                <label className="form-label">
                  {t("addListMember.preview")} ({allMembers.length})
                </label>
                <div className="member-tags">
                  {allMembers.map((email) => (
                    <div key={email} className="member-tag">
                      <span>{email}</span>
                      <button
                        type="button"
                        className="member-remove"
                        onClick={() => removeFromPreview(email)}
                        disabled={loading}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || allMembers.length === 0}>
              {loading
                ? t("common.creating")
                : t("addListMember.submit", { count: allMembers.length })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
