export interface Lead {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  lead_id: string;
  service_type: 'paid_report';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  price?: number;
  created_at: string;
}

export interface SubmitLeadRequest {
  name: string;
  email: string;
  captchaToken?: string;
}
