// ============================================================
// NUMBER SOUNDS TAB - Gestion des fichiers audio
// Target: target_.web-cloud.voip.number.sounds.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { numbersService } from '../../numbers.service';
import { Tile, Badge } from '../../../components/RightPanel';
import './SoundsTab.css';

interface SoundsTabProps {
  billingAccount: string;
  serviceName: string;
}

interface Sound {
  id: number;
  name: string;
  type: 'welcome' | 'waiting' | 'closed' | 'svi';
  duration: number;
  size: number;
  usedIn: string | null;
}

export function SoundsTab({ billingAccount, serviceName }: SoundsTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/numbers/sounds');

  // ---------- STATE ----------
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadSounds();
  }, [billingAccount, serviceName]);

  const loadSounds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await numbersService.getSounds(billingAccount, serviceName);
      setSounds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.loading'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handlePlay = async (soundId: number) => {
    try {
      const url = await numbersService.getSoundFile(billingAccount, serviceName, soundId);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.play'));
    }
  };

  const handleDownload = async (sound: Sound) => {
    try {
      const url = await numbersService.getSoundFile(billingAccount, serviceName, sound.id);
      const link = document.createElement('a');
      link.href = url;
      link.download = sound.name;
      link.click();
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.download'));
    }
  };

  const handleDelete = async (soundId: number) => {
    if (!confirm(t('confirm.delete'))) return;
    try {
      await numbersService.deleteSound(billingAccount, serviceName, soundId);
      setSounds(sounds.filter((s) => s.id !== soundId));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.delete'));
    }
  };

  // ---------- COMPUTED ----------
  const filteredSounds = sounds.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTypeVariant = (type: Sound['type']) => {
    switch (type) {
      case 'welcome':
        return 'success';
      case 'waiting':
        return 'info';
      case 'closed':
        return 'warning';
      case 'svi':
        return 'purple';
      default:
        return 'neutral';
    }
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
                <th>{t('table.type')}</th>
                <th>{t('table.duration')}</th>
                <th>{t('table.size')}</th>
                <th>{t('table.usedIn')}</th>
                <th>{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSounds.map((sound) => (
                <tr key={sound.id}>
                  <td className="sound-name">
                    <span className="sound-icon">🎵</span>
                    {sound.name}
                  </td>
                  <td>
                    <Badge variant={getTypeVariant(sound.type)}>
                      {t(`types.${sound.type}`)}
                    </Badge>
                  </td>
                  <td>{formatDuration(sound.duration)}</td>
                  <td>{formatSize(sound.size)}</td>
                  <td className="used-in-cell">{sound.usedIn || '-'}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon"
                      onClick={() => handlePlay(sound.id)}
                      title={t('actions.play')}
                    >
                      ▶
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDownload(sound)}
                      title={t('actions.download')}
                    >
                      ⬇
                    </button>
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
