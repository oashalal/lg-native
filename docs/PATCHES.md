# Движок патчей

Этот документ описывает **текущую реализацию** patch engine в `lg-native`, а не будущие возможности из планов. Патчи являются доверенным локальным кодом: приложение проверяет их манифест и ограничивает IPC, но не может сделать вредоносный JavaScript безопасным внутри страницы.

## 1. Что можно сделать сейчас

Поддерживаются следующие сценарии:

- добавлять CSS к загружаемому стилевому файлу;
- заменять точный текстовый фрагмент в JavaScript-файле сайта;
- заменять тело именованной `function` через ограниченный AST-режим;
- запускать JavaScript в page world после загрузки `/site/app.js`;
- запускать сетевой runtime в отдельном isolated world Chromium;
- добавлять элементы в DOM и реагировать на динамически появляющиеся элементы через `MutationObserver`;
- использовать публичные глобалы сайта и браузерные API в page world;
- использовать `LGX` для ожидания элементов, хуков, событий, настроек, темы, cleanup и modal helper;
- выполнять разрешённые JSON GET-запросы через main без игровых cookies и авторизационных заголовков;
- ограничивать патч версиями сайта, каналами, страницами, requirements и compatibility matrix;
- отключать все патчи через `--safe-mode`;
- получать отчёты `applied`, `skipped`, `failed` и причины отказа;
- объявлять пользовательские настройки типов `boolean`, `string`, `number`.

## 2. Что сейчас нельзя

Не поддерживаются или намеренно запрещены:

- `native` runtime: тип распознаётся, но получает `skipped/native-not-implemented`;
- произвольный JavaScript в main-процессе из каталога патча;
- удалённая доставка, подпись или автоматическое обновление патчей;
- POST, PUT, PATCH, DELETE, HEAD и body в сетевом API;
- cookies, `Authorization`, `Origin`, `Referer`, `User-Agent`, `Set-Cookie` и игровые credentials в сетевых запросах;
- Bearer/API key, safeStorage и серверная авторизация;
- WebSocket, SSE и streaming API для внешнего сервера;
- изменение ответов `/api/*`, `/auth/*`, WebSocket или SSE игры через patch engine;
- выполнение ответа внешнего сервера как JavaScript или как файл сайта;
- произвольные URL, переданные из DOM или пользовательского ввода: endpoint должен быть объявлен в manifest;
- автоматизация игровых действий, боты, автокликеры и обход защиты игры;
- общий доступ между page world и network isolated world к JS-глобалам;
- `global:*` requirements в network isolated world;
- автоматическая отмена всех DOM-эффектов старых патчей при навигации уже загруженной страницы: для этого патч должен зарегистрировать cleanup;
- автоматическое визуальное подтверждение всех skin, узкого окна, OAuth, реального аккаунта и доступности.

## 3. Каталог патча

Новый патч живёт в отдельной папке:

```text
patches/<id>/
├── patch.json       обязательный манифест
├── index.js         runtime-код после сборки
├── index.ts         необязательный исходник/шаблон TypeScript
├── README.md        описание и ручная проверка
└── test.mjs         необязательно, но нужно для dry-run source/ast
```

Для runtime loader читает именно `index.js`. `index.ts` сам по себе Electron не исполняет. Кода патча не нужно импортировать в `src/main` или `src/preload`.

Быстрый старт:

```bash
cp -R patches/_template patches/my-patch
# изменить patches/my-patch/patch.json
# создать patches/my-patch/index.js
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

После изменения локального патча перезапустите приложение или перезагрузите вкладку. Настройки из окна настроек приводят к перечитыванию манифестов и перезагрузке игровых вкладок.

## 4. Манифест

Минимальный runtime-манифест:

```json
{
  "id": "my-patch",
  "name": "Мой патч",
  "version": "0.1.0",
  "type": "runtime",
  "enabled": true,
  "siteVersions": [],
  "strict": false,
  "scope": { "channels": ["*"], "pages": ["/c/*"] },
  "requires": [],
  "onFail": "disable",
  "settings": {}
}
```

### Поля

| Поле | Значение |
| --- | --- |
| `id` | Уникальный идентификатор: lowercase, цифры и `-`, начинается с буквы/цифры. |
| `name` | Отображаемое имя. |
| `version` | Версия самого патча. |
| `type` | `css`, `runtime`, `source`, `ast` или `native`. |
| `enabled` | Включён ли патч. По умолчанию `true`. |
| `siteVersions` | Явный список версий сайта. Пустой список не ограничивает версию сам по себе. |
| `strict` | Для `source` и `ast` по умолчанию `true`; неизвестная версия не применяется. Для остальных типов по умолчанию `false`. |
| `scope.channels` | Каналы, например `['5opka', '*']`. |
| `scope.pages` | Пути страниц, например `['/c/*']`. Поддерживается только простой суффикс `*`. |
| `requires` | Requirements `global:Name`, `selector:CSS`, обычный CSS-селектор или `file:/site/x.js`. Ожидание максимум 10 секунд. |
| `onFail` | `disable` сохраняет предыдущие успешные изменения; `original` возвращает исходный файл при ошибке source/ast. |
| `settings` | Значения по умолчанию и внутренние настройки. |
| `settingsSchema` | UI-схема пользовательских настроек. |
| `runtime` | Составной runtime-контракт: `pageScript`, `networkScript`, `updateMs`. |
| `network` | Capability для сетевого runtime. |

Один и тот же `id` дважды загружать нельзя. Duplicate id отклоняется как ошибка загрузки.

### Target

`targets` используется для `css`, `source` и `ast`:

```json
"targets": [{
  "file": "/site/app.js",
  "anchor": "window.LGLive = () => true;",
  "expect": 1,
  "replacement": "window.LGX = true;"
}]
```

Для `ast`:

```json
"targets": [{
  "file": "/site/app.js",
  "functionName": "render",
  "expect": 1,
  "replacement": "return 42;"
}]
```

`file` должен начинаться с `/`. `expect` означает точное количество совпадений. Неверное количество совпадений приводит к `failed`, а изменённый файл откатывается.

## 5. Типы патчей

### CSS

CSS-патч добавляет текст из `target.replacement` или `settings.css` в соответствующий файл:

```json
{
  "id": "wide-panel",
  "name": "Широкая панель",
  "version": "0.1.0",
  "type": "css",
  "enabled": true,
  "targets": [{ "file": "/site/style.css" }],
  "settings": { "css": ".my-panel { min-width: 320px; }" }
}
```

CSS не проходит полноценный CSS parser в engine. Ошибки проявятся в браузере, поэтому стили нужно проверять вручную и в e2e.

### Runtime в page world

Обычный runtime исполняется в том же page world, что и сайт. Поэтому он может использовать DOM, `window.LG*`, `fetch` браузера и публичные игровые объекты. Node.js и Electron API ему недоступны.

Loader ищет код в следующем порядке:

1. `runtime.pageScript`;
2. `settings.script` для обратной совместимости;
3. `index.js` в папке патча.

Пример:

```json
{
  "id": "city-button",
  "name": "Кнопка города",
  "version": "1.0.0",
  "type": "runtime",
  "enabled": true,
  "scope": { "channels": ["*"], "pages": ["/c/*"] },
  "requires": [],
  "onFail": "disable",
  "settings": {}
}
```

`index.js`:

```js
const install = () => {
  const panel = document.querySelector('#gu-hud .gu-main');
  if (!panel || panel.querySelector('[data-my-patch]')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.myPatch = '';
  button.className = 'gu-b';
  button.textContent = 'Мой патч';
  button.addEventListener('click', () => LGX.log('my-patch', 'clicked'));
  panel.append(button);
};

const observer = new MutationObserver(install);
observer.observe(document.documentElement, { childList: true, subtree: true });
install();
LGX.onCleanup(() => observer.disconnect());
```

Runtime-код оборачивается загрузчиком в `try/catch`. Если runtime-файл отсутствует или не разбирается как JavaScript, патч не применяется. Runtime-ошибка не должна ломать остальные патчи.

### Source

Source заменяет точный текстовый anchor в файле. После замены JavaScript разбирается Acorn. При ошибке содержимое возвращается к состоянию до конкретного патча.

Используйте короткие стабильные якоря, не завязывайтесь на случайное форматирование и обязательно задавайте `expect`.

### AST

AST-патч поддерживает только именованные `FunctionDeclaration`. Он заменяет тело функции, сохраняя остальной исходный файл:

```json
"type": "ast",
"targets": [{
  "file": "/site/app.js",
  "functionName": "render",
  "expect": 1,
  "replacement": "return 42;"
}]
```

Не поддерживаются arrow functions, методы объектов, анонимные функции, произвольные AST-трансформации и переименование символов.

### Native

`native` присутствует в схеме для совместимости, но сейчас не реализован. Такой патч получает `skipped` с причиной `native-not-implemented` и не должен использоваться для пользовательского сценария.

## 6. LGX page API

`LGX` создаётся в начале обработанного `/site/app.js`, если хотя бы один патч внедрён в этот файл. В safe mode или при отсутствии внедрения `LGX` может отсутствовать.

Основные методы:

```js
LGX.version();                    // { siteVer }
LGX.settings('patch-id');         // публичные настройки патча
LGX.ready('global:LGLive', 5000); // ожидание глобала или selector
LGX.expose('name', value);        // сохранить живую ссылку
LGX.get('name');
LGX.hook(object, 'method', wrapper); // возвращает undo-функцию
LGX.on('event', handler);         // возвращает unsubscribe
LGX.emit('event', data);
LGX.log('patch-id', ...values);
LGX.patchReport();
LGX.native.notify(title, body);
LGX.native.openWindow(url);
LGX.theme();
LGX.onCleanup(cleanup);
LGX.dispose();
```

`LGX.settings(id)` возвращает только публичные поля. Поля с `secret: true` или `visibility: 'secret'` не сериализуются в page world.

`LGX.hook` заменяет метод и возвращает функцию восстановления. Он не откатывается автоматически при навигации, если патч сам не зарегистрировал эту функцию через `LGX.onCleanup`.

### DOM mount и modal

`LGX.mount(id, nodeOrHtml)` создаёт или переиспользует корень с `data-lg-native-patch`. Повторная установка заменяет содержимое.

`LGX.modal(id, nodeOrHtml)` создаёт overlay с `role="dialog"`, `aria-modal`, focus trap, Escape, закрытием по backdrop, scroll lock и возвратом фокуса. Возвращается объект `{ element, close }`.

Текущая сигнатура сетевого метода:

```js
const response = await LGX.net.fetch(
  'my-patch',
  'https://api.example.com/data',
  { signal: abortController.signal }
);
const data = JSON.parse(response.body);
```

`LGX.net.fetch` является capability API. Не принимайте URL от пользователя или DOM; используйте заранее известные endpoint.

## 7. Network runtime

Network runtime запускается в isolated world. Он получает общий DOM, но не получает JS-объекты, функции и глобалы page world. Node.js и capability token в код патча не передаются.

Манифест:

```json
{
  "id": "public-status",
  "name": "Статус сервера",
  "version": "1.0.0",
  "type": "runtime",
  "enabled": true,
  "runtime": {
    "networkScript": "network.js",
    "pageScript": "index.js",
    "updateMs": 60000
  },
  "network": {
    "hosts": ["api.example.com"],
    "endpoints": ["/status"],
    "timeoutMs": 10000,
    "maxBytes": 2097152,
    "maxRedirects": 5
  }
}
```

В текущем loader `runtime.networkScript` должен быть передан как содержимое скрипта; если используется файловая структура, итоговый `index.js`/сборщик должен обеспечить чтение и регистрацию этого содержимого. Network IPC проверяет sender, игровой origin, main frame, scope, enabled и allowlist.

Ограничения запроса:

- только `GET`;
- HTTPS обязателен, HTTP разрешён только для `localhost`, `127.0.0.1`, `[::1]`;
- host должен быть в `network.hosts`;
- при наличии `network.endpoints` path должен быть в этом списке;
- `$serverUrl` разрешает только точный origin значения `serverUrl` профиля;
- credentials не используются;
- redirect проверяется повторно и ограничен `maxRedirects`;
- response ограничен `maxBytes`, включая chunked body;
- допустим JSON content type; тело возвращается как безопасная строка.

Сеть патча не получает cookies текущей игры и не должна использоваться для авторизации на внешнем сервере.

## 8. Настройки

Пример:

```json
"settings": { "label": "Тест", "showMessage": true },
"settingsSchema": {
  "label": {
    "type": "string",
    "label": "Подпись кнопки",
    "default": "Тест",
    "maxLength": 24,
    "public": true
  },
  "showMessage": {
    "type": "boolean",
    "label": "Показывать текст",
    "default": true,
    "public": true
  }
}
```

Поддерживаются:

- `boolean`;
- `string` с `maxLength` до 4096;
- `number` с `min` и `max`.

Пользовательские override проходят валидацию в main. Ключ `script` зарезервирован. Настройки общие на уровне приложения, а сетевой `serverUrl` читается из конфигурации профиля.

## 9. Совместимость и отчёты

Порядок решения о применении:

1. `safeMode`;
2. `enabled`;
3. ранее отключён ли патч из-за ошибки;
4. тип и target-файл;
5. compatibility matrix и `siteVersions`;
6. `scope`;
7. `requires`;
8. применение и синтаксическая проверка.

Статусы:

- `applied` — код внедрён или runtime запущен;
- `skipped` — патч намеренно пропущен: safe mode, disabled, scope, incompatibility, missing host или native;
- `failed` — попытка применения/запуска завершилась ошибкой.

Отчёт содержит `patchId`, `status`, безопасную `reason`, `siteVer`, `path` и `fileVer`. Через публичный IPC внутренний `path` удаляется. Cookies, OAuth URL, токены и тела запросов в отчёты не включаются.

Журнал: `profiles/<profile>/reports/patches.jsonl`. В safe mode все патчи пропускаются.

## 10. Проверка патча

Минимальная локальная проверка:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Для source/AST используйте снапшоты:

```bash
node tools/dryrun/index.mjs
node tools/dryrun/index.mjs --approve <site-version>
```

`test.mjs` source/AST-патча может экспортировать `test({ version, outputs })`. Runtime и CSS dry-run автоматически не проверяет как поведение браузера; для них нужны unit/e2e или ручная проверка.

Перед включением на живом сайте проверьте:

- повторную загрузку страницы;
- смену канала и skin;
- узкое окно;
- отсутствие дублирования кнопок/observer;
- закрытие modal через кнопку, Escape и backdrop;
- сетевой timeout, большой ответ, redirect и abort;
- поведение при отключённом/несовместимом патче;
- журнал отчётов.

## 11. Архитектурная граница

`main` загружает и проверяет manifest, перехватывает JS/CSS и владеет network IPC. `preload` предоставляет узкий contextBridge. `runtime/lgx.ts` сериализуется в page world. Патч не импортирует main/preload и взаимодействует с приложением только через manifest и LGX.

Page runtime и network runtime намеренно разделены:

- page runtime имеет доступ к DOM и публичным игровым объектам, но не к Node;
- network runtime имеет ограниченный GET capability, но не видит page-world globals;
- оба мира могут видеть DOM, поэтому сетевой патч должен считаться доверенным локальным кодом;
- ответы сети являются данными и не исполняются как код.

## 12. Известные технические ограничения текущей версии

- `runtime.updateMs` описывает контракт манифеста, но автоматический scheduler обновления данных в engine ещё не реализован; интервал нужно реализовать в самом runtime через `setInterval` и cleanup.
- Capability revocation при navigation/destroy/disable требует дополнительного hardening; текущие проверки выполняются на каждом IPC-вызове.
- Полный lifecycle-отчёт асинхронного network worker не объединён с page runtime bootstrap во всех сценариях.
- `LGX.modal` и `LGX.mount` являются небольшим helper API, а не полноценной дизайн-системой игры.
- Визуальная доступность и каждый игровой skin не покрыты автоматическими тестами.
- Доставка TypeScript-патча не является частью runtime loader: в production нужен собранный `index.js`.
