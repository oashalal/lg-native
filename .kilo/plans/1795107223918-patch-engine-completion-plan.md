# План завершения движка патчей

## Цель и зафиксированные решения

Завершить движок так, чтобы новый локальный патч мог:

- добавлять элементы прямо в DOM игры;
- использовать публичные `LG*`-глобалы и `LGX`;
- открывать игровую DOM-модалку с темой текущего канала, focus trap, Escape и адаптацией к узкому окну;
- получать JSON через `GET` с разрешённого серверного origin;
- показывать loading/error/stale-состояния и обновлять данные с отменой при закрытии;
- проходить единый lifecycle, отчётность, ограничения совместимости и тесты.

Патч остаётся доверенным локальным кодом. Его page-world часть отвечает за DOM и игровые API. Сетевая часть выполняется в изолированном мире или main через capability IPC и не получает игровые cookies, произвольные заголовки или доступ к Node. Серверная авторизация и хранение токенов намеренно не входят в этот план. CI, расширение мультиаккаунта и оптимизация приложения также вне scope.

`native` сохраняется в схеме, но остаётся явным `skipped/native-not-implemented`; его реализация не является критерием этого плана.

## 1. Зафиксировать контракт манифеста и загрузки

1. В `src/shared/manifest.ts` расширить проверяемую модель runtime-патча для составных патчей: локальный page script, сетевой script/worker entry и настройки обновления. Сохранить обратную совместимость с существующим `settings.script` и `index.js`.
2. Ввести единый внутренний runtime descriptor, содержащий `patchId`, манифест, page script, network capability и область исполнения. Не импортировать код патчей в `main` напрямую.
3. В загрузчике патчей найти и валидировать `index.js` из каталога патча, а TypeScript `index.ts` использовать только как исходник/типизированный шаблон после сборки. Удалить расхождение, при котором `runRuntime()` существует, но application path передаёт ему пустой список.
4. При каждом запуске строить план применения по `enabled`, `safeMode`, `scope`, `siteVersions`, compatibility matrix и `requires`. Для каждого решения писать `applied`, `skipped` или `failed`, включая сетевые и runtime-патчи.
5. Согласовать требования page-world и isolated-world: `global:*` и селекторы разрешены только page части; сетевой worker использует только объявленный capability contract. Ошибка одного патча не отключает остальные.

## 2. Довести page-world API и lifecycle

1. В `src/runtime/lgx.ts` добавить стабильный API для составного патча: получение публичной темы/skin, безопасная отправка сообщений network capability, отмена запроса, lifecycle `onCleanup`/`dispose` и создание DOM-модалки.
2. Реализовать модалку как небольшой встроенный helper, а не как отдельное Electron окно: overlay, role/dialog, aria-атрибуты, focus trap, возврат фокуса, Escape, закрытие по backdrop, scroll lock и корректная очистка всех listeners/observers/timers.
3. Тему брать из текущего игрового DOM и CSS custom properties. Использовать реальные игровые surface/button/text классы там, где они стабильны, но иметь fallback на разрешённые переменные (`--bg`, `--surface`, `--ink`, `--accent`, `--line`, игровые `--gu-*`). Не копировать тему в main/native HTML.
4. Сделать runtime-вставку идемпотентной: marker по `patchId`, повторная загрузка заменяет/очищает предыдущий экземпляр, а cleanup вызывается при teardown страницы.
5. Ошибки запуска и cleanup ловить на границе патча, отправлять в отчёт с `patchId` и не выдавать секретные данные в console/report.

## 3. Реализовать безопасный JSON network GET

1. В `src/main/net/network-policy.ts` оформить отдельный `PatchNetworkRequest/Response` контракт для составного UI-патча: только `GET` в первом варианте, HTTPS (HTTP только для localhost), allowlist origin/host из `network.hosts`, `$serverUrl` с точным origin и лимиты timeout/maxBytes/redirects. Существующую политику методов отдельных сетевых runtime-патчей сохранить и проверить на регрессии.
2. Явно запретить cookies, `Authorization`, `Origin`, `Referer`, `Set-Cookie`, credentials и произвольные request headers. Ограничивать body/response по фактическим bytes, включая пустые и chunked ответы; корректно обрабатывать timeout, abort, относительные redirects, превышение redirect limit и ошибки чтения тела.
3. Для каждой вкладки выдавать capability, привязанную к `patchId`, profile/session, frame и isolated world. Capability не передавать в page world. Поскольку код сайта и патча исполняется в одном page world, считать любые page-сообщения доступными сайту: предоставить только заранее объявленные операции GET с фиксированными endpoint и ограниченной схемой параметров, а не универсальный fetch. Не считать `patchId` или request id доказательством личности отправителя; ответы и запросы не должны содержать секретов или данных других профилей.
4. Реализовать IPC handlers в `src/main/ipc/channels.ts` и `src/preload/index.cts`: строгая валидация аргументов, проверка sender/frame/origin/world и отзыв capability при navigation, destroy или disable патча.
5. В `app.ts` запускать сетевую часть после загрузки страницы и связывать ответы с page частью по request id. Поддержать AbortController при закрытии модалки и не исполнять ответ как код; JSON parse остаётся в runtime после проверки размера/content type или возвращается как безопасный текстовый payload.
6. Не добавлять Bearer/API key и не читать секреты профиля. `serverUrl` может быть публичным endpoint без авторизации.

## 4. Синхронизировать применение всех типов

1. `css`: оставить добавление CSS, но добавить проверку target/compatibility/scope и пример стилей модалки.
2. `runtime`: применять page script через реальный loader, а network runtime запускать только через capability path; не считать сетевой патч успешным до успешной регистрации capability и запуска worker.
3. `source`: сохранить exact anchor count, JS parse и rollback; добавить тест на составной runtime bootstrap, если source-патч нужен для доступа к внутренним переменным `app.js`.
4. `ast`: сохранить замену именованной `FunctionDeclaration`, exact count, syntax validation и rollback; документировать поддерживаемые формы.
5. `native`: оставить предсказуемый skipped report и исключить его из критериев завершённого пользовательского сценария, чтобы схема не обещала несуществующий runtime.
6. Уточнить `onFail: original`: при ошибке source/AST возвращать исходный файл, а уже применённые изменения этого файла помечать rolled-back; runtime cleanup выполнять best-effort и фиксировать failure.
7. Исправить отчёты: включать skipped по несовместимости и отсутствующим requirements, runtime/network path, file version и безопасную причину; не включать cookie, URL OAuth, токены и тела запросов.

## 5. Эталонный патч и документация

1. Добавить/обновить пример в `patches/` с manifest, page runtime script, network JSON GET и README. Он создаёт кнопку в существующей панели игры, открывает themed modal, загружает данные, показывает loading/error/stale и обновляет их с интервалом.
2. Ограничить query parameters фиксированной схемой settings; не разрешать патчу принимать произвольный URL от DOM или пользователя.
3. Обновить `patches/_template`, `docs/PATCHES.md`, `docs/DECISIONS.md` и `docs/STATUS.md`: форматы составного патча, page/network границы, lifecycle, ограничения сервера без токена, DOM-модалка, native skipped.
4. Удалить из документации утверждения, что `LGX.net.fetch` всегда недоступен, если новый bridge реализован; отдельно описать, что network runtime не видит `window.LG*` напрямую.

## 6. Тесты и приёмка

1. Unit-тесты manifest/loader: валидный составной патч, отсутствующий script, disabled/safe mode, scope, compatibility, duplicate patch id и native skipped.
2. Unit-тесты engine: порядок CSS/source/AST/runtime, exact anchors, syntax failure, rollback, idempotency markers, report statuses и cleanup failure.
3. Unit-тесты network policy: origin/host allowlist, `$serverUrl`, только GET, запрещённые headers/cookies, redirect checks, timeout, abort, max bytes по chunks, content type и capability revocation.
4. E2E на Electron fixture: реальный loader читает патч из каталога, page runtime видит DOM fixture, открывает/закрывает modal, trap/focus/Escape работают, network fixture возвращает JSON и после закрытия запрос отменяется.
5. E2E isolation: renderer не получает Node/capability secret, чужой frame/origin не может вызвать IPC, network runtime не видит игровые globals, capability одного `patchId` не даёт расширенных прав другому; page world может инициировать только заранее объявленные безопасные операции.
6. На доступных снапшотах прогнать dry-run для source/AST и smoke для CSS/runtime. Для живого сайта вручную подтвердить один канал, каждую тему, узкое окно, загрузку/ошибку сервера и reload страницы; неполные снапшоты пометить как partial.
7. Перед завершением выполнить `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e` (при необходимости через `xvfb-run`) и `pnpm build`.

## Критерии готовности

- Новый патч добавляется только в `patches/<id>/` и не требует правок `main`/preload для конкретного patch id.
- Page часть добавляет игровой элемент и модалку, которая визуально использует компоненты/переменные текущего интерфейса и корректно очищается.
- JSON GET выполняется только с разрешённого origin, без cookies и токена, с рабочими timeout/abort/size/redirect ограничениями.
- Несовместимость или ошибка патча оставляет сайт доступным, отключает только этот патч и создаёт понятный отчёт.
- Все существующие CSS/source/AST/runtime тесты остаются зелёными; network и loader покрыты Electron e2e.
- Native явно отображается как отложенный тип, а документация не обещает его функциональность.

## Вне scope

- Bearer/API key, safeStorage и серверная авторизация.
- SSE/WS для пользовательского сервера; только JSON GET.
- Произвольный main JavaScript из патча и удалённая доставка/подпись патчей.
- Реализация native-патчей.
- CI, автоматическое получение снапшотов, новые функции мультиаккаунта и отдельные performance optimizations.
