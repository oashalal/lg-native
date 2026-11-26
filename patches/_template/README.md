# Шаблон патча

Скопируйте папку в `patches/<id>`, измените `id`, `name`, scope и settings. `index.ts` является исходником; runtime loader исполняет собранный `index.js`.

## Проверка

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Для патчей `source`/`ast` добавьте `test.mjs` с проверкой фикстуры и запустите `node tools/dryrun/index.mjs`.

Патч не должен читать или сохранять cookies и токены, автоматизировать игровые действия либо отправлять запросы на произвольный URL, полученный из DOM. Для сетевых запросов используйте только заранее известные endpoint и ограничения `network` в манифесте. Для оформления HUD используйте `LGX.hud.button(id, label, handler)`, а для внешних данных — `LGX.ui.text(value)` или `LGX.ui.jsonView(value)`, не вставляя их как HTML. Полный контракт и примеры приведены в [docs/PATCHES.md](../../docs/PATCHES.md).
