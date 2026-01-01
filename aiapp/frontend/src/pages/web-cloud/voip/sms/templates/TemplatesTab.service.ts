// ============================================================
// SMS TEMPLATES TAB SERVICE - API calls isolés
// ============================================================

interface Template {
  id: string;
  name: string;
  type: 'transactional' | 'marketing';
  content: string;
  characterCount: number;
  smsCount: number;
  createdAt: string;
}

export const templatesService = {
  async getTemplates(serviceName: string): Promise<Template[]> {
    try {
      // OVH SMS API doesn't have a native templates endpoint
      // Templates would typically be stored in a custom backend
      // Return empty array as placeholder
      return [];
    } catch {
      return [];
    }
  },

  async createTemplate(serviceName: string, template: Partial<Template>): Promise<Template> {
    // Custom implementation required
    const id = Date.now().toString();
    const content = template.content || '';
    return {
      id,
      name: template.name || 'New Template',
      type: template.type || 'transactional',
      content,
      characterCount: content.length,
      smsCount: Math.ceil(content.length / 160),
      createdAt: new Date().toISOString(),
    };
  },

  async updateTemplate(serviceName: string, templateId: string, template: Partial<Template>): Promise<Template> {
    // Custom implementation required
    throw new Error('Not implemented');
  },

  async deleteTemplate(serviceName: string, templateId: string): Promise<void> {
    // Custom implementation required
    throw new Error('Not implemented');
  },

  calculateSmsCount(content: string): number {
    if (!content || content.length === 0) return 0;
    // Standard SMS: 160 chars, concatenated: 153 chars per segment
    if (content.length <= 160) return 1;
    return Math.ceil(content.length / 153);
  },
};
