// ============================================================
// RIGHT PANEL - Container pour les détails du service
// Target: target_.web-cloud.voip.dashboard.svg (Right Panel)
// ============================================================

import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Tab {
  id: string;
  label: string;
}

interface RightPanelProps {
  title: string;
  subtitle?: string;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  actions?: ReactNode;
  children: ReactNode;
  loading?: boolean;
}

export function RightPanel({
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  actions,
  children,
  loading,
}: RightPanelProps) {
  const { t } = useTranslation('web-cloud/voip/index');

  if (loading) {
    return (
      <div className="voip-right-panel">
        <div className="voip-right-panel-header">
          <div className="voip-right-panel-header-info">
            <div className="voip-skeleton" style={{ width: 200, height: 24, marginBottom: 8 }} />
            <div className="voip-skeleton" style={{ width: 150, height: 16 }} />
          </div>
        </div>
        <div className="voip-right-panel-tabs">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="voip-skeleton" style={{ width: 80, height: 26 }} />
          ))}
        </div>
        <div className="voip-right-panel-content">
          <div className="voip-tiles-row">
            {[1, 2, 3].map((i) => (
              <div key={i} className="voip-skeleton voip-skeleton-tile" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="voip-right-panel">
      {/* Header */}
      <div className="voip-right-panel-header">
        <div className="voip-right-panel-header-info">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className="voip-right-panel-header-actions">{actions}</div>}
      </div>

      {/* NAV3 Tabs */}
      <div className="voip-right-panel-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`voip-right-panel-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              onTabChange(tab.id);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="voip-right-panel-content">{children}</div>
    </div>
  );
}

// ============================================================
// COMPOSANTS ENFANTS RÉUTILISABLES
// ============================================================

interface TileProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Tile({ title, children, className }: TileProps) {
  return (
    <div className={`voip-tile ${className || ''}`}>
      <div className="voip-tile-title">{title}</div>
      {children}
    </div>
  );
}

interface ActionItemProps {
  label: string;
  onClick: () => void;
}

export function ActionItem({ label, onClick }: ActionItemProps) {
  return (
    <div className="voip-action-item" onClick={() => {
      onClick();
    }}>
      <span>{label}</span>
      <span className="voip-action-item-arrow">→</span>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div className="voip-info-row">
      <label>{label}</label>
      <span className={className}>{value}</span>
    </div>
  );
}

interface BadgeProps {
  type: 'success' | 'warning' | 'error' | 'info';
  children: ReactNode;
}

export function Badge({ type, children }: BadgeProps) {
  return <span className={`voip-left-panel-item-badge ${type}`}>{children}</span>;
}

interface ConsumptionCircleProps {
  percentage: number;
  outplanAmount?: number;
}

export function ConsumptionCircle({ percentage, outplanAmount }: ConsumptionCircleProps) {
  const { t } = useTranslation('web-cloud/voip/index');
  const circumference = 2 * Math.PI * 55;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="voip-consumption-circle">
      <svg viewBox="0 0 120 120">
        {/* Background circle */}
        <circle cx="60" cy="60" r="55" fill="none" stroke="#E5E7EB" strokeWidth="10" />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="none"
          stroke="#0050D7"
          strokeWidth="10"
          strokeDasharray={strokeDasharray}
          transform="rotate(-90 60 60)"
          strokeLinecap="round"
        />
        {/* Text */}
        <text x="60" y="55" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1F2937">
          {percentage}%
        </text>
        <text x="60" y="75" textAnchor="middle" fontSize="10" fill="#6B7280">
          {t('dashboard.consumption.ofPlan')}
        </text>
      </svg>
      {outplanAmount !== undefined && outplanAmount > 0 && (
        <div className="voip-consumption-outplan">
          <label>{t('dashboard.consumption.outplan')}</label>{' '}
          <span>{outplanAmount.toFixed(2)} €</span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="voip-empty-state">
      <div className="voip-empty-state-icon">{icon}</div>
      <div className="voip-empty-state-title">{title}</div>
      {description && <div className="voip-empty-state-description">{description}</div>}
      {action}
    </div>
  );
}
