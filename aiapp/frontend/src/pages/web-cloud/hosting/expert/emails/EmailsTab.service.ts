// ============================================================
// EMAILS TAB SERVICE - API calls for EmailsTab
// (from old_manager hosting-automated-emails.service.js + hosting-email.service.js)
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "../../../../../services/api";
import type { EmailQuota } from "../../hosting.types";

const BASE = "/hosting/web";

export const emailsService = {
  // --- Get automated emails info (from old_manager getAutomatedEmails) ---
  getAutomatedEmails: (sn: string) =>
    ovhGet<{
      bounce: number;
      email: string;
      maxPerDay: number;
      sent: number;
      sentToday: number;
      state: string;
    }>(`${BASE}/${sn}/email`).catch(() => null),

  // Alias for compatibility
  getEmailQuota: (sn: string) =>
    emailsService.getAutomatedEmails(sn),

  getEmailState: (sn: string) =>
    emailsService.getAutomatedEmails(sn),

  // --- Update email address (from old_manager putEmail) ---
  updateEmail: (sn: string, email: string) =>
    ovhPut<void>(`${BASE}/${sn}/email`, { email }),

  // --- Request action: BLOCK, UNBLOCK, PURGE (from old_manager postRequest) ---
  postEmailRequest: (sn: string, action: "BLOCK" | "UNBLOCK" | "PURGE") =>
    ovhPost<void>(`${BASE}/${sn}/email/request`, { action }),

  // Aliases for specific actions
  blockEmails: (sn: string) =>
    emailsService.postEmailRequest(sn, "BLOCK"),

  unblockEmails: (sn: string) =>
    emailsService.postEmailRequest(sn, "UNBLOCK"),

  purgeEmails: (sn: string) =>
    emailsService.postEmailRequest(sn, "PURGE"),

  // --- Get bounces with limit (from old_manager retrievingBounces) ---
  getEmailBounces: (sn: string, limit = 100) =>
    ovhGet<Array<{
      date: string;
      message: string;
      to: string;
    }>>(`${BASE}/${sn}/email/bounces`, {
      params: { limit },
    } as any).catch(() => []),

  // --- Metrics token (for statistics) ---
  getMetricsToken: (sn: string) =>
    ovhGet<{ token: string; warpUrl: string }>(`${BASE}/${sn}/metricsToken`).catch(() => null),

  // ============ EMAIL OPTIONS (from old_manager hosting-email.service.js) ============

  // Get email option IDs
  getEmailOptionList: (sn: string) =>
    ovhGet<number[]>(`${BASE}/${sn}/emailOption`).catch(() => []),

  // Get email option details
  getEmailOption: (sn: string, id: number) =>
    ovhGet<{
      id: number;
      domain: string;
      creationDate: string;
      type: string;
    }>(`${BASE}/${sn}/emailOption/${id}`),

  // Get email option service information (from old_manager OvhApiHostingWebEmailOption.serviceInfo)
  // Note: API uses "serviceInfos" with 's' at the end
  getEmailOptionServiceInfo: (sn: string, id: number) =>
    ovhGet<{
      serviceId: number;
      domain: string;
      status: string;
      expiration: string;
      renew: { automatic: boolean; forced: boolean; period?: string };
    }>(`${BASE}/${sn}/emailOption/${id}/serviceInfos`),

  // Terminate email option
  terminateEmailOption: (sn: string, id: number) =>
    ovhPost<void>(`${BASE}/${sn}/emailOption/${id}/terminate`, {}),

  // Get all email options with details
  getAllEmailOptions: async (sn: string) => {
    const ids = await emailsService.getEmailOptionList(sn);
    if (ids.length === 0) return [];
    return Promise.all(
      ids.map((id: number) => emailsService.getEmailOption(sn, id))
    );
  },

  // ============ ORDER EMAIL OPTION (from old_manager hosting-email.service.js) ============

  // Step 1: Create a new cart
  createCart: (ovhSubsidiary: string) =>
    ovhPost<{ cartId: string }>("/order/cart", { ovhSubsidiary }),

  // Step 2: Assign cart to current user
  assignCart: (cartId: string) =>
    ovhPost<void>(`/order/cart/${cartId}/assign`, {}),

  // Step 3: Get email service options available for hosting
  getEmailServiceOptions: (sn: string) =>
    ovhGet<Array<{
      planCode: string;
      family: string;
      prices: Array<{
        capacities: string[];
        duration: string;
        pricingMode: string;
        minimumQuantity: number;
        price: { value: number; text: string };
      }>;
    }>>(`/order/cartServiceOption/webHosting/${sn}`).catch(() => []),

  // Step 4: Add email option to cart
  addEmailOptionToCart: (cartId: string, sn: string, options: {
    duration: string;
    planCode: string;
    pricingMode: string;
    quantity: number;
  }) =>
    ovhPost<{ itemId: number }>(`/order/cartServiceOption/webHosting/${sn}`, {
      cartId,
      ...options,
    }),

  // Step 5: Add configuration item (legacy domain)
  addConfigurationItem: (cartId: string, itemId: number, label: string, value: string) =>
    ovhPost<void>(`/order/cart/${cartId}/item/${itemId}/configuration`, {
      label,
      value,
    }),

  // Step 6: Get checkout information
  getCheckoutInfo: (cartId: string) =>
    ovhGet<{
      prices: { withTax: { value: number; text: string }; withoutTax: { value: number; text: string } };
      contracts: Array<{ name: string; url: string; content: string }>;
    }>(`/order/cart/${cartId}/checkout`),

  // Step 7: Checkout (finalize order)
  checkoutCart: (cartId: string, options: { autoPayWithPreferredPaymentMethod?: boolean } = {}) =>
    ovhPost<{ orderId: number; url: string }>(`/order/cart/${cartId}/checkout`, options),

  // Helper: Complete order flow for email option
  orderEmailOption: async (
    sn: string,
    domainName: string,
    ovhSubsidiary: string,
    autoPayWithPreferredPaymentMethod = false
  ) => {
    // 1. Create cart
    const { cartId } = await emailsService.createCart(ovhSubsidiary);

    // 2. Assign cart
    await emailsService.assignCart(cartId);

    // 3. Get available options
    const options = await emailsService.getEmailServiceOptions(sn);
    const emailOption = options.find(
      (opt) => opt.family === "mxRedirect" && opt.prices.some((p) => p.pricingMode === "default")
    );

    if (!emailOption) {
      throw new Error("No email option available");
    }

    // 4. Get price with renew capacity
    const price = emailOption.prices.find((p) => p.capacities.includes("renew"));
    if (!price) {
      throw new Error("No valid price found");
    }

    // 5. Add to cart
    const { itemId } = await emailsService.addEmailOptionToCart(cartId, sn, {
      duration: price.duration,
      planCode: emailOption.planCode,
      pricingMode: price.pricingMode,
      quantity: price.minimumQuantity,
    });

    // 6. Add configuration (legacy domain)
    await emailsService.addConfigurationItem(cartId, itemId, "legacy_domain", domainName);

    // 7. Get checkout info
    const checkoutInfo = await emailsService.getCheckoutInfo(cartId);

    // 8. Checkout
    const order = await emailsService.checkoutCart(cartId, { autoPayWithPreferredPaymentMethod });

    return { ...order, checkoutInfo, cartId };
  },
};

export default emailsService;
