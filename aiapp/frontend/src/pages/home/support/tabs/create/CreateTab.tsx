// ============================================================
// CREATE TAB - Créer un ticket support
// ============================================================

import { useTranslation } from "react-i18next";
import { SUPPORT_URLS } from "./CreateTab.service";
import "./CreateTab.css";

// ============ COMPOSANT ============

/** Page d'information pour créer un nouveau ticket support avec liens vers les ressources. */
export function CreateTab() {
  const { t } = useTranslation('home/support/index');

  return (
    <div className="new-ticket-tab">
      <div className="info-box">
        <h3>{t('create.title')}</h3>
        <p>{t('create.description')}</p>
      </div>
      <div className="quick-links">
        <h4>{t('create.resources')}</h4>
        <ul>
          <li><a href="https://docs.ovh.com" target="_blank" rel="noopener noreferrer">{t('create.links.documentation')}</a></li>
          <li><a href="https://community.ovh.com" target="_blank" rel="noopener noreferrer">{t('create.links.community')}</a></li>
          <li><a href="https://status.ovhcloud.com" target="_blank" rel="noopener noreferrer">{t('create.links.status')}</a></li>
        </ul>
      </div>
      <a href={SUPPORT_URLS.createTicket} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t('create.button')}</a>
    </div>
  );
}
