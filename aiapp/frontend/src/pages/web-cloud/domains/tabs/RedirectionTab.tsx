// ============================================================
// TAB: REDIRECTIONS - Redirections web du domaine
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { domainsService, Redirection } from "../../../../services/web-cloud.domains";

interface Props {
  domain: string;
}

/** Onglet redirections web du domaine. */
export function RedirectionTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");

  const [redirections, setRedirections] = useState<Redirection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const ids = await domainsService.listRedirections(domain);
        const details = await Promise.all(ids.map((id) => domainsService.getRedirection(domain, id)));
        setRedirections(details);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [domain]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "visible": return t("redirections.typeVisible");
      case "visiblePermanent": return t("redirections.typePermanent");
      case "invisible": return t("redirections.typeInvisible");
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="redirections-tab">
      <div className="tab-header">
        <div>
          <h3>{t("redirections.title")}</h3>
          <p className="tab-description">{t("redirections.description")}</p>
        </div>
      </div>

      {redirections.length === 0 ? (
        <div className="empty-state">
          <h3>{t("redirections.empty")}</h3>
          <p className="hint">{t("redirections.emptyHint")}</p>
        </div>
      ) : (
        <div className="redirection-cards">
          {redirections.map((redir) => (
            <div key={redir.id} className="redirection-card">
              <div className="redirection-header">
                <span className={`redirection-type ${redir.type}`}>{getTypeLabel(redir.type)}</span>
              </div>
              <div className="redirection-flow">
                <span className="from">{redir.subDomain || "@"}.{domain}</span>
                <span className="arrow">→</span>
                <span className="to">{redir.target}</span>
              </div>
              {redir.title && <div className="redirection-meta">Titre: {redir.title}</div>}
            </div>
          ))}
        </div>
      )}

      <div className="info-box">
        <h4>{t("redirections.info")}</h4>
        <p>{t("redirections.infoDesc")}</p>
      </div>
    </div>
  );
}

export default RedirectionTab;
