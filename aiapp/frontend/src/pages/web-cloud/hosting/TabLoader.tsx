// ============================================================
// TAB LOADER - Error Boundary + Suspense wrapper
// ============================================================

import React, { Suspense, Component, ReactNode } from "react";

// ---------- TYPES ----------
interface ErrorBoundaryProps {
  children: ReactNode;
  tabId: string;
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// ---------- ERROR BOUNDARY ----------
class TabErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="tab-error">
          <div className="tab-error-icon">⚠️</div>
          <h3>Erreur de chargement</h3>
          <p>L'onglet <strong>{this.props.tabId}</strong> n'a pas pu être chargé.</p>
          <p className="tab-error-detail">{this.state.error?.message}</p>
          <button className="wh-btn-primary" onClick={this.handleRetry}>
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------- TAB SKELETON ----------
function TabSkeleton() {
  return (
    <div className="tab-skeleton">
      <div className="skeleton-header" />
      <div className="skeleton-row" />
      <div className="skeleton-row" />
      <div className="skeleton-row short" />
    </div>
  );
}

// ---------- TAB LOADER ----------
interface TabLoaderProps {
  tabId: string;
  children: ReactNode;
  onRetry?: () => void;
}

export function TabLoader({ tabId, children, onRetry }: TabLoaderProps) {
  return (
    <TabErrorBoundary tabId={tabId} onRetry={onRetry}>
      <Suspense fallback={<TabSkeleton />}>
        {children}
      </Suspense>
    </TabErrorBoundary>
  );
}

export default TabLoader;
