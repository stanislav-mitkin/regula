## Цели
- В `lib/audit.ts` добавить устойчивую обработку ошибок сетевого запроса и валидации URL.
- Возвращать структурированное объяснение, почему проверка невозможна (403, таймаут, DNS и др.).
- Не менять другие файлы; оставить интеграцию потребителя без обязательных правок.

## Изменения в типах
- Добавить `AuditFetchErrorCode = 'invalid_url' | 'forbidden' | 'not_found' | 'server_unavailable' | 'timeout' | 'dns_error' | 'network_error' | 'ssl_error' | 'non_html' | 'unknown'`.
- Добавить интерфейс `AuditFetchError { code: AuditFetchErrorCode; message: string; details?: any }`.
- Изменить сигнатуру `buildAuditContext(url)` → возвращать `Promise<{ ok: true; data: AuditContext } | { ok: false; error: AuditFetchError }>`.

## Классификация ошибок
- Валидация URL: пусто/невалидно → `invalid_url`.
- Ответ `axios` с статусом:
  - `403` → `forbidden` («Доступ запрещён: сайт блокирует запросы»)
  - `404` → `not_found` («Страница не найдена»)
  - `>=500` → `server_unavailable` («Сервер недоступен или ошибка на сервере»)
- Ошибки запроса (`error.code`/`error.cause.code`):
  - `ECONNABORTED` → `timeout`
  - `ENOTFOUND` → `dns_error`
  - `ERR_NETWORK`/`ECONNREFUSED` → `network_error`
  - `EPROTO`/`SSL_*` → `ssl_error`
- Контент не строка/пустой/не HTML → `non_html`.
- Иное → `unknown`.

## Реализация
- Создать вспомогательную `classifyAxiosError(err): AuditFetchError`.
- В `buildAuditContext`:
  - Проверить и нормализовать URL (scheme, host).
  - Выполнить `axios.get(url, { timeout: 10000, maxRedirects: 5, validateStatus: () => true })`.
  - Для не‑2xx статуса вернуть `{ ok:false, error }`.
  - Проверить тип контента (строка) и базовые эвристики HTML; иначе `{ ok:false, error: non_html }`.
  - При успехе — собрать `AuditContext` как сейчас и вернуть `{ ok:true, data }`.
  - Любые исключения — через `classifyAxiosError`.

## Сообщения для пользователя (пример)
- 403: «Сайт запретил доступ (403). Проверка по открытому доступу невозможна.»
- Таймаут: «Не удалось получить ответ за разумное время (таймаут). Проверьте доступность сайта.»
- DNS: «Имя домена не найдено (DNS ошибка). Проверьте правильность адреса.»
- Сервер недоступен: «Сервер не отвечает или возвращает ошибку. Попробуйте позже.»
- Не HTML: «Главная страница не содержит HTML (возможен редирект/закрытый доступ).»

## Использование (без правок других файлов)
- Потребитель может проверять `result.ok` и при `false` показывать `result.error.message` пользователю.
- При желании, позже можно адаптировать оркестратор/API для статуса `error`.

## Проверка
- Юнит-тесты для `classifyAxiosError` (мокаем объекты ошибок/ответов).
- Ручные проверки: URL с 403/404, несуществующий домен, http без SSL, оффлайн симуляция.

Готов внести правки в `lib/audit.ts` согласно плану.