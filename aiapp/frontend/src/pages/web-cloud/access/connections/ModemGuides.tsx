// ============================================================
// MODEM GUIDES - Guides et documentation pour modem OVH
// ============================================================

import { useTranslation } from "react-i18next";
import "./ModemOvhTab.css";

interface ModemGuidesProps {
  connectionId: string;
}

interface GuideCard {
  id: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
  url: string;
}

interface QuickLink {
  labelKey: string;
  url: string;
}

const GUIDES: GuideCard[] = [
  {
    id: "setup",
    icon: "📖",
    titleKey: "modemGuides.cards.setup.title",
    descriptionKey: "modemGuides.cards.setup.description",
    url: "https://docs.ovh.com/fr/xdsl/configuration-modem/",
  },
  {
    id: "wifi",
    icon: "📶",
    titleKey: "modemGuides.cards.wifi.title",
    descriptionKey: "modemGuides.cards.wifi.description",
    url: "https://docs.ovh.com/fr/xdsl/configuration-wifi/",
  },
  {
    id: "nat",
    icon: "🔀",
    titleKey: "modemGuides.cards.nat.title",
    descriptionKey: "modemGuides.cards.nat.description",
    url: "https://docs.ovh.com/fr/xdsl/redirection-ports/",
  },
  {
    id: "custom",
    icon: "🔧",
    titleKey: "modemGuides.cards.custom.title",
    descriptionKey: "modemGuides.cards.custom.description",
    url: "https://docs.ovh.com/fr/xdsl/modem-personnel/",
  },
  {
    id: "bridge",
    icon: "🌉",
    titleKey: "modemGuides.cards.bridge.title",
    descriptionKey: "modemGuides.cards.bridge.description",
    url: "https://docs.ovh.com/fr/xdsl/mode-bridge/",
  },
  {
    id: "troubleshoot",
    icon: "🔍",
    titleKey: "modemGuides.cards.troubleshoot.title",
    descriptionKey: "modemGuides.cards.troubleshoot.description",
    url: "https://docs.ovh.com/fr/xdsl/depannage/",
  },
];

const QUICK_LINKS: QuickLink[] = [
  {
    labelKey: "modemGuides.quickLinks.docs",
    url: "https://docs.ovh.com/fr/xdsl/",
  },
  {
    labelKey: "modemGuides.quickLinks.community",
    url: "https://community.ovh.com/c/web-cloud/xdsl/",
  },
  {
    labelKey: "modemGuides.quickLinks.support",
    url: "https://help.ovhcloud.com/csm/fr-home",
  },
];

/** Page statique des guides et documentation modem OVH */
export function ModemGuides({ connectionId }: ModemGuidesProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const handleOpenGuide = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="modem-guides">
      {/* HEADER */}
      <h3 className="guides-title">{t("modemGuides.title")}</h3>

      {/* CARDS GRID */}
      <div className="guides-grid">
        {GUIDES.map((guide) => (
          <div key={guide.id} className="guide-card">
            <div className="guide-card-header">
              <span className="guide-icon">{guide.icon}</span>
              <h4 className="guide-card-title">{t(guide.titleKey)}</h4>
            </div>
            <p className="guide-card-description">{t(guide.descriptionKey)}</p>
            <button
              className="btn-outline btn-sm"
              onClick={() => handleOpenGuide(guide.url)}
            >
              {t("modemGuides.consult")} ↗
            </button>
          </div>
        ))}
      </div>

      {/* QUICK LINKS BANNER */}
      <div className="quick-links-banner">
        <h4 className="quick-links-title">{t("modemGuides.quickLinks.title")}</h4>
        <ul className="quick-links-list">
          {QUICK_LINKS.map((link, index) => (
            <li key={index} className="quick-link-item">
              <span className="quick-link-bullet">•</span>
              <span className="quick-link-label">{t(link.labelKey)}</span>
              <button
                className="btn-link"
                onClick={() => handleOpenGuide(link.url)}
              >
                {link.url.replace("https://", "").split("/")[0]} ↗
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
