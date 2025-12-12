import { useEffect, useMemo, useState } from "react";
import type { Tab } from "./types";
import { MAX_TABS, DEFAULT_TAB } from "./constants";

export function useTabs() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [slotError, setSlotError] = useState<string | null>(null);
  const [resetCounter, setResetCounter] = useState(0);

  const showError = (message: string) => {
    setSlotError(message);
    window.setTimeout(() => setSlotError(null), 3000);
  };

  const resetToDefault = () => {
    setResetCounter((c) => c + 1);
    setTabs([DEFAULT_TAB]);
    setActiveId(DEFAULT_TAB.id);
  };

  useEffect(() => {
    if (tabs.length === 0) resetToDefault();
  }, [tabs.length]);

  const openTab = (t: Tab) => {
    const exists = tabs.find((x) => x.id === t.id);
    if (exists) {
      setActiveId(t.id);
      return;
    }
    if (tabs.length >= MAX_TABS) {
      showError("Max 8 onglets. Supprimez-en un pour en creer un nouveau.");
      return;
    }
    setTabs((prev) => [...prev, t]);
    setActiveId(t.id);
  };

  const closeTab = (id: string) => {
    const idx = tabs.findIndex((t) => t.id === id);
    if (idx === -1) return;
    const next = tabs.filter((t) => t.id !== id);
    setTabs(next);
    if (activeId === id) setActiveId(next.length ? next[Math.max(0, idx - 1)].id : "");
  };

  const hasHome = useMemo(() => tabs.some((t) => t.kind === "home"), [tabs]);
  const hasDev = useMemo(() => tabs.some((t) => t.kind === "dev"), [tabs]);
  const hasSettings = useMemo(() => tabs.some((t) => t.kind === "settings"), [tabs]);

  return {
    tabs,
    activeId,
    slotError,
    resetCounter,
    openTab,
    closeTab,
    resetToDefault,
    hasHome,
    hasDev,
    hasSettings,
    setActiveId,
  };
}
