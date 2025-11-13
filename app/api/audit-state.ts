export type AuditProgressEntry = {
  status: 'pending' | 'completed' | 'error';
  progress: number;
  checks: Array<{ id: string; status: string; details?: string }>;
  risk_level?: string;
};

export const auditProgressMap = new Map<string, AuditProgressEntry>();
