// ============================================================
// SKELETON COMPONENTS - Loading placeholders
// ============================================================

import "./Skeleton.css";

// ============ BASE SKELETON ============

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ width = "100%", height = "1rem", borderRadius = "4px", className = "" }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius,
      }}
    />
  );
}

// ============ SKELETON VARIANTS ============

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`skeleton-text ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.875rem"
          width={i === lines - 1 ? "60%" : "100%"}
          className="skeleton-line"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton-card ${className}`}>
      <div className="skeleton-card-header">
        <Skeleton width="60%" height="1rem" />
        <Skeleton width="2rem" height="1.5rem" />
      </div>
      <Skeleton width="40%" height="0.875rem" />
    </div>
  );
}

export function SkeletonServiceCard() {
  return (
    <div className="skeleton-service-card">
      <div className="skeleton-service-header">
        <Skeleton width={40} height={40} borderRadius="8px" />
        <div className="skeleton-service-info">
          <Skeleton width="70%" height="0.875rem" />
          <Skeleton width="40%" height="0.75rem" />
        </div>
      </div>
      <Skeleton width="30%" height="0.75rem" />
    </div>
  );
}

export function SkeletonBillCard() {
  return (
    <div className="skeleton-bill-card">
      <div className="skeleton-bill-info">
        <Skeleton width="40%" height="1rem" />
        <Skeleton width="30%" height="0.75rem" />
      </div>
      <Skeleton width="80px" height="1.5rem" />
      <Skeleton width="100px" height="36px" borderRadius="6px" />
    </div>
  );
}

export function SkeletonNotification() {
  return (
    <div className="skeleton-notification">
      <Skeleton width={20} height={20} borderRadius="50%" />
      <div className="skeleton-notification-content">
        <Skeleton width="80%" height="0.875rem" />
        <Skeleton width="50%" height="0.75rem" />
      </div>
    </div>
  );
}

// ============ GRID SKELETONS ============

export function SkeletonServicesGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="skeleton-services-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonServiceCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonActionsGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="skeleton-actions-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-action-card">
          <Skeleton width={24} height={24} borderRadius="4px" />
          <Skeleton width="60%" height="0.75rem" />
        </div>
      ))}
    </div>
  );
}

// ============ TILE WRAPPER WITH ERROR STATE ============

interface TileProps {
  title?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
  skeleton?: React.ReactNode;
}

export function Tile({ title, loading, error, onRetry, children, className = "", skeleton }: TileProps) {
  return (
    <div className={`tile ${className}`}>
      {title && <h3 className="tile-title">{title}</h3>}
      
      {loading && (skeleton || <SkeletonText lines={3} />)}
      
      {!loading && error && (
        <div className="tile-error">
          <span className="tile-error-icon">⚠️</span>
          <span className="tile-error-message">{error}</span>
          {onRetry && (
            <button className="tile-error-retry" onClick={onRetry}>
              Reessayer
            </button>
          )}
        </div>
      )}
      
      {!loading && !error && children}
    </div>
  );
}
