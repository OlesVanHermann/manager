// ============================================================
// SECURITY TAB - Gestion de la sécurité du compte
// Styles: ./SecurityTab.css (préfixe .security-)
// Service: ./SecurityTab.service.ts (ISOLÉ)
// Hook: ./SecurityTab.hooks.ts (ISOLÉ)
// Sections: ./SecurityTab.sections.tsx (ISOLÉ)
// Modals: ./SecurityTab.modals.tsx (ISOLÉ)
// ============================================================

import "./SecurityTab.css";
import { useTranslation } from "react-i18next";
import { useSecurityData } from "./SecurityTab.hooks";
import { PasswordSection, TwoFactorSection, IpRestrictionsSection } from "./SecurityTab.sections";
import { SecurityModals } from "./SecurityTab.modals";

// ============ COMPOSANT ============

export default function SecurityTab() {
  const { t } = useTranslation("home/account/security");
  const { t: tCommon } = useTranslation("common");
  const { state, modal, actions } = useSecurityData();

  // ---------- LOADING ----------
  if (state.loading) {
    return (
      <div className="security-tab">
        <div className="security-loading">
          <div className="security-spinner"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  // ---------- ERROR ----------
  if (state.error) {
    return (
      <div className="security-tab">
        <div className="security-error">
          <p>{t(`errors.${state.error}`, { defaultValue: state.error })}</p>
          <button onClick={actions.loadSecurityData} className="security-btn security-btn-primary">
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="security-tab">
      <PasswordSection onOpenModal={actions.openModal} />

      <TwoFactorSection status={state.status} onOpenModal={actions.openModal} />

      <IpRestrictionsSection
        ipRestrictions={state.ipRestrictions}
        ipDefaultRule={state.ipDefaultRule}
        onOpenModal={actions.openModal}
        onDeleteIp={actions.deleteIpRestriction}
      />

      <SecurityModals
        modal={modal}
        onClose={actions.closeModal}
        onSetFormData={actions.setFormData}
        onChangePassword={actions.changePassword}
        onAddSmsStep1={actions.addSmsStep1}
        onAddSmsStep2={actions.addSmsStep2}
        onResendSmsCode={actions.resendSmsCode}
        onDeleteSms={actions.deleteSms}
        onAddTotp={actions.addTotp}
        onDeleteTotp={actions.deleteTotp}
        onAddU2f={actions.addU2f}
        onDeleteU2f={actions.deleteU2f}
        onGenerateBackupCodes={actions.generateBackupCodes}
        onValidateBackupCodes={actions.validateBackupCodes}
        onDisable2fa={actions.disable2fa}
        onAddIpRestriction={actions.addIpRestriction}
      />
    </div>
  );
}
