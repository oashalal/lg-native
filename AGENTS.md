# AGENTS.md — инструкция для агентов (Kilo/Claude и др.)

Репозиторий `lg-native` — Electron-клиент под Linux для `legiongame.gg` с локальным движком патчей интерфейса.

## Стек и команды

- TypeScript strict, ESM (`"type": "module"`, NodeNext), Electron ^45, pnpm 12.21.
- Тесты: vitest (`pnpm test` = `typecheck` + `vitest run`), e2e: Playwright/Electron (`pnpm test:e2e`).
- Линт: `pnpm lint` (`eslint src tests tools patches`).
- Сборка: `pnpm build` (`tsc` в `dist/`); запуск: `pnpm start -- --channel=5opka`.
- Flatpak: `pnpm package:flatpak`.

Ключевые скрипты в `package.json`:
- `typecheck` — `tsc -p tsconfig.json --noEmit`
- `test` — `pnpm typecheck && vitest run`
- `lint` — `eslint src tests tools patches --ext .ts,.js,.cts,.mjs`

## Важные файлы и директории

| Путь | Назначение |
|------|------------|
| `src/main/` | процесс main: запуск, аккаунты/сессии, перехват сети, движок патчей, нативное (трей/уведомления/хоткеи), IPC |
| `src/preload/` | узкий мост contextBridge (`index.cts`, `settings.cts`, `toolbar.cts`) |
| `src/runtime/lgx.ts` | код в мире страницы — API `window.LGX` |
| `src/shared/manifest.ts` | типы манифеста патча |
| `patches/<id>/` | локальный патч: `patch.json`, `index.ts`, `README.md`, опционально `test.ts` |
| `patches/_template/` | шаблон для нового патча |
| `tools/snapshot`, `tools/dryrun` | сборка снапшотов и проверка совместимости патчей |
| `fixtures/snapshots/<siteVer>/` | эталонные файлы сайта по версиям |
| `tests/` | юнит-тесты и `tests/e2e/lgx.mjs` |
| `compat/matrix.json` | реестр совместимости патч × версия (`ok`/`failed`/`skipped`) |
| `docs/GUIDELINE.md` | архитектура, этапы 0–5, правила кода, тестов и логирования |
| `docs/PATCHES.md` | как писать патчи (манифест, типы, сеть, сухой прогон) |
| `docs/DECISIONS.md` | архитектурные решения |
| `docs/STATUS.md` | текущее состояние, неиспытанное |
| `docs/BASELINE.md` | замеры производительности этапа 0 |
| `docs/PACKAGING.md` | сборка Flatpak |

## Система патчей (ключевое)

Новый патч = копия `patches/_template` в `patches/<id>/`:

- `patch.json` — манифест: `id`, `name`, `version`, `type` (`css\|runtime\|source\|ast\|native`), `enabled`, `siteVersions`, `strict`, `scope`, `requires`, `targets`, `onFail`, `settings`, опционально `settingsSchema`/`network`.
- `index.ts` — реализация (экспортирует `run()` или `description`).
- `README.md` — что делает, на что опирается, как проверить, как выключить.
- Тест на фикстуре для `source`/`ast` (`test.mjs` экспортирует `test({ version, outputs })`).

Правила:
- `main` и `preload` не знают о конкретных патчах; связь только через манифест и LGX API.
- Каждый патч в `try/catch`; сбой отключает только этот патч.
- `source`/`ast` требуют точного числа совпадений якоря (`expect`) и валидного JS результата.
- `settingsSchema`: типы `boolean\|string\|number`; в page world передаются только публичные поля.
- `--safe-mode` отключает все патчи.

## Тестирование

- Юнит-тесты в `tests/` под vitest; фикстуры из `fixtures/snapshots/`.
- e2e (`tests/e2e/lgx.mjs`) проверяет LGX/изоляцию и локальный `AccountHub` lifecycle; OAuth, реальные cookies, WS/SSE не покрываются автоматически.
- Перед любой правкой: `pnpm typecheck && pnpm lint && pnpm test`.

## Соглашения кода

- TypeScript `strict`, без `any` в `main`/`shared`, NodeNext модули.
- Логи JSON-строки с полями `patchId`, `siteVer`, `account`; в логи не попадут cookie, токены, тела `/auth/*`.
- Безопасность Electron: `contextIsolation`, `nodeIntegration: false`, `sandbox`, навигация ограничена origin игры + Twitch.
- Маленькие коммиты, один патч — один коммит; архитектурные решения в `docs/DECISIONS.md`.
- Секреты, cookie, профили в `.gitignore` (не коммитить).

## Документация

После изменений'architecture актуализируйте `docs/DECISIONS.md` (контекст, решение, последствия) и `docs/STATUS.md` при изменении этапов.