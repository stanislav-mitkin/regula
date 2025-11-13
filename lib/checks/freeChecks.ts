import { AuditContext } from '../audit';

export type CheckId = 'privacy_policy_presence' | 'consent_checkboxes' | 'https_forms' | 'cookie_banner';

export type CheckStatus = 'pass' | 'fail' | 'unknown';

export interface CheckResult {
  id: CheckId;
  status: CheckStatus;
  details?: string;
  evidence?: Record<string, unknown>;
}

export async function checkPrivacyPolicyPresence(ctx: AuditContext): Promise<CheckResult> {
  const id: CheckId = 'privacy_policy_presence';
  const candidates = ctx.links.filter(l => {
    const text = l.text.toLowerCase();
    return text.includes('политика конфиденциальности') || l.href.toLowerCase().includes('/privacy');
  });
  if (candidates.length === 0) {
    return { id, status: 'fail', details: 'Ссылка на Политику не найдена' };
  }
  return { id, status: 'pass', evidence: { links: candidates.slice(0, 3) } };
}

export async function checkConsentCheckboxes(ctx: AuditContext): Promise<CheckResult> {
  const id: CheckId = 'consent_checkboxes';
  const dataForms = ctx.forms.filter(f => {
    const textInputs = f.inputs.filter(i => ['text','email','tel','password'].includes(i.type));
    return textInputs.length >= 1;
  });
  if (dataForms.length === 0) {
    return { id, status: 'unknown', details: 'Формы сбора данных не обнаружены' };
  }
  const formsWithoutConsent = dataForms.filter(f => !f.inputs.some(i => i.type === 'checkbox'));
  const prechecked = dataForms.filter(f => f.inputs.some(i => i.type === 'checkbox' && i.defaultChecked));
  if (formsWithoutConsent.length > 0 || prechecked.length > 0) {
    return {
      id,
      status: 'fail',
      details: 'Не во всех формах есть явные чекбоксы согласия или есть предустановленные галочки',
      evidence: { formsWithoutConsentCount: formsWithoutConsent.length, precheckedCount: prechecked.length }
    };
  }
  return { id, status: 'pass', evidence: { formsChecked: dataForms.length } };
}

export async function checkHttpsForms(ctx: AuditContext): Promise<CheckResult> {
  const id: CheckId = 'https_forms';
  const isHttpsOrigin = ctx.origin.startsWith('https://');
  const insecureActions = ctx.forms
    .map(f => f.action)
    .filter(a => a && a.startsWith('http://'));
  if (!isHttpsOrigin || insecureActions.length > 0) {
    return {
      id,
      status: 'fail',
      details: 'Найдены небезопасные способы передачи данных (HTTP)',
      evidence: { origin: ctx.origin, insecureActions }
    };
  }
  return { id, status: 'pass' };
}

export async function checkCookieBanner(ctx: AuditContext): Promise<CheckResult> {
  const id: CheckId = 'cookie_banner';
  const html = ctx.html.toLowerCase();
  const hasCookieWords = html.includes('cookie') || html.includes('cookies') || html.includes('файлы cookie') || html.includes('куки');
  const hasCookieClass = /class=["'][^"']*cookie[^"']*["']/i.test(ctx.html) || /id=["'][^"']*cookie[^"']*["']/i.test(ctx.html);
  if (hasCookieWords || hasCookieClass) {
    return { id, status: 'pass' };
  }
  return { id, status: 'fail', details: 'Баннер/плашка cookies не обнаружены' };
}

export async function runAllChecks(ctx: AuditContext): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  results.push(await checkPrivacyPolicyPresence(ctx));
  results.push(await checkConsentCheckboxes(ctx));
  results.push(await checkHttpsForms(ctx));
  results.push(await checkCookieBanner(ctx));
  return results;
}

