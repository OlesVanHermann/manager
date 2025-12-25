import { useState, useEffect, useCallback } from "react";
import type { OvhCredentials } from "../../../../types/auth.types";
import * as securityTabService from "../tabs/security/SecurityTab.service";

const STORAGE_KEY = "ovh_credentials";

function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export type ModalType = "sms" | "totp" | "u2f" | "backup" | "ip" | "password" | "disable2fa" | "deleteSms" | "deleteTotp" | "deleteU2f" | null;

export interface SecurityState {
  loading: boolean;
  error: string | null;
  status: securityTabService.TwoFactorStatus | null;
  ipRestrictions: securityTabService.IpRestriction[];
  ipDefaultRule: securityTabService.IpDefaultRule | null;
}

export interface ModalState {
  activeModal: ModalType;
  modalLoading: boolean;
  modalError: string | null;
  modalSuccess: string | null;
  totpSecret: securityTabService.TotpSecret | null;
  formData: Record<string, string>;
  deleteTargetId: number | null;
  smsStep: "phone" | "code";
  pendingSmsId: number | null;
}

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

  const loadSecurityData = useCallback(async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setState(s => ({ ...s, error: "notAuthenticated", loading: false }));
      return;
    }
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const [twoFactorStatus, restrictions, defaultRule] = await Promise.all([
        securityTabService.getTwoFactorStatus(credentials),
        securityTabService.getIpRestrictions(credentials),
        securityTabService.getIpDefaultRule(credentials),
      ]);
      setState({ loading: false, error: null, status: twoFactorStatus, ipRestrictions: restrictions, ipDefaultRule: defaultRule });
    } catch (err) {
      setState(s => ({ ...s, error: err instanceof Error ? err.message : "loadError", loading: false }));
    }
  }, []);

  useEffect(() => { loadSecurityData(); }, [loadSecurityData]);

  const openModal = (type: ModalType, targetId?: number) => {
    setModal({ activeModal: type, modalError: null, modalSuccess: null, formData: {}, totpSecret: null, deleteTargetId: targetId ?? null, smsStep: "phone", pendingSmsId: null, modalLoading: false });
  };

  const closeModal = () => {
    setModal({ activeModal: null, modalError: null, modalSuccess: null, formData: {}, totpSecret: null, deleteTargetId: null, smsStep: "phone", pendingSmsId: null, modalLoading: false });
  };

  const setModalLoading = (v: boolean) => setModal(m => ({ ...m, modalLoading: v }));
  const setModalError = (v: string | null) => setModal(m => ({ ...m, modalError: v }));
  const setModalSuccess = (v: string | null) => setModal(m => ({ ...m, modalSuccess: v }));
  const setFormData = (v: Record<string, string>) => setModal(m => ({ ...m, formData: v }));
  const setTotpSecret = (v: securityTabService.TotpSecret | null) => setModal(m => ({ ...m, totpSecret: v }));
  const setSmsStep = (v: "phone" | "code") => setModal(m => ({ ...m, smsStep: v }));
  const setPendingSmsId = (v: number | null) => setModal(m => ({ ...m, pendingSmsId: v }));

  // Actions
  const changePassword = async () => {
    const credentials = getCredentials();
    if (!credentials) return;
    setModalLoading(true); setModalError(null); setModalSuccess(null);
    try {
      await securityTabService.changePassword(credentials);
      setModalSuccess("passwordEmailSent");
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally { setModalLoading(false); }
  };

  const addSmsStep1 = async (phone: string) => {
    const credentials = getCredentials();
    if (!credentials || !phone) return;
    setModalLoading(true); setModalError(null); setModalSuccess(null);
    try {
      const smsEntry = await securityTabService.addSms(credentials, phone);
      setPendingSmsId(smsEntry.id);
      await securityTabService.sendSmsCode(credentials, smsEntry.id);
      setSmsStep("code");
      setModalSuccess("smsSent");
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally { setModalLoading(false); }
  };

  const addSmsStep2 = async (code: string) => {
    const credentials = getCredentials();
    if (!credentials || modal.pendingSmsId === null || !code) return;
    setModalLoading(true); setModalError(null);
    try {
      await securityTabService.validateSms(credentials, modal.pendingSmsId, code);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "invalidCode");
    } finally { setModalLoading(false); }
  };

  const resendSmsCode = async () => {
    const credentials = getCredentials();
    if (!credentials || modal.pendingSmsId === null) return;
    setModalLoading(true); setModalError(null); setModalSuccess(null);
    try {
      await securityTabService.sendSmsCode(credentials, modal.pendingSmsId);
      setModalSuccess("codeResent");
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally { setModalLoading(false); }
  };

  const deleteSms = async () => {
    const credentials = getCredentials();
    if (!credentials || modal.deleteTargetId === null) return;
    setModalLoading(true); setModalError(null);
    try {
      await securityTabService.deleteSms(credentials, modal.deleteTargetId);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally { setModalLoading(false); }
  };

  const addTotp = async (code?: string) => {
    const credentials = getCredentials();
    if (!credentials) return;
    setModalLoading(true); setModalError(null);
    try {
      if (!modal.totpSecret) {
        const secret = await securityTabService.addTotp(credentials);
        setTotpSecret(secret);
      } else if (code) {
        await securityTabService.validateTotp(credentials, modal.totpSecret.id, code);
        await loadSecurityData();
        closeModal();
      }
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally { setModalLoading(false); }
  };

  const deleteTotp = async () => {
    const credentials = getCredentials();
    if (!credentials || modal.deleteTargetId === null) return;
    setModalLoading(true); setModalError(null);
    try {
      await securityTabService.deleteTotp(credentials, modal.deleteTargetId);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally { setModalLoading(false); }
  };

  const addU2f = async () => {
    const credentials = getCredentials();
    if (!credentials) return;
    setModalLoading(true); setModalError(null);
    try {
      const challenge = await securityTabService.addU2f(credentials);
      setModalSuccess("u2fCreated");
      await loadSecurityData();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally { setModalLoading(false); }
  };

  const deleteU2f = async () => {
    const credentials = getCredentials();
    if (!credentials || modal.deleteTargetId === null) return;
    setModalLoading(true); setModalError(null);
    try {
      await securityTabService.deleteU2f(credentials, modal.deleteTargetId);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally { setModalLoading(false); }
  };

  const generateBackupCodes = async () => {
    const credentials = getCredentials();
    if (!credentials) return;
    setModalLoading(true); setModalError(null);
    try {
      const result = await securityTabService.generateBackupCodes(credentials);
      setFormData({ ...modal.formData, codes: result.codes.join("\n") });
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally { setModalLoading(false); }
  };

  const validateBackupCodes = async (code: string) => {
    const credentials = getCredentials();
    if (!credentials || !code) return;
    setModalLoading(true); setModalError(null);
    try {
      await securityTabService.validateBackupCodes(credentials, code);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "invalidCode");
    } finally { setModalLoading(false); }
  };

  const disable2fa = async (code: string) => {
    const credentials = getCredentials();
    if (!credentials || !code) return;
    setModalLoading(true); setModalError(null);
    try {
      await securityTabService.disableBackupCodes(credentials, code);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "invalidCode");
    } finally { setModalLoading(false); }
  };

  const addIpRestriction = async (ip: string, rule: "accept" | "deny", warning: boolean) => {
    const credentials = getCredentials();
    if (!credentials || !ip) return;
    setModalLoading(true); setModalError(null);
    try {
      await securityTabService.addIpRestriction(credentials, ip, rule, warning);
      await loadSecurityData();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "error");
    } finally { setModalLoading(false); }
  };

  const deleteIpRestriction = async (id: number) => {
    const credentials = getCredentials();
    if (!credentials) return;
    try {
      await securityTabService.deleteIpRestriction(credentials, id);
      await loadSecurityData();
    } catch (err) {
      setState(s => ({ ...s, error: err instanceof Error ? err.message : "error" }));
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
