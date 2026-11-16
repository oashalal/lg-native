# Патчи

Скопируйте `patches/_template` в новую папку, измените `patch.json`, добавьте `index.ts`, README и тест на фикстуре. Для `source`/`ast` укажите полный путь файла, точный `anchor`, `expect` и безопасную замену. Сначала найдите стабильный фрагмент в `fixtures/snapshots/<siteVer>/site`, затем проверьте число совпадений.

Тесты и dry-run:

```bash
pnpm test
pnpm build
node tools/dryrun/index.mjs
```

Поле `enabled` перечитывается при следующем запуске. `--safe-mode` отключает все патчи и доступен в пункте трея как индикатор. Патч не должен автоматизировать игровые действия, менять `/api/*` или обходить защиту.

После загрузки JS/CSS отчёт сохраняется в `profiles/default/reports/patches.jsonl`. Его можно открыть из меню трея «Открыть журнал патчей». В Chromium DevTools сводка выводится как `[lg-native] patch reports`; тот же массив доступен через `window.LGX.patchReport()`.

Текущие ограничения и план завершения runtime/AST/native-поддержки описаны в [STATUS.md](STATUS.md).
