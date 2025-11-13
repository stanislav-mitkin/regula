import { buildAuditContext } from './audit';
import { checkPrivacyPolicyPresence, checkConsentCheckboxes, checkHttpsForms, checkCookieBanner } from './checks/freeChecks';
import { auditProgressMap } from '@/app/api/audit-state';
import { supabase } from '@/lib/supabase';

export async function freeAuditRunner(auditId: string, url: string) {
  auditProgressMap.set(auditId, { status: 'pending', progress: 0, checks: [] });
  const ctxRes = await buildAuditContext(url);
  if (!ctxRes.ok) {
    const message = ctxRes.error.message;
    auditProgressMap.set(auditId, { status: 'error', progress: 0, checks: [{ id: 'fetch_context', status: 'unknown', details: message }], risk_level: 'unknown' });
    await supabase
      .from('audit_requests')
      .update({ status: 'error', risk_level: 'unknown', completed_at: new Date().toISOString() })
      .eq('id', auditId);
    return;
  }
  const ctx = ctxRes.data;
  console.log('AUDIT_RUN_BEGIN', { auditId, origin: ctx.origin });
  const steps = [
    checkPrivacyPolicyPresence,
    checkConsentCheckboxes,
    checkHttpsForms,
    checkCookieBanner,
  ];
  const results = [] as Awaited<ReturnType<typeof checkPrivacyPolicyPresence>>[];
  for (let i = 0; i < steps.length; i++) {
    const fn = steps[i];
    const r = await fn(ctx);
    console.log('AUDIT_STEP', { auditId, step: i + 1, id: r.id, status: r.status });
    results.push(r);
    const entry = auditProgressMap.get(auditId);
    const progress = Math.round(((i + 1) / steps.length) * 100);
    const checks = (entry?.checks || []).concat({ id: r.id, status: r.status, details: r.details });
    auditProgressMap.set(auditId, { status: 'pending', progress, checks });
  }

  const fails = results.filter(r => r.status === 'fail').length;
  const risk_level = fails >= 2 ? 'high' : fails === 1 ? 'medium' : 'low';
  const violationsJson = results
    .filter(r => r.status === 'fail')
    .map(r => ({ id: `${auditId}-${r.id}`, type: r.id, description: r.details || 'Пункт не выполнен', severity: fails >= 2 ? 'high' : 'medium', details: {} }));

  await supabase
    .from('audit_requests')
    .update({ status: 'completed', violations: violationsJson, risk_level, completed_at: new Date().toISOString() })
    .eq('id', auditId);

  for (const v of violationsJson) {
    await supabase
      .from('violations')
      .insert({ audit_id: auditId, type: v.type, description: v.description, severity: v.severity, details: v.details });
  }

  auditProgressMap.set(auditId, { status: 'completed', progress: 100, checks: results.map(r => ({ id: r.id, status: r.status, details: r.details })), risk_level });
  console.log('AUDIT_RUN_END', { auditId, risk_level, fails });
}
