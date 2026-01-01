// ============================================================
// GROUPS TAB - Liste des groupes (comptes de facturation)
// ============================================================

import { useState, useEffect } from 'react';
import { ovhApi } from '../../../../../services/api';

interface GroupsTabProps {
  billingAccount: string;
}

interface GroupItem {
  billingAccount: string;
  description: string;
  status: string;
  linesCount: number;
  numbersCount: number;
}

export function GroupsTab({ billingAccount }: GroupsTabProps) {
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!billingAccount) {
      setLoading(false);
      setGroups([]);
      return;
    }

    const loadGroups = async () => {
      try {
        setLoading(true);
        const [account, lines, numbers] = await Promise.all([
          ovhApi.get<{ billingAccount: string; description: string; status: string }>(`/telephony/${billingAccount}`),
          ovhApi.get<string[]>(`/telephony/${billingAccount}/line`).catch(() => []),
          ovhApi.get<string[]>(`/telephony/${billingAccount}/number`).catch(() => []),
        ]);
        setGroups([{
          billingAccount: account.billingAccount,
          description: account.description || account.billingAccount,
          status: account.status,
          linesCount: lines.length,
          numbersCount: numbers.length,
        }]);
      } catch {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, [billingAccount]);

  if (loading) {
    return (
      <div className="sip-tab-loading">
        <div className="voip-skeleton" style={{ height: 60, marginBottom: 8 }} />
        <div className="voip-skeleton" style={{ height: 60, marginBottom: 8 }} />
      </div>
    );
  }

  return (
    <div className="sip-tab-list">
      <div className="sip-tab-header">
        <h3>Groupes</h3>
        <span className="sip-tab-count">{groups.length}</span>
      </div>
      {groups.length === 0 ? (
        <div className="sip-tab-empty">
          <div className="sip-tab-empty-icon">👥</div>
          <div className="sip-tab-empty-text">Aucun groupe</div>
        </div>
      ) : (
        <div className="sip-tab-items">
          {groups.map(group => (
            <div key={group.billingAccount} className="sip-tab-item">
              <div className="sip-tab-item-icon">👥</div>
              <div className="sip-tab-item-info">
                <div className="sip-tab-item-title">{group.description}</div>
                <div className="sip-tab-item-subtitle">{group.billingAccount}</div>
                <div className="sip-tab-item-meta">
                  📞 {group.linesCount} lignes · 🔢 {group.numbersCount} numéros
                </div>
              </div>
              <div className={`sip-tab-item-badge ${group.status === 'enabled' ? 'success' : 'warning'}`}>
                {group.status === 'enabled' ? 'Actif' : 'Expiré'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupsTab;
