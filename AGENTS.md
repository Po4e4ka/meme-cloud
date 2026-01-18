# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds Laravel application code (controllers, models, services).
- `routes/` contains route definitions (web and API).
- `resources/js/` houses the React/Inertia front-end; `resources/css/` for styles; `resources/views/` for Blade templates.
- `database/` contains migrations, factories, and seeders.
- `tests/Feature/` and `tests/Unit/` contain PHPUnit tests.
- `public/` serves static assets and build output.
- `containers/` and `docker-compose.yaml` define local containerized tooling.

## Product Summary
- Приложение — личное хранилище мемов: пользователи входят в аккаунт и сохраняют изображения или короткие видео.
- Файлы хранятся в приватных папках пользователей в бакете.
- Теги поддерживают фильтрацию и поиск по личной галерее.

## Документация
- Основной язык документации — русский.

## Build, Test, and Development Commands
- `composer dev`: run Laravel server, queue listener, log tail, and Vite in parallel.
- `composer dev:ssr`: build SSR assets and start server + SSR process.
- `composer test`: clear config cache and run Laravel tests.
- `npm run dev`: start Vite for frontend development.
- `npm run build` / `npm run build:ssr`: build frontend assets (SSR variant available).
- `npm run lint`: run ESLint with auto-fixes.
- `npm run format` / `npm run format:check`: Prettier formatting for `resources/`.
- `npm run types`: TypeScript type-check.

## Coding Style & Naming Conventions
- Indentation: 4 spaces per `.editorconfig` (YAML uses 2 spaces); LF with final newline.
- JS/TS: formatted via Prettier; linted by ESLint (`eslint.config.js`).
- PHP: follow Laravel/PSR-12 conventions; format with `./vendor/bin/pint` when needed.
- Naming: `StudlyCase` for classes, `camelCase` for methods/variables, `snake_case` for DB columns and migration files.

## Testing Guidelines
- Use PHPUnit via `php artisan test` (or `composer test`).
- Place tests in `tests/Feature/` or `tests/Unit/`; name files `*Test.php`.
- Add tests for new endpoints, UI flows, and model behavior. No strict coverage gate is enforced.

## Commit & Pull Request Guidelines
- Commit history uses short, imperative messages (often Russian), e.g. "Добавлена апишка...".
- Keep commits focused; include issue IDs if available.
- PRs should include a brief summary, test steps, and screenshots for UI changes.
- Call out config or migration changes and any required `.env` updates.

## Configuration & Security
- Copy `.env.example` to `.env` for local setup; never commit secrets.
- Runtime data lives in `storage/` and `var/`; avoid manual edits unless troubleshooting.
