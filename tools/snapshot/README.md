# Snapshot tool

Запуск: `node tools/snapshot/index.mjs`. Cookie `lsid` читается из `LG_LSID` или `~/.config/lg-native/lsid`; файл должен иметь права `600`. Значение cookie не выводится и не записывается в снапшот. При истёкшей сессии инструмент останавливается с сообщением `обновите lsid`.

Скрипт получает версию из `/site/ver`, скачивает все найденные версионированные JS/CSS/HTML-файлы в `fixtures/snapshots/<version>`, пишет `snapshot_manifest.json` и выводит число скачанных и отсутствующих файлов. Полный снапшот имеет `versioned_missing: 0`.
