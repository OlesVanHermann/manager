import { useTranslation } from "react-i18next";
import { useSecurityData, PasswordSection, TwoFactorSection, IpRestrictionsSection, SecurityModals } from "./security";

export default function SecurityTab() {
  const { t } = useTranslation('home/account/security');
  const { t: tCommon } = useTranslation('common');
  const { state, modal, actions } = useSecurityData();

  if (state.loading) {
    return (
      <div className="security-tab">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="security-tab">
        <div className="error-state">
          <p>{t(`errors.${state.error}`, { defaultValue: state.error })}</p>
          <button onClick={actions.loadSecurityData} className="btn btn-primary">{tCommon('actions.refresh')}</button>
        </div>
      </div>
    );
  }

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
