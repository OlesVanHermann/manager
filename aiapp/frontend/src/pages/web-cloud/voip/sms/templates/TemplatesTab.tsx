// ============================================================
// SMS TEMPLATES TAB - Gestion des modèles SMS
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { templatesService } from './TemplatesTab.service';
import './TemplatesTab.css';

interface Props {
  accountName: string;
}

interface Template {
  id: string;
  name: string;
  type: 'transactional' | 'marketing';
  content: string;
  characterCount: number;
  smsCount: number;
  createdAt: string;
}

export function TemplatesTab({ accountName }: Props) {
  const { t } = useTranslation('web-cloud/voip/sms/templates');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await templatesService.getTemplates(accountName);
        setTemplates(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [accountName]);

  const handleRefresh = () => {
    setLoading(true);
    templatesService.getTemplates(accountName).then(data => {
      setTemplates(data);
      setLoading(false);
    });
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm(t('deleteConfirm'))) return;
    try {
      await templatesService.deleteTemplate(accountName, templateId);
      setTemplates(templates.filter(t => t.id !== templateId));
    } catch {
      alert(t('deleteError'));
    }
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.content.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="sms-templates-loading">
        <div className="sms-templates-skeleton" />
        <div className="sms-templates-skeleton" />
        <div className="sms-templates-skeleton" />
      </div>
    );
  }

  return (
    <div className="sms-templates-tab">
      {/* ---------- TOOLBAR ---------- */}
      <div className="templates-toolbar">
        <div className="toolbar-left">
          <button className="btn btn-icon" onClick={handleRefresh} title={t('refresh')}>
            ↻
          </button>
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn btn-primary">
          + {t('create')}
        </button>
      </div>

      {/* ---------- INFO BANNER ---------- */}
      <div className="templates-info-banner">
        <div className="banner-icon">💡</div>
        <div className="banner-content">
          <p><strong>{t('variables.title')}</strong></p>
          <p>{t('variables.description')}</p>
          <div className="variables-list">
            <code>{'{NOM}'}</code>
            <code>{'{PRENOM}'}</code>
            <code>{'{DATE}'}</code>
            <code>{'{HEURE}'}</code>
            <code>{'{CODE}'}</code>
            <code>{'{REF}'}</code>
            <code>{'{URL}'}</code>
          </div>
        </div>
      </div>

      {/* ---------- TEMPLATES GRID ---------- */}
      <div className="templates-grid">
        {/* Create card */}
        <div className="template-card template-create">
          <div className="create-icon">+</div>
          <span className="create-label">{t('createNew')}</span>
        </div>

        {/* Template cards */}
        {filteredTemplates.map(template => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <span className="template-name">{template.name}</span>
              <span className={`type-badge type-${template.type}`}>
                {t(`type.${template.type}`)}
              </span>
            </div>
            <div className="template-content">
              {template.content}
            </div>
            <div className="template-footer">
              <div className="template-stats">
                <span>{template.characterCount} {t('chars')}</span>
                <span>•</span>
                <span>{template.smsCount} SMS</span>
              </div>
              <div className="template-actions">
                <button className="action-btn" title={t('actions.use')}>📤</button>
                <button className="action-btn" title={t('actions.edit')}>✎</button>
                <button
                  className="action-btn action-danger"
                  title={t('actions.delete')}
                  onClick={() => handleDelete(template.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && !loading && (
        <div className="templates-empty">
          <p>{t('empty')}</p>
        </div>
      )}
    </div>
  );
}

export default TemplatesTab;
