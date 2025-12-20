// ============================================================
// FAX PAGE - Freefax (style Billing)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../shared";
import { faxService } from "../../../services/web-cloud.fax";
import "../styles.css";

// ============ ICONS ============

const FaxIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Fax avec liste à gauche et détails à droite. */
export default function FaxPage() {
  const { t } = useTranslation("web-cloud/fax/index");

  // ---------- STATE ----------
  const [faxes, setFaxes] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFax, setSelectedFax] = useState<string | null>(null);

  // ---------- LOAD FAXES ----------
  const loadFaxes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const faxNames = await faxService.listFreefax();
      const items: ServiceItem[] = faxNames.map((name) => ({
        id: name,
        name: name,
        type: "Freefax",
      }));
      setFaxes(items);
      if (items.length > 0 && !selectedFax) {
        setSelectedFax(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaxes();
  }, [loadFaxes]);

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-fax"
      i18nNamespace="web-cloud/fax/index"
      services={faxes}
      loading={loading}
      error={error}
      selectedService={selectedFax}
      onSelectService={setSelectedFax}
      emptyIcon={<FaxIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedFax && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedFax}</h2>
          </div>
          <div className="detail-tab-content">
            <div className="info-grid">
              <div className="info-item">
                <label>{t("details.number")}</label>
                <span>{selectedFax}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
