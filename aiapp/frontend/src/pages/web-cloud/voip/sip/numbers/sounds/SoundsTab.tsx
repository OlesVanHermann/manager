// ============================================================
// NUMBER SOUNDS TAB - Gestion des fichiers audio
// Target: target_.web-cloud.voip.number.sounds.svg
// DEFACTORISATION: Composants UI dupliqués, service isolé
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { soundsTabService, type NumberSound } from './SoundsTab.service';
import './SoundsTab.css';

// ============================================================
// COMPOSANTS UI DUPLIQUÉS (ISOLATION)
// ============================================================

function Tile({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`voip-tile ${className}`}>
      <div className="voip-tile-header">{title}</div>
      <div className="voip-tile-content">{children}</div>
    </div>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

interface SoundsTabProps {
  billingAccount: string;
  serviceName: string;
}

export function SoundsTab({ billingAccount }: SoundsTabProps) {
  const { t } = useTranslation('web-cloud/voip/numbers/sounds');

  // ---------- STATE ----------
  const [sounds, setSounds] = useState<NumberSound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadSounds();
  }, [billingAccount]);

  const loadSounds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await soundsTabService.getSounds(billingAccount);
      setSounds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.loading'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleDelete = async (soundId: number) => {
    if (!confirm(t('confirm.delete'))) return;
    try {
      await soundsTabService.deleteSound(billingAccount, soundId);
      setSounds(sounds.filter((s) => s.id !== soundId));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.delete'));
    }
  };

  // ---------- COMPUTED ----------
  const filteredSounds = sounds.filter((s) =>
    s.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="sounds-tab">
        <div className="loading-state">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sounds-tab">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="sounds-tab">
      {/* Info banner */}
      <div className="sounds-info-banner">
        <span className="info-icon">🔊</span>
        <p>{t('info.description')}</p>
      </div>

      {/* Toolbar */}
      <div className="sounds-toolbar">
        <button className="btn btn-icon" onClick={loadSounds} title={t('actions.refresh')}>
          ↻
        </button>
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="btn btn-primary">{t('actions.upload')}</button>
      </div>

      {/* Sounds table */}
      <Tile title={t('table.title', { count: sounds.length })}>
        {filteredSounds.length === 0 ? (
          <div className="empty-state">{t('table.empty')}</div>
        ) : (
          <table className="sounds-table">
            <thead>
              <tr>
                <th>{t('table.name')}</th>
                <th>{t('table.description')}</th>
                <th>{t('table.size')}</th>
                <th>{t('table.date')}</th>
                <th>{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSounds.map((sound) => (
                <tr key={sound.id}>
                  <td className="sound-name">
                    <span className="sound-icon">🎵</span>
                    {sound.filename}
                  </td>
                  <td>{sound.description || '-'}</td>
                  <td>{formatSize(sound.size)}</td>
                  <td>{new Date(sound.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="actions-cell">
                    <button className="btn-icon" title={t('actions.edit')}>
                      ✎
                    </button>
                    <button
                      className="btn-icon btn-icon-danger"
                      onClick={() => handleDelete(sound.id)}
                      title={t('actions.delete')}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Tile>

      {/* Supported formats */}
      <div className="sounds-formats">
        <strong>{t('formats.title')}</strong>
        <span>WAV (16-bit, 8kHz mono) • MP3 • OGG • Max 10 MB</span>
      </div>
    </div>
  );
}
