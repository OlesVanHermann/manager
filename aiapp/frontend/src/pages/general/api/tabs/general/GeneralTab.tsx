// ============================================================
// GENERAL TAB - Documentation et ressources API OVH
// NAV1: general / NAV2: api / NAV3: general
// Préfixe CSS: .api-general-
// ============================================================

import "./GeneralTab.css";
import { useTranslation } from "react-i18next";

// ============ ICÔNES LOCALES ============

const BookIcon = () => (
  <svg className="api-general-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CodeIcon = () => (
  <svg className="api-general-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const TerminalIcon = () => (
  <svg className="api-general-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const KeyIcon = () => (
  <svg className="api-general-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const GithubIcon = () => (
  <svg className="api-general-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="api-general-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// ============ TYPES ============

interface DocLink {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  category: "docs" | "tools" | "sdks" | "auth";
}

// ============ DONNÉES ============

const DOC_LINKS: DocLink[] = [
  // Documentation officielle
  {
    title: "API Console OVHcloud",
    description: "Console interactive pour explorer et tester l'API",
    url: "https://api.ovh.com/console/",
    icon: <TerminalIcon />,
    category: "tools",
  },
  {
    title: "Documentation API",
    description: "Guide complet de l'API OVHcloud",
    url: "https://docs.ovh.com/fr/api/",
    icon: <BookIcon />,
    category: "docs",
  },
  {
    title: "Premiers pas avec l'API",
    description: "Tutoriel pour débuter avec l'API OVHcloud",
    url: "https://docs.ovh.com/fr/api/first-steps-with-ovh-api/",
    icon: <BookIcon />,
    category: "docs",
  },
  {
    title: "Schéma API /me",
    description: "Schéma JSON de l'endpoint /me",
    url: "https://api.ovh.com/1.0/me.json",
    icon: <CodeIcon />,
    category: "docs",
  },
  // Authentification
  {
    title: "Créer des identifiants API",
    description: "Générer Application Key et Application Secret",
    url: "https://api.ovh.com/createApp/",
    icon: <KeyIcon />,
    category: "auth",
  },
  {
    title: "Gérer les tokens",
    description: "Administrer vos tokens d'authentification",
    url: "https://api.ovh.com/console/#/me/api/credential",
    icon: <KeyIcon />,
    category: "auth",
  },
  // SDKs et librairies
  {
    title: "SDK Python",
    description: "Librairie officielle Python pour l'API OVHcloud",
    url: "https://github.com/ovh/python-ovh",
    icon: <GithubIcon />,
    category: "sdks",
  },
  {
    title: "SDK Node.js",
    description: "Librairie officielle Node.js pour l'API OVHcloud",
    url: "https://github.com/ovh/node-ovh",
    icon: <GithubIcon />,
    category: "sdks",
  },
  {
    title: "SDK PHP",
    description: "Librairie officielle PHP pour l'API OVHcloud",
    url: "https://github.com/ovh/php-ovh",
    icon: <GithubIcon />,
    category: "sdks",
  },
  {
    title: "SDK Go",
    description: "Librairie officielle Go pour l'API OVHcloud",
    url: "https://github.com/ovh/go-ovh",
    icon: <GithubIcon />,
    category: "sdks",
  },
  {
    title: "Terraform Provider",
    description: "Provider Terraform pour OVHcloud",
    url: "https://registry.terraform.io/providers/ovh/ovh/latest/docs",
    icon: <CodeIcon />,
    category: "sdks",
  },
  // Outils
  {
    title: "OVHcloud API Explorer",
    description: "Explorateur visuel de l'API",
    url: "https://api.ovh.com/console/",
    icon: <TerminalIcon />,
    category: "tools",
  },
];

// ============ COMPOSANT ============

export function GeneralTab() {
  const { t } = useTranslation("general/api/general");

  const categories = [
    { key: "docs", label: t("categories.documentation", "Documentation") },
    { key: "auth", label: t("categories.authentication", "Authentification") },
    { key: "sdks", label: t("categories.sdks", "SDKs & Librairies") },
    { key: "tools", label: t("categories.tools", "Outils") },
  ];

  return (
    <div className="api-general-container">
      <div className="api-general-header">
        <h2>{t("title", "Documentation API OVHcloud")}</h2>
        <p className="api-general-subtitle">
          {t("subtitle", "Toutes les ressources pour utiliser l'API OVHcloud")}
        </p>
      </div>

      {categories.map((category) => {
        const links = DOC_LINKS.filter((link) => link.category === category.key);
        if (links.length === 0) return null;

        return (
          <div key={category.key} className="api-general-section">
            <h3 className="api-general-section-title">{category.label}</h3>
            <div className="api-general-links-grid">
              {links.map((link, index) => (
                <a
                
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="api-general-link-card"
                >
                  <div className="api-general-link-icon-wrapper">{link.icon}</div>
                  <div className="api-general-link-content">
                    <div className="api-general-link-title">
                      {link.title}
                      <ExternalLinkIcon />
                    </div>
                    <div className="api-general-link-description">{link.description}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      })}

      <div className="api-general-quick-start">
        <h3>{t("quickStart.title", "Démarrage rapide")}</h3>
        <div className="api-general-code-block">
          <pre>
{`# Installation du SDK Python
pip install ovh

# Exemple d'utilisation
import ovh

client = ovh.Client(
    endpoint='ovh-eu',
    application_key='<application_key>',
    application_secret='<application_secret>',
    consumer_key='<consumer_key>',
)

# Récupérer les informations du compte
me = client.get('/me')
print(me['nichandle'])`}
          </pre>
        </div>
      </div>
    </div>
  );
}
