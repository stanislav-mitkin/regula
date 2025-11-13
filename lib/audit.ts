import axios, { AxiosError } from 'axios';

export interface ParsedInput {
  type: string;
  name?: string;
  value?: string;
  defaultChecked?: boolean;
}

export interface ParsedForm {
  method: string;
  action: string;
  inputs: ParsedInput[];
}

export interface AuditContext {
  url: string;
  origin: string;
  html: string;
  links: { href: string; text: string }[];
  forms: ParsedForm[];
}

export type AuditFetchErrorCode =
  | 'invalid_url'
  | 'forbidden'
  | 'not_found'
  | 'server_unavailable'
  | 'timeout'
  | 'dns_error'
  | 'network_error'
  | 'ssl_error'
  | 'non_html'
  | 'unknown';

export interface AuditFetchError {
  code: AuditFetchErrorCode;
  message: string;
  details?: any;
}

export type AuditContextResult =
  | { ok: true; data: AuditContext }
  | { ok: false; error: AuditFetchError };

export function normalizeUrl(input: string): string {
  const u = new URL(input);
  const origin = u.origin;
  const hasOnlyRoot = u.pathname === '/' && !u.search && !u.hash;
  if (hasOnlyRoot) return origin;
  const path = u.pathname.endsWith('/') && u.pathname !== '/' ? u.pathname.slice(0, -1) : u.pathname;
  return `${origin}${path}${u.search}${u.hash}`;
}

export async function buildAuditContext(url: string): Promise<AuditContextResult> {
  // Validate URL
  let normalized: URL;
  try {
    normalized = new URL(url);
    if (!/^https?:$/.test(normalized.protocol)) {
      return {
        ok: false,
        error: { code: 'invalid_url', message: 'Неверная схема URL. Допустимы только http/https.' }
      };
    }
  } catch {
    return { ok: false, error: { code: 'invalid_url', message: 'Невалидный адрес сайта. Проверьте правильность URL.' } };
  }

  try {
    const canon = normalizeUrl(normalized.toString());
    const response = await axios.get(canon, {
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true,
    });

    const status = response.status;
    if (status === 403) {
      return { ok: false, error: { code: 'forbidden', message: 'Доступ запрещён (403). Проверка невозможна.' } };
    }
    if (status === 404) {
      return { ok: false, error: { code: 'not_found', message: 'Страница не найдена (404). Проверьте URL.' } };
    }
    if (status >= 500) {
      return { ok: false, error: { code: 'server_unavailable', message: 'Ошибка на сервере сайта. Попробуйте позже.' } };
    }
    if (status < 200 || status >= 300) {
      return { ok: false, error: { code: 'unknown', message: `Неожиданный статус ответа (${status}).` } };
    }

    const data = response.data;
    const html = typeof data === 'string' ? data : '';
    const origin = new URL(canon).origin;
    if (!isLikelyHtml(html)) {
      return { ok: false, error: { code: 'non_html', message: 'Полученный контент не является HTML. Проверка невозможна.' } };
    }

    return {
      ok: true,
      data: {
        url: canon,
        origin,
        html,
        links: parseLinks(html, origin),
        forms: parseForms(html, origin),
      },
    };
  } catch (err) {
    return { ok: false, error: classifyAxiosError(err) };
  }
}

export function resolveUrl(base: string, href: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

export function parseLinks(html: string, base: string): { href: string; text: string }[] {
  const results: { href: string; text: string }[] = [];
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRegex.exec(html)) !== null) {
    const href = resolveUrl(base, m[1]);
    const text = m[2].replace(/<[^>]*>/g, '').trim();
    results.push({ href, text });
  }
  return results;
}

export function parseForms(html: string, base: string): ParsedForm[] {
  const results: ParsedForm[] = [];
  const formRegex = /<form\b[\s\S]*?<\/form>/gi;
  const actionRegex = /action=["']([^"']+)["']/i;
  const methodRegex = /method=["']([^"']+)["']/i;
  const inputRegex = /<input\b[^>]*>/gi;
  const typeRegex = /type=["']([^"']+)["']/i;
  const nameRegex = /name=["']([^"']+)["']/i;
  const valueRegex = /value=["']([^"']*)["']/i;
  const checkedRegex = /checked\b/i;
  let m: RegExpExecArray | null;
  while ((m = formRegex.exec(html)) !== null) {
    const formHtml = m[0];
    const actionMatch = actionRegex.exec(formHtml);
    const methodMatch = methodRegex.exec(formHtml);
    const action = resolveUrl(base, actionMatch ? actionMatch[1] : '');
    const method = (methodMatch ? methodMatch[1] : 'GET').toUpperCase();
    const inputs: ParsedInput[] = [];
    let im: RegExpExecArray | null;
    while ((im = inputRegex.exec(formHtml)) !== null) {
      const inputHtml = im[0];
      const type = (typeRegex.exec(inputHtml)?.[1] || 'text').toLowerCase();
      const name = nameRegex.exec(inputHtml)?.[1];
      const value = valueRegex.exec(inputHtml)?.[1];
      const defaultChecked = checkedRegex.test(inputHtml);
      inputs.push({ type, name, value, defaultChecked });
    }
    results.push({ method, action, inputs });
  }
  return results;
}

function isLikelyHtml(html: string): boolean {
  if (!html || typeof html !== 'string') return false;
  const head = html.slice(0, 1000).toLowerCase();
  return head.includes('<html') || head.includes('<!doctype html');
}

function classifyAxiosError(error: any): AuditFetchError {
  const axiosErr = error as AxiosError;
  const code = axiosErr.code || (axiosErr.cause && (axiosErr.cause as any).code) || '';
  if (code === 'ECONNABORTED') return { code: 'timeout', message: 'Истекло время ожидания ответа от сайта.' };
  if (code === 'ENOTFOUND') return { code: 'dns_error', message: 'Имя домена не найдено (DNS ошибка). Проверьте адрес.' };
  if (code === 'ERR_NETWORK' || code === 'ECONNREFUSED') return { code: 'network_error', message: 'Сетевая ошибка. Сервер недоступен или отсутствует подключение к интернету.' };
  if (code?.startsWith('SSL') || code === 'EPROTO') return { code: 'ssl_error', message: 'Ошибка SSL/протокола при подключении к сайту.' };
  return { code: 'unknown', message: 'Не удалось выполнить запрос к сайту по неизвестной причине.', details: { code } };
}
