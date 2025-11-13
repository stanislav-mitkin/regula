## Диагностика
- Причина «riskLevel=unknown»: в `get-report-status` при наличии in-memory записи (`auditProgressMap`) мы не читаем `risk_level` из БД и не храним его в памяти.
- Код: `app/api/get-report-status/route.ts:19` инициализирует `risk_level='unknown'` и обновляет его только при чтении из БД, если памяти нет. При наличии памяти он остаётся 'unknown'.
- `auditProgressMap` не содержит `risk_level`, `lib/freeAuditRunner.ts` пишет его только в БД.

## План правок
1. Расширить структуру `auditProgressMap`:
   - Файл: `app/api/audit-state.ts` — добавить поле `risk_level?: string` в `AuditProgressEntry`.
   - `lib/freeAuditRunner.ts` — записывать `risk_level` в карту при завершении (`completed`) и при ошибке (`unknown`).

2. Всегда получать `risk_level` из БД в `get-report-status`:
   - Файл: `app/api/get-report-status/route.ts` — независимо от наличия памяти выполнить запрос `audit_requests` по `id` и использовать `audit.risk_level` для ответа.
   - Использовать память только для `progress` и `checks`, чтобы исключить расхождение.

3. Согласование с `start-audit`:
   - Проверить, что `normalizeUrl` уже применяется (есть в `app/api/start-audit/route.ts:37`) — ок.
   - Логи начала/шага/завершения — оставляем, они помогают отладке.

4. Верификация
- Запустить бесплатную проверку, дождаться завершения, убедиться, что `riskLevel` возвращается из БД (не 'unknown'), например при одной неуспешной проверке — `medium`.
- Проверить, что при `error` фронт показывает сообщение и прекращает пулинг (уже реализовано в `HeroSection`).

Готов внести указанные изменения и проверить корректность riskLevel.