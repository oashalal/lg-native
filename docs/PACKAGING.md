# Сборка Flatpak

Для сборки Linux-бинарника установите `flatpak-builder` и необходимые Flatpak runtime/SDK, затем выполните:

```sh
pnpm package:flatpak
```

Конфигурация находится в `electron-builder.yml`, результат появляется в `release/`.
