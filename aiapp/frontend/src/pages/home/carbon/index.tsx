import { useTranslation } from "react-i18next";
import "./styles.css";

export default function CarbonPage() {
  const { t } = useTranslation('home/carbon/index');

  return (
    <div className="carbon-page">
      <div className="page-header">
        <h1>{t('title')}</h1>
        <p className="page-description">{t('description')}</p>
      </div>

      <div className="carbon-section">
        <h2>{t('composition.title')}</h2>
        <p>{t('composition.intro')}</p>
        
        <div className="carbon-formula">
          <div className="formula-item">
            <div className="formula-icon">🏭</div>
            <span>{t('composition.manufacturing')}</span>
          </div>
          <span className="formula-operator">+</span>
          <div className="formula-item">
            <div className="formula-icon">⚡</div>
            <span>{t('composition.electricity')}</span>
          </div>
          <span className="formula-operator">+</span>
          <div className="formula-item">
            <div className="formula-icon">⚙️</div>
            <span>{t('composition.operations')}</span>
          </div>
          <span className="formula-operator">=</span>
          <div className="formula-item result">
            <div className="formula-icon">🌍</div>
            <span>{t('composition.emissions')}</span>
          </div>
        </div>
      </div>

      <div className="carbon-section">
        <p>{t('services.intro')}</p>
        <ul className="carbon-list">
          <li dangerouslySetInnerHTML={{ __html: t('services.baremetal') }} />
          <li dangerouslySetInnerHTML={{ __html: t('services.hpc') }} />
          <li dangerouslySetInnerHTML={{ __html: t('services.publicCloud') }} />
        </ul>
        <p dangerouslySetInnerHTML={{ __html: t('services.billingContact') }} />
      </div>

      <div className="carbon-actions">
        <a href="https://www.ovh.com/manager/#/dedicated/carbon-calculator" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          {t('downloadButton')}
        </a>
      </div>
    </div>
  );
}
