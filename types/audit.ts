export interface AuditRequest {
  id: string;
  url: string;
  status: 'pending' | 'completed' | 'failed';
  violations: Violation[];
  risk_level: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  created_at: string;
  completed_at?: string;
  email?: string;
  consent_given: boolean;
}

export interface Violation {
  id: string;
  audit_id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  created_at: string;
}

export interface StartAuditRequest {
  url: string;
  consent: boolean;
  email?: string;
  captchaToken?: string;
}

export interface StartAuditResponse {
  success: boolean;
  auditId: string;
  status: string;
}

export interface ReportStatusResponse {
  status: 'pending' | 'completed' | 'failed';
  violations: Violation[];
  riskLevel: string;
  summary: string;
}
