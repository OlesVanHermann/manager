// ============================================================
// SECURITY TAB - Gestion de la sécurité du compte
// Styles: ./SecurityTab.css (préfixe .account-security-)
// ============================================================

import "./SecurityTab.css";
import { useTranslation } from "react-i18next";
import { useSecurityData } from "./SecurityTab.hooks";
import { PasswordSection, TwoFactorSection, IpRestrictionsSection } from "./SecurityTab.sections";
import { SecurityModals } from "./SecurityTab.modals";

export function SecurityTab() {
  const { t } = useTranslation("general/account/security");
  const { t: tCommon } = useTranslation("common");
  const { state, modal, actions } = useSecurityData();

  if (state.loading) {
    return (
      <div className="account-security-tab">
        <div className="account-security-loading">
          <div className="account-security-spinner"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="account-security-tab">
        <div className="account-security-error">
          <p>{t(`errors.${state.error}`, { defaultValue: state.error })}</p>
          <button onClick={actions.loadSecurityData} className="account-security-btn account-security-btn-primary">
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="account-security-tab">
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
