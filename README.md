# lg-native

Electron-клиент Linux для живого `https://legiongame.gg` с локальным движком интерфейсных патчей. Сайт остаётся источником истины; API и авторизация проходят напрямую.

```bash
pnpm install
pnpm test
pnpm start -- --channel=5opka
```

Для безопасного запуска без патчей: `pnpm start -- --safe-mode`. Секреты, cookie и профили не коммитятся. Архитектура и ограничения описаны в `docs/GUIDELINE.md`, решения — в `docs/DECISIONS.md`.
