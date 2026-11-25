# Шаблон патча

Скопируйте папку в `patches/<id>`, измените `id`, `name`, scope и settings. `index.ts` является исходником; runtime loader исполняет собранный `index.js`.

Проверьте:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Для `source`/`ast` добавьте `test.mjs` и прогоните `node tools/dryrun/index.mjs`. Не используйте cookies, токены, автоматизацию игровых действий или произвольный URL из DOM. Полный контракт описан в [docs/PATCHES.md](../../docs/PATCHES.md).
