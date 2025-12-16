// ============================================================
// LOADING SPINNER
// ============================================================

import "./styles.css";

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <span>Loading...</span>
      </div>
    </div>
  );
}
