// ============================================================
// DEDICATED TAB ISOLÉ : GeneralTab
// ============================================================

import { useTranslation } from "react-i18next";
import type { DedicatedServer, DedicatedServerServiceInfos, DedicatedServerHardware } from "../../dedicated.types";
import "./GeneralTab.css";

interface Props {
  serviceName: string;
  details?: DedicatedServer;
  serviceInfos?: DedicatedServerServiceInfos;
  hardware?: DedicatedServerHardware;
  loading: boolean;
}

function formatSize(size: { value: number; unit: string } | undefined): string {
  return size ? `${size.value} ${size.unit}` : "-";
}

export function GeneralTab({ serviceName, details, serviceInfos, hardware, loading }: Props) {
  const { t } = useTranslation("bare-metal/dedicated/index");

  if (loading) {
    return (
      <div className="general-tab">
        <div className="tab-loading">
          <div className="skeleton-block" />
          <div className="skeleton-block" />
        </div>
      </div>
    );
  }

  return (
    <div className="general-tab">
      <section className="info-section">
        <h3>{t("general.title")}</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>{t("general.name")}</label>
            <span className="font-mono">{serviceName}</span>
          </div>
          {details && (
            <>
              <div className="info-item">
                <label>{t("general.ip")}</label>
                <span className="font-mono">{details.ip}</span>
              </div>
              <div className="info-item">
                <label>{t("general.reverse")}</label>
                <span className="font-mono">{details.reverse}</span>
              </div>
              <div className="info-item">
                <label>{t("general.datacenter")}</label>
                <span>{details.datacenter}</span>
              </div>
              <div className="info-item">
                <label>{t("general.rack")}</label>
                <span>{details.rack}</span>
              </div>
              <div className="info-item">
                <label>{t("general.commercialRange")}</label>
                <span>{details.commercialRange}</span>
              </div>
              <div className="info-item">
                <label>{t("general.os")}</label>
                <span>{details.os}</span>
              </div>
              <div className="info-item">
                <label>{t("general.state")}</label>
                <span className={`badge ${details.state === "ok" ? "success" : "error"}`}>{details.state}</span>
              </div>
              <div className="info-item">
                <label>{t("general.power")}</label>
                <span className={`badge ${details.powerState === "poweron" ? "success" : "error"}`}>{details.powerState}</span>
              </div>
              <div className="info-item">
                <label>{t("general.support")}</label>
                <span className="badge info">{details.supportLevel}</span>
              </div>
              <div className="info-item">
                <label>{t("general.monitoring")}</label>
                <span className={`badge ${details.monitoring ? "success" : "inactive"}`}>{details.monitoring ? "✓" : "✗"}</span>
              </div>
            </>
          )}
        </div>
      </section>

      {hardware && (
        <section className="info-section">
          <h3>{t("hardware.title")}</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>{t("hardware.cpu")}</label>
              <span>{hardware.processorName}</span>
            </div>
            <div className="info-item">
              <label>{t("hardware.cores")}</label>
              <span>{hardware.numberOfProcessors} x {hardware.coresPerProcessor} cores ({hardware.threadsPerProcessor} threads)</span>
            </div>
            <div className="info-item">
              <label>{t("hardware.arch")}</label>
              <span>{hardware.processorArchitecture}</span>
            </div>
            <div className="info-item">
              <label>{t("hardware.memory")}</label>
              <span>{formatSize(hardware.memorySize)}</span>
            </div>
            <div className="info-item">
              <label>{t("hardware.motherboard")}</label>
              <span>{hardware.motherboard}</span>
            </div>
            <div className="info-item">
              <label>{t("hardware.formFactor")}</label>
              <span>{hardware.formFactor}</span>
            </div>
            <div className="info-item">
              <label>{t("hardware.bootMode")}</label>
              <span>{hardware.bootMode}</span>
            </div>
          </div>
          {hardware.diskGroups && hardware.diskGroups.length > 0 && (
            <div className="disk-groups">
              <h4>{t("hardware.disks")}</h4>
              {hardware.diskGroups.map((dg, i) => (
                <div key={i} className="disk-group">
                  <span className="disk-count">{dg.numberOfDisks}x</span>
                  <span className="disk-detail">{dg.diskSize.value} {dg.diskSize.unit} {dg.diskType}</span>
                  {dg.raidController && <span className="disk-raid">RAID: {dg.raidController}</span>}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {serviceInfos && (
        <section className="info-section">
          <h3>{t("service.title")}</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>{t("service.creation")}</label>
              <span>{new Date(serviceInfos.creation).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>{t("service.expiration")}</label>
              <span>{new Date(serviceInfos.expiration).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>{t("service.autoRenew")}</label>
              <span className={`badge ${serviceInfos.renew?.automatic ? "success" : "warning"}`}>
                {serviceInfos.renew?.automatic ? "✓" : "✗"}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default GeneralTab;
