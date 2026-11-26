# Шаблон сетевого runtime-патча

Шаблон показывает разделение page runtime и network isolated runtime. Манифест выключен (`enabled: false`); включайте патч только после настройки allowlist и проверки в целевом окружении.

- `index.ts` — страничная кнопка и modal через `LGX.hud.button` / `LGX.modal`.
- `network.js` — сетевой isolated runtime. Вызывает только заранее объявленный HTTPS URL, разбирает JSON как данные и передаёт результат как текст.
- `patch.json` — host/path allowlist и ограничение размера ответа.

Для адаптации задайте уникальный ID, согласуйте `network.hosts`/`network.endpoints` с URL в `network.js`, затем соберите `index.ts` в `index.js` (runtime loader не исполняет TypeScript напрямую). Не добавляйте cookies, токены, авторизацию или код для выполнения из ответа.

Каждый page-скрипт патча запускается в собственном scope: loader создаёт локальный `LGX` со `channel`, установленным `installChannel(patchId, '', 'page')`. Network-скрипт получает отдельный локальный `LGX` со `installChannel(patchId, '', 'isolated')`, свой `net` и UI-хелперы. `installChannel` связывает эти стороны через `window.postMessage`, фильтруя по ID патча, tabId и противоположному world; в текущем wiring tabId — пустая строка с обеих сторон. Это транспорт только в пределах документа и ID патча, не секретный и не аутентифицированный: код сайта может читать и подделывать сообщения. Принимайте по нему только ожидаемые данные и повторно валидируйте их в получателе.

Network runtime использует `LGX.net.json(url, options?)` и `LGX.log(id, ...values)`; JSON остаётся данными и ограничивается по длине перед логированием. При использовании `LGX.net.poll(url, intervalMs, callback, { onError })` ошибки доступны обработчику `onError`, а polling продолжает работу. UI использует page API `LGX.hud.button(id, label, onClick)` и `LGX.modal(id, content)`. В этом шаблоне пример modal намеренно статичен; не выводите недоверенные сообщения через HTML и не используйте DOM events как альтернативный канал.

Проверки:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
```

Политика сети и ограничения описаны в [docs/PATCHES.md](../../docs/PATCHES.md).
