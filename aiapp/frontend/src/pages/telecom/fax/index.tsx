// ============================================================
// FAX - Page principale
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { telecomService, FreefaxAccount } from "../../../services/telecom.service";
import "./styles.css";

interface FaxWithDetails { number: string; details?: FreefaxAccount; loading: boolean; }

export default function FaxPage() {
  const { t } = useTranslation("telecom/fax/index");
  const { t: tCommon } = useTranslation("common");
  const [faxes, setFaxes] = useState<FaxWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFaxes = useCallback(async () => {
    try {
      setLoading(true);
      const numbers = await telecomService.listFreefax();
      const list: FaxWithDetails[] = numbers.map(number => ({ number, loading: true }));
      setFaxes(list);
      for (const number of numbers) {
        try {
          const details = await telecomService.getFreefax(number);
          setFaxes(prev => prev.map(f => f.number === number ? { ...f, details, loading: false } : f));
        } catch { setFaxes(prev => prev.map(f => f.number === number ? { ...f, loading: false } : f)); }
      }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadFaxes(); }, []);

  return (
    <div className="fax-page">
      <header className="page-header">
        <div><h1>{t("title")}</h1><p className="page-description">{t("description")}</p></div>
        <button className="btn-refresh" onClick={loadFaxes}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>{tCommon("actions.refresh")}</button>
      </header>
      <div className="fax-content">
        {loading && faxes.length === 0 ? (<div className="loading-state"><div className="skeleton-block" /></div>) : faxes.length === 0 ? (<div className="empty-state"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg><p>{t("empty")}</p></div>) : (
          <div className="fax-cards">
            {faxes.map(fax => (
              <div key={fax.number} className="fax-card">
                <div className="fax-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg></div>
                <div className="fax-info">
                  <h3 className="font-mono">{fax.number}</h3>
                  {fax.details && (<>
                    <div className="fax-detail"><label>{t("fromName")}</label><span>{fax.details.fromName || '-'}</span></div>
                    <div className="fax-detail"><label>{t("fromEmail")}</label><span>{fax.details.fromEmail}</span></div>
                    <div className="fax-detail"><label>{t("quality")}</label><span className="badge info">{fax.details.faxQuality}</span></div>
                    <div className="fax-detail"><label>{t("redirectTo")}</label><span>{fax.details.redirectionEmail?.join(', ') || '-'}</span></div>
                  </>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
