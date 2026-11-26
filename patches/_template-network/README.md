# Шаблон сетевого runtime-патча

Экспериментальная заготовка, не готовая к использованию: production lifecycle и сетевой IPC ещё не подтверждены e2e, а межмировой канал и isolated UI не завершены. Манифест выключен (`enabled: false`).

- `index.ts` — страничная кнопка и modal через `LGX.hud.button` / `LGX.modal`.
- `network.js` — сетевой isolated runtime. Вызывает только заранее объявленный HTTPS URL, разбирает JSON как данные и передаёт результат как текст.
- `patch.json` — host/path allowlist и ограничение размера ответа.

После завершения реализации для адаптации потребуется задать уникальный ID и согласованные `network.hosts`/`network.endpoints` и URL в `network.js`, а также собрать page исходник в `index.js` (runtime loader не исполняет TypeScript напрямую). Не добавляйте cookies, токены, авторизацию или код для выполнения из ответа.

Network runtime использует `LGX.net.json(url, options?)` и `LGX.log(id, ...values)`; JSON остаётся данными и ограничивается по длине перед логированием. UI использует page API `LGX.hud.button(id, label, onClick)` и `LGX.modal(id, content)`. Изолированные и page worlds не имеют подтверждённого межмирового UI-канала в этом шаблоне, поэтому modal содержит статичный безопасный пример, а результат сетевого запроса не передаётся через DOM events. Не используйте `LGX.channel` как межмировой транспорт, пока его реализация не обеспечит такую связь.

Выполните проверки репозитория после интеграции:

```bash
pnpm typecheck
pnpm lint
pnpm test
```

Политика сети и ограничения описаны в [docs/PATCHES.md](../../docs/PATCHES.md).
