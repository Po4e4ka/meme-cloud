# Контекст проекта

## Описание продукта
- Приложение — личное хранилище мемов: пользователи входят в аккаунт и сохраняют изображения или короткие видео.
- Файлы хранятся в приватных папках пользователей в бакете.
- Теги поддерживают фильтрацию и поиск по личной галерее.

## Технологии
- Backend: PHP Laravel.
- Frontend: Inertia + React (Vite).

## PWA (добавлено)
- Используется `vite-plugin-pwa` в режиме `injectManifest`.
- Service Worker: `resources/js/sw.ts` (NetworkFirst для навигаций, CacheFirst для изображений/видео, StaleWhileRevalidate для статических ассетов, NetworkFirst для `/api/*`).
- Оффлайн-страница: `public/offline.html`.
- PWA-иконки: `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/pwa-512x512-maskable.png`.
- Манифест и тема: настраиваются в `vite.config.ts`.
- Регистрация SW в клиенте: `resources/js/app.tsx`.
- Добавлен индикатор оффлайна на дашборде: `resources/js/pages/dashboard.tsx`.

## Важно по серверу (Unit)
- Для корректного scope SW используется заголовок `Service-Worker-Allowed: /`.
- Маршрут отдачи SW в Laravel: `routes/web.php` (`/build/sw.js`).
- Unit проксирует `/build/sw.js` в PHP: `containers/configs/unit/unit.json`.

## Проверка
- После изменений PWA: `npm run build`, перезапуск `meme-php`, затем Unregister SW + Clear site data.

## Инструменты в окружении Codex
- Доступна CLI-среда с базовыми утилитами (git, curl, jq, ripgrep, fd, tree и т.д.).
- Доступен Python 3 + pip (в образе Codex), с пакетами: pillow, requests, numpy, pandas, pydantic, beautifulsoup4, lxml, imageio.
- Доступны ImageMagick (`convert`) и ffmpeg для работы с изображениями и видео.
