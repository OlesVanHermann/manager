// ============================================================
// ACCÈS INTERNET - Page groupe avec sous-navigation
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { accessService } from "./access.service";
import PackXdslPage from "./pack-xdsl";
import OverTheBoxPage from "./overthebox";
import "./index.css";

type SubSection = "pack-xdsl" | "overthebox";

/** Page groupe Accès Internet avec sous-navigation. */
export default function AccessPage() {
  const { t } = useTranslation("web-cloud/access/index");

  const [activeSection, setActiveSection] = useState<SubSection>("pack-xdsl");
  const [counts, setCounts] = useState({ packXdsl: 0, overthebox: 0 });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [packs, otbs] = await Promise.all([
          accessService.listPacks(),
          accessService.listOvertheboxServices(),
        ]);
        setCounts({ packXdsl: packs.length, overthebox: otbs.length });
      } catch (err) {
        console.error("Failed to load counts:", err);
      }
    };
    loadCounts();
  }, []);

  const sections: { id: SubSection; labelKey: string; count: number }[] = [
    { id: "pack-xdsl", labelKey: "sections.packXdsl", count: counts.packXdsl },
    { id: "overthebox", labelKey: "sections.overthebox", count: counts.overthebox },
  ];

  return (
    <div className="service-list-page">
      <div className="sub-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`sub-nav-item ${activeSection === section.id ? "active" : ""}`}
            onClick={() => setActiveSection(section.id)}
          >
            {t(section.labelKey)}
            <span className="count">{section.count}</span>
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        {activeSection === "pack-xdsl" && <PackXdslPage />}
        {activeSection === "overthebox" && <OverTheBoxPage />}
      </div>
    </div>
  );
}
