# Сборка Flatpak

Для сборки Linux-бинарника установите `electron-builder` и `flatpak-builder`, затем выполните:

```sh
pnpm package:flatpak
```

Конфигурация находится в `electron-builder.yml`, результат появляется в `release/`.
