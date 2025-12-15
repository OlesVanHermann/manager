// ============================================================
// USE APP NAVIGATION - Hook de gestion de la navigation
// Gère les univers, sections, tabs et ressources
// ============================================================

import { useState, useMemo, useEffect } from "react";
import { universes } from "../components/Sidebar";
import type { Resource } from "../components/Sidebar/navigationTree";

// ============ TYPES ============

export interface NavigationState {
  activeUniverseId: string;
  activeSectionId: string;
  activeTabId: string | undefined;
  selectedResource: Resource | null;
  resources: Resource[];
}

export interface NavigationActions {
  setActiveUniverseId: (id: string) => void;
  setActiveSectionId: (id: string) => void;
  setActiveTabId: (id: string | undefined) => void;
  handleResourceSelect: (resource: Resource | null) => void;
  handleHomeClick: () => void;
  handleNavigate: (section: string, options?: { tab?: string }) => void;
}

export interface UseAppNavigationReturn extends NavigationState, NavigationActions {
  activeUniverse: typeof universes[0] | undefined;
}

// ============ HOOK ============

/** Hook de gestion de la navigation de l'application. */
export function useAppNavigation(): UseAppNavigationReturn {
  // ---------- STATE ----------
  const [activeUniverseId, setActiveUniverseId] = useState("home");
  const [activeSectionId, setActiveSectionId] = useState("home-dashboard");
  const [activeTabId, setActiveTabId] = useState<string | undefined>(undefined);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);

  // ---------- DERIVED ----------
  const activeUniverse = useMemo(
    () => universes.find((u) => u.id === activeUniverseId),
    [activeUniverseId]
  );

  // ---------- EFFECTS ----------
  // Reset section when universe changes
  useEffect(() => {
    if (activeUniverse && activeUniverse.sections.length > 0) {
      setActiveSectionId(activeUniverse.sections[0].id);
    } else {
      setActiveSectionId("");
    }
    setSelectedResource(null);
    setResources([]);
    setActiveTabId(undefined);
  }, [activeUniverseId]);

  // ---------- HANDLERS ----------
  const handleResourceSelect = (resource: Resource | null) => {
    setSelectedResource(resource);
  };

  const handleHomeClick = () => {
    setActiveUniverseId("home");
    setActiveSectionId("home-dashboard");
    setActiveTabId(undefined);
  };

  const handleNavigate = (section: string, options?: { tab?: string }) => {
    // Gérer la navigation inter-univers
    if (section.startsWith("iam-")) {
      setActiveUniverseId("iam");
    }
    setActiveSectionId(section);
    if (options?.tab) {
      setActiveTabId(options.tab);
    } else {
      setActiveTabId(undefined);
    }
  };

  // ---------- RETURN ----------
  return {
    // State
    activeUniverseId,
    activeSectionId,
    activeTabId,
    selectedResource,
    resources,
    activeUniverse,
    // Actions
    setActiveUniverseId,
    setActiveSectionId,
    setActiveTabId,
    handleResourceSelect,
    handleHomeClick,
    handleNavigate,
  };
}
