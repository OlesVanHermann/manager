// ============================================================
// FAX LOGO TAB SERVICE - API calls isolés
// ============================================================

import { ovhApi } from '../../../../../../services/api';

interface FaxLogo {
  id: string;
  name: string;
  size: number;
  url: string;
  uploadDate: string;
}

export const logoService = {
  async getLogo(serviceName: string): Promise<FaxLogo | null> {
    try {
      return await ovhApi.get<FaxLogo>(
        `/freefax/${serviceName}/voicemail/routing`
      );
    } catch {
      return null;
    }
  },

  async uploadLogo(
    serviceName: string,
    file: File
  ): Promise<FaxLogo> {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await fetch(
      `/api/ovh/freefax/${serviceName}/voicemail/routing`,
      {
        method: 'POST',
        body: formData,
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },

  async deleteLogo(serviceName: string): Promise<void> {
    await ovhApi.delete(
      `/freefax/${serviceName}/voicemail/routing`
    );
  },

  async getLogoPreview(serviceName: string): Promise<string> {
    try {
      const response = await fetch(
        `/api/ovh/freefax/${serviceName}/voicemail/routing/preview`,
        { credentials: 'include' }
      );
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch {
      return '';
    }
  },
};
