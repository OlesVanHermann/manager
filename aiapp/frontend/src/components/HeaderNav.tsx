// ============================================================
// HEADER NAV - Composants de navigation header
// UniversTabs (NAV1), SectionTabs (NAV2), UserMenu
// ============================================================

import { useTranslation } from "react-i18next";
import { Icon } from "./Sidebar";
import type { Universe, UniversSection } from "./Sidebar/navigationTree";
import type { OvhUser } from "../types/auth.types";

// ============ UNIVERS TABS (Niveau 1) ============

interface UniversTabsProps {
  universes: Universe[];
  activeUniverseId: string;
  onUniverseChange: (universeId: string) => void;
}

/** Tabs de navigation niveau 1 (univers). */
export function UniversTabs({ universes, activeUniverseId, onUniverseChange }: UniversTabsProps) {
  const { t } = useTranslation('navigation');

  return (
    <nav className="univers-tabs">
      {universes.map((u) => (
        <button
          key={u.id}
          className={`univers-tab ${activeUniverseId === u.id ? "active" : ""}`}
          onClick={() => onUniverseChange(u.id)}
        >
          {t(u.i18nKey)}
        </button>
      ))}
    </nav>
  );
}

// ============ SECTION TABS (Niveau 2) ============

interface SectionTabsProps {
  sections: UniversSection[];
  activeSectionId: string;
  onSectionChange: (sectionId: string) => void;
}

/** Tabs de navigation niveau 2 (sections d'un univers). */
export function SectionTabs({ sections, activeSectionId, onSectionChange }: SectionTabsProps) {
  const { t } = useTranslation('navigation');

  if (!sections || sections.length === 0) return null;

  return (
    <nav className="section-tabs">
      {sections.map((s) => (
        <button
          key={s.id}
          className={`section-tab ${activeSectionId === s.id ? "active" : ""}`}
          onClick={() => onSectionChange(s.id)}
        >
          {t(s.i18nKey)}
        </button>
      ))}
      {sections.length > 10 && (
        <button className="section-tab more">
          <Icon name="ellipsis" className="more-icon" />
        </button>
      )}
    </nav>
  );
}

// ============ USER MENU ============

interface UserMenuProps {
  user: OvhUser | null;
  onClick: () => void;
}

/** Menu utilisateur avec nichandle et chevron. */
export function UserMenu({ user, onClick }: UserMenuProps) {
  return (
    <button className="user-menu" onClick={onClick}>
      <span className="user-badge">OK</span>
      <span className="user-nic">{user?.nichandle || "---"}</span>
      <Icon name="chevronDown" className="user-chevron" />
    </button>
  );
}

// ============ LOADING FALLBACK ============

/** Composant de chargement pour Suspense. */
export function LoadingFallback() {
  const { t } = useTranslation('common');
  return (
    <div className="app-loading">
      <div className="loading-text">{t('loading')}</div>
    </div>
  );
}
