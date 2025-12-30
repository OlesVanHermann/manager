// ============================================================
// WORDPRESS TAB: DOMAINS
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { domainsService } from './DomainsTab.service';
import type { WordPressDomain } from '../../wordpress.types';
import { AddDomainModal } from '../../modals/AddDomainModal';
import { ConfigureSslModal } from '../../modals/ConfigureSslModal';
import './DomainsTab.css';

interface Props {
  serviceName: string;
}

export function DomainsTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [domains, setDomains] = useState<WordPressDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSslModal, setShowSslModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const loadDomains = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await domainsService.listDomains(serviceName);
      setDomains(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    loadDomains();
  }, [loadDomains]);

  const handleDeleteDomain = async (domain: string) => {
    if (!confirm(t('domains.confirmDelete', { domain }))) return;
    try {
      await domainsService.deleteDomain(serviceName, domain);
      loadDomains();
    } catch (err) {
      alert(`Erreur: ${err}`);
    }
  };

  const handleConfigureSsl = (domain: string) => {
    setSelectedDomain(domain);
    setShowSslModal(true);
  };

  const copyDnsConfig = () => {
    const config = `Type    Nom       Valeur
A       @         1.2.3.4
CNAME   www       ${domains.find(d => d.type === 'primary')?.domain || 'example.com'}.`;
    navigator.clipboard.writeText(config);
    alert(t('domains.dnsCopied'));
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      primary: t('domains.typePrimary'),
      alias: t('domains.typeAlias'),
      multisite: t('domains.typeMultisite'),
    };
    return types[type] || type;
  };

  const getSslStatusBadge = (status: string) => {
    const statuses: Record<string, { className: string; label: string; color: string }> = {
      active: { className: 'success', label: "Let's Encrypt", color: '#10B981' },
      pending: { className: 'warning', label: t('domains.sslPending'), color: '#F59E0B' },
      none: { className: 'error', label: t('domains.sslNone'), color: '#EF4444' },
      error: { className: 'error', label: t('domains.sslError'), color: '#EF4444' },
    };
    return statuses[status] || { className: 'muted', label: status, color: '#6B7280' };
  };

  const getDnsStatusBadge = (status: string) => {
    const statuses: Record<string, { color: string; label: string }> = {
      ok: { color: '#10B981', label: 'OK' },
      error: { color: '#EF4444', label: t('domains.dnsError') },
      pending: { color: '#F59E0B', label: t('domains.dnsPending') },
    };
    return statuses[status] || { color: '#6B7280', label: status };
  };

  if (loading) {
    return <div className="domains-loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="domains-error">{error}</div>;
  }

  return (
    <div className="domains-tab">
      {/* Header */}
      <div className="domains-header">
        <h3>{t('domains.title')}</h3>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + {t('domains.addDomain')}
        </button>
      </div>

      {/* Domains Table */}
      <div className="domains-table-container">
        <table className="domains-table">
          <thead>
            <tr>
              <th>{t('domains.domain')}</th>
              <th>{t('domains.type')}</th>
              <th>{t('domains.ssl')}</th>
              <th>{t('domains.dns')}</th>
              <th>{t('domains.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {domains.map(domain => {
              const sslBadge = getSslStatusBadge(domain.sslStatus);
              const dnsBadge = getDnsStatusBadge(domain.dnsStatus);
              return (
                <tr key={domain.domain}>
                  <td>
                    <div className="domains-name">
                      <span className="domains-icon">🌐</span>
                      <span>{domain.domain}</span>
                    </div>
                    {domain.redirectTo && (
                      <div className="domains-redirect">
                        → {domain.redirectTo}
                      </div>
                    )}
                    {domain.dnsStatus === 'error' && (
                      <div className="domains-dns-warning">
                        ⚠️ {t('domains.checkDns')}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`domains-type-badge ${domain.type}`}>
                      {getTypeLabel(domain.type)}
                    </span>
                  </td>
                  <td>
                    <span className="domains-ssl-status">
                      <span className="domains-status-dot" style={{ backgroundColor: sslBadge.color }} />
                      {sslBadge.label}
                    </span>
                  </td>
                  <td>
                    <span className="domains-dns-status">
                      <span className="domains-status-dot" style={{ backgroundColor: dnsBadge.color }} />
                      {dnsBadge.label}
                    </span>
                  </td>
                  <td>
                    <div className="domains-actions">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleConfigureSsl(domain.domain)}
                        title={t('domains.configureSsl')}
                      >
                        🔒
                      </button>
                      {domain.type !== 'primary' && (
                        <button
                          className="btn btn-sm btn-outline domains-btn-danger-outline"
                          onClick={() => handleDeleteDomain(domain.domain)}
                          title={t('domains.delete')}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* DNS Config Box */}
      <div className="domains-dns-config">
        <h4>{t('domains.dnsConfigTitle')}</h4>
        <p>{t('domains.dnsConfigDesc')}</p>
        <div className="domains-dns-records">
          <div className="domains-dns-record">
            <span className="domains-dns-type">A</span>
            <span className="domains-dns-name-value">@</span>
            <span className="domains-dns-value">1.2.3.4</span>
          </div>
          <div className="domains-dns-record">
            <span className="domains-dns-type">CNAME</span>
            <span className="domains-dns-name-value">www</span>
            <span className="domains-dns-value">{domains.find(d => d.type === 'primary')?.domain || 'example.com'}.</span>
          </div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={copyDnsConfig}>
          📋 {t('domains.copyConfig')}
        </button>
      </div>

      {/* Modals */}
      <AddDomainModal
        serviceName={serviceName}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          loadDomains();
        }}
      />
      {selectedDomain && (
        <ConfigureSslModal
          serviceName={serviceName}
          domain={selectedDomain}
          isOpen={showSslModal}
          onClose={() => {
            setShowSslModal(false);
            setSelectedDomain(null);
          }}
          onSuccess={() => {
            setShowSslModal(false);
            setSelectedDomain(null);
            loadDomains();
          }}
        />
      )}
    </div>
  );
}

export default DomainsTab;
