import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { vpsService, VpsDisk } from "../../../../services/vps.service";

interface Props { serviceName: string; }

export function DisksTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/vps/index");
  const [disks, setDisks] = useState<VpsDisk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await vpsService.listDisks(serviceName);
        const data = await Promise.all(ids.map(id => vpsService.getDisk(serviceName, id)));
        setDisks(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="disks-tab">
      <div className="tab-header"><h3>{t("disks.title")}</h3></div>
      {disks.length === 0 ? (<div className="empty-state"><p>{t("disks.empty")}</p></div>) : (
        <div className="disk-cards">
          {disks.map(disk => (
            <div key={disk.id} className={`disk-card ${disk.type === 'primary' ? 'primary' : ''}`}>
              <div className="disk-header"><span className={`badge ${disk.type === 'primary' ? 'success' : 'info'}`}>{disk.type}</span><span className={`badge ${disk.state === 'connected' ? 'success' : 'warning'}`}>{disk.state}</span></div>
              <div className="disk-size">{disk.size} GB</div>
              <div className="disk-info">
                <div><label>{t("disks.name")}</label><span>{disk.name || '-'}</span></div>
                <div><label>{t("disks.filesystem")}</label><span>{disk.fileSystem || '-'}</span></div>
                <div><label>{t("disks.readonly")}</label><span>{disk.isReadOnly ? '✓' : '✗'}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default DisksTab;
