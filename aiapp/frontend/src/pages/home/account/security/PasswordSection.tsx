import { useTranslation } from "react-i18next";
import { IconPassword } from "./SecurityIcons";
import type { ModalType } from "./useSecurityData";

interface PasswordSectionProps {
  onOpenModal: (type: ModalType) => void;
}

export default function PasswordSection({ onOpenModal }: PasswordSectionProps) {
  const { t } = useTranslation('home/account/security');

  return (
    <div className="security-box">
      <div className="security-box-row">
        <div className="security-box-icon"><IconPassword /></div>
        <div className="security-box-content">
          <h3>{t('password.title')}</h3>
          <p>{t('password.description')}</p>
        </div>
        <div className="security-box-action">
          <button className="btn btn-primary" onClick={() => onOpenModal("password")}>
            {t('password.changeButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
