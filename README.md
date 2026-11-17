# lg-native

Electron-клиент под Linux для живого сайта игры «Легион» (`https://legiongame.gg`) с локальным движком интерфейсных патчей. Сайт остаётся источником истины; API и авторизация проходят напрямую.

## Что входит

- Оболочка Electron: загружает `/c/<канал>/`, получает обновления сайта.
- Слой перехвата запросов (`protocol.handle`) и дисковый кэш версионированных файлов (`?v=`).
- Движок патчей: типы `css`, `runtime`, `source`, `ast`, `native` — с отчётами, safe mode и откатом.
- Мультиаккаунт: отдельная Chromium Session на профиль, вкладки через `WebContentsView`.
- Нативные функции: трей, уведомления, горячие клавиши, синхронная тема окон с сайтом.
- Инструменты совместимости: `tools/snapshot`, `tools/dryrun`, реестр `compat/matrix.json`.
- Юнит-тесты (vitest) и Electron e2e (Playwright).

## Быстрый старт

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm start -- --channel=5opka
```

- `--safe-mode` — запуск без патчей.
- e2e: `pnpm test:e2e` (без дисплея: `xvfb-run -a pnpm test:e2e`).
- Сборка Flatpak: `pnpm package:flatpak`.

## Структура репозитория

```
lg-native/
├─ src/
│  ├─ main/       процесс Electron main (app, аккаунты, сеть, патчи, нативное, IPC)
│  ├─ preload/    узкий мост contextBridge к миру страницы
│  ├─ runtime/    код в мире страницы (API LGX)
│  └─ shared/     типы, схема манифеста, константы
├─ patches/       локальные патчи (копия patches/_template)
├─ tools/         snapshot, dryrun
├─ fixtures/      снапшоты сайта по версиям
├─ tests/         юнит-тесты и e2e
├─ docs/          документация (см. ниже)
└─ compat/matrix.json  реестр совместимости патч × версия
```

## Документация

- `docs/GUIDELINE.md` — архитектура, этапы 0–5, правила кода, тестов и логирования.
- `docs/PATCHES.md` — как писать патчи (манифест, типы, настройки, сеть, сухой прогон).
- `docs/DECISIONS.md` — журнал архитектурных решений.
- `docs/STATUS.md` — текущее состояние и неиспытанные сценарии.
- `docs/BASELINE.md` — замеры производительности этапа 0.
- `docs/PACKAGING.md` — сборка Flatpak.
- `docs/CHANGELOG.md` — история изменений.

## Безопасность

Секреты, cookie и профили браузера не коммитятся (см. `.gitignore`). Патчи считаются доверенным локальным кодом; запросы патчей наружу идут только через `LGX.net.fetch` по белому списку хостов, без cookie игры.