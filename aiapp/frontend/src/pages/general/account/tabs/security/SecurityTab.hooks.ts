// ============================================================
// SECURITY TAB HOOKS - Hook ISOLÉ pour les données sécurité
// Import UNIQUEMENT depuis ./SecurityTab.service (local)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import * as securityService from "./SecurityTab.service";

// ============ TYPES ============

export type ModalType =
  | "password"
  | "sms"
  | "deleteSms"
  | "totp"
  | "deleteTotp"
  | "u2f"
  | "deleteU2f"
  | "backup"
  | "disable2fa"
  | "ip"
  | null;

export interface SecurityState {
  loading: boolean;
  error: string | null;
  status: securityService.TwoFactorStatus | null;
  ipRestrictions: securityService.IpRestriction[];
  ipDefaultRule: securityService.IpDefaultRule | null;
}

export interface ModalState {
  activeModal: ModalType;
  modalLoading: boolean;
  modalError: string | null;
  modalSuccess: string | null;
  totpSecret: securityService.TotpSecret | null;
  formData: Record<string, string>;
  deleteTargetId: number | null;
  smsStep: "phone" | "code";
  pendingSmsId: number | null;
}

// ============ HOOK ============

export function useSecurityData() {
  const [state, setState] = useState<SecurityState>({
    loading: true,
    error: null,
    status: null,
    ipRestrictions: [],
    ipDefaultRule: null,
  });

  const [modal, setModal] = useState<ModalState>({
    activeModal: null,
    modalLoading: false,
    modalError: null,
    modalSuccess: null,
    totpSecret: null,
    formData: {},
    deleteTargetId: null,
    smsStep: "phone",
    pendingSmsId: null,
  });

  // ---------- LOAD DATA ----------
  const loadSecurityData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [twoFactorStatus, restrictions, defaultRule] = await Promise.all([
        securityService.getTwoFactorStatus(),
        securityService.getIpRestrictions(),
        securityService.getIpDefaultRule(),
      ]);
      setState({
        loading: false,
        error: null,
        status: twoFactorStatus,
        ipRestrictions: restrictions,
        ipDefaultRule: defaultRule,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        error: err instanceof Error ? err.message : "loadError",
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    loadSecurityData();
  }, [loadSecurityData]);

  // ---------- MODAL HELPERS ----------
  const openModal = (type: ModalType, targetId?: number) => {
    setModal({
      activeModal: type,
      modalError: null,
      modalSuccess: null,
      formData: {},
      totpSecret: null,
      deleteTargetId: targetId ?? null,
      smsStep: "phone",
      pendingSmsId: null,
      modalLoading: false,
    });
  };

  const closeModal = () => {
    setModal({
      activeModal: null,
      modalError: null,
      modalSuccess: null,
      formData: {},
      totpSecret: null,
      deleteTargetId: null,
      smsStep: "phone",
      pendingSmsId: null,
      modalLoading: false,
    });
  };

  const setModalLoading = (v: boolean) => setModal((m) => ({ ...m, modalLoading: v }));
  const setModalError = (v: string | null) => setModal((m) => ({ ...m, modalError: v }));
  const setModalSuccess = (v: string | null) => setModal((m) => ({ ...m, modalSuccess: v }));
  const setFormData = (v: Record<string, string>) => setModal((m) => ({ ...m, formData: v }));
  const setTotpSecret = (v: securityService.TotpSecret | null) => setModal((m) => ({ ...m, totpSecret: v }));
  const setSmsStep = (v: "phone" | "code") => setModal((m) => ({ ...m, smsStep: v }));
  const setPendingSmsId = (v: number | null) => setModal((m) => ({ ...m, pendingSmsId: v }));

  // ---------- PASSWORD ACTION ----------
  const changePassword = async () => {
    setModalLoading(true);
    setModalError(null);
    setModalSuccess(null);
    try {
      await securityService.changePassword("", "");
      setModalSuccess("passwordEmailSent");
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally {
      setModalLoading(false);
    }
  };

  // ---------- SMS ACTIONS ----------
  const addSmsStep1 = async (phone: string) => {
    if (!phone) return;
    setModalLoading(true);
    setModalError(null);
    setModalSuccess(null);
    try {
      const smsEntry = await securityService.addSms(phone);
      setPendingSmsId(smsEntry.id);
      await securityService.sendSmsCode(smsEntry.id);
      setSmsStep("code");
      setModalSuccess("smsSent");
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally {
      setModalLoading(false);
    }
  };

  const addSmsStep2 = async (code: string) => {
    if (modal.pendingSmsId === null || !code) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.validateSms(modal.pendingSmsId, code);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "invalidCode");
    } finally {
      setModalLoading(false);
    }
  };

  const resendSmsCode = async () => {
    if (modal.pendingSmsId === null) return;
    setModalLoading(true);
    setModalError(null);
    setModalSuccess(null);
    try {
      await securityService.sendSmsCode(modal.pendingSmsId);
      setModalSuccess("codeResent");
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally {
      setModalLoading(false);
    }
  };

  const deleteSms = async () => {
    if (modal.deleteTargetId === null) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.deleteSms(modal.deleteTargetId);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally {
      setModalLoading(false);
    }
  };

  // ---------- TOTP ACTIONS ----------
  const addTotp = async (code?: string) => {
    setModalLoading(true);
    setModalError(null);
    try {
      if (!modal.totpSecret) {
        const secret = await securityService.addTotp();
        setTotpSecret(secret);
      } else if (code) {
        await securityService.validateTotp(modal.totpSecret.id, code);
        await loadSecurityData();
        closeModal();
      }
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally {
      setModalLoading(false);
    }
  };

  const deleteTotp = async () => {
    if (modal.deleteTargetId === null) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.deleteTotp(modal.deleteTargetId);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally {
      setModalLoading(false);
    }
  };

  // ---------- U2F ACTIONS ----------
  const addU2f = async () => {
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.addU2f();
      setModalSuccess("u2fCreated");
      await loadSecurityData();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally {
      setModalLoading(false);
    }
  };

  const deleteU2f = async () => {
    if (modal.deleteTargetId === null) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.deleteU2f(modal.deleteTargetId);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally {
      setModalLoading(false);
    }
  };

  // ---------- BACKUP CODES ACTIONS ----------
  const generateBackupCodes = async () => {
    setModalLoading(true);
    setModalError(null);
    try {
      const result = await securityService.generateBackupCodes();
      setFormData({ ...modal.formData, codes: result.codes.join("\n") });
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally {
      setModalLoading(false);
    }
  };

  const validateBackupCodes = async (code: string) => {
    if (!code) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.validateBackupCodes(code);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "invalidCode");
    } finally {
      setModalLoading(false);
    }
  };

  const disable2fa = async (code: string) => {
    if (!code) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.disableBackupCodes(code);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "invalidCode");
    } finally {
      setModalLoading(false);
    }
  };

  // ---------- IP RESTRICTION ACTIONS ----------
  const addIpRestriction = async (ip: string, rule: "accept" | "deny", warning: boolean) => {
    if (!ip) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await securityService.addIpRestriction(ip, rule, warning);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally {
      setModalLoading(false);
    }
  };

  const deleteIpRestriction = async (id: number) => {
    try {
      await securityService.deleteIpRestriction(id);
      await loadSecurityData();
    } catch (err) {
      setState((s) => ({ ...s, error: err instanceof Error ? err.message : "error" }));
    }
  };

  return {
    state,
    modal,
    actions: {
      loadSecurityData,
      openModal,
      closeModal,
      setFormData,
      changePassword,
      addSmsStep1,
      addSmsStep2,
      resendSmsCode,
      deleteSms,
      addTotp,
      deleteTotp,
      addU2f,
      deleteU2f,
      generateBackupCodes,
      validateBackupCodes,
      disable2fa,
      addIpRestriction,
      deleteIpRestriction,
    },
  };
}
