import { useTranslation } from "react-i18next";

interface UsefulLink {
  id: string;
  labelKey: string;
  url: string;
}

const links: UsefulLink[] = [
  { id: "docs", labelKey: "externalLinks.documentation", url: "https://help.ovhcloud.com/" },
  { id: "status", labelKey: "externalLinks.status", url: "https://www.status-ovhcloud.com/" },
];

export default function UsefulLinks() {
  const { t } = useTranslation('common');

  return (
    <div className="account-sidebar-useful-links">
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <span>{t(link.labelKey)}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="external-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
