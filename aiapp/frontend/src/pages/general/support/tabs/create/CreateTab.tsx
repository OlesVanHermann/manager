// ============================================================
// CREATE TAB - Création de ticket support
// NAV1: general / NAV2: support / NAV3: create
// ISOLÉ - Aucune dépendance vers d'autres tabs
// Préfixe CSS: .support-create-
// ============================================================

import { useTranslation } from "react-i18next";
import { SUPPORT_URLS } from "./CreateTab.service";
import "./CreateTab.css";

// ============ ICÔNES LOCALES ============

const TicketIcon = () => (
  <svg className="support-create-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="support-create-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
);

const BookIcon = () => (
  <svg className="support-create-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="support-create-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const ExternalIcon = () => (
  <svg className="support-create-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

// ============ COMPOSANT ============

export function CreateTab() {
  const { t } = useTranslation("general/support/index");

  const options = [
    {
      icon: <TicketIcon />,
      title: t("create.options.ticket.title", "Créer un ticket"),
      description: t("create.options.ticket.description", "Ouvrez un ticket pour obtenir de l'aide de notre équipe support."),
      url: SUPPORT_URLS.createTicket,
    },
    {
      icon: <ChatIcon />,
      title: t("create.options.chat.title", "Chat en ligne"),
      description: t("create.options.chat.description", "Discutez en direct avec un conseiller (selon disponibilité)."),
      url: SUPPORT_URLS.helpCenter,
    },
    {
      icon: <BookIcon />,
      title: t("create.options.docs.title", "Documentation"),
      description: t("create.options.docs.description", "Consultez nos guides et tutoriels pour résoudre vos problèmes."),
      url: "https://docs.ovh.com/fr/",
    },
    {
      icon: <PhoneIcon />,
      title: t("create.options.phone.title", "Contact téléphonique"),
      description: t("create.options.phone.description", "Appelez notre support (disponible selon votre niveau de support)."),
      url: SUPPORT_URLS.contact,
    },
  ];

  return (
    <div className="support-create-container">
      <div className="support-create-info-box">
        <h3>{t("create.info.title", "Besoin d'aide ?")}</h3>
        <p>
          {t(
            "create.info.description",
            "Choisissez le canal de support adapté à votre besoin. Pour les demandes urgentes ou les incidents, nous vous recommandons de créer un ticket directement."
          )}
        </p>
      </div>

      <div className="support-create-options-grid">
        {options.map((option, index) => (
          <a
            key={index}
            href={option.url}
            target="_blank"
            rel="noopener noreferrer"
            className="support-create-option-card"
          >
            {option.icon}
            <h4>{option.title}</h4>
            <p>{option.description}</p>
          </a>
        ))}
      </div>

      <div className="support-create-quick-links">
        <h4>{t("create.quickLinks.title", "Liens rapides")}</h4>
        <ul>
          <li>
            <a href={SUPPORT_URLS.comparison} target="_blank" rel="noopener noreferrer">
              {t("create.quickLinks.comparison", "Comparer les niveaux de support")}
              <ExternalIcon />
            </a>
          </li>
          <li>
            <a href="https://status.ovhcloud.com/" target="_blank" rel="noopener noreferrer">
              {t("create.quickLinks.status", "État des services OVHcloud")}
              <ExternalIcon />
            </a>
          </li>
          <li>
            <a href="https://community.ovh.com/" target="_blank" rel="noopener noreferrer">
              {t("create.quickLinks.community", "Communauté OVHcloud")}
              <ExternalIcon />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
