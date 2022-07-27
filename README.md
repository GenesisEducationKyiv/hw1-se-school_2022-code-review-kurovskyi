# Bitcoin API

- 📱 **NestJS** – NodeJS фреймворк
- 📜 **TypeScript** – JS на максималках
- ⚙️ **.env Configuration** – Доступна гнучка конфігурація проєкту
- 📊 **Swagger** – Доступна документація API
- 🔐 **Helmet Security** – Додаткові безпекові заголовки
- 🐢 **Throttler** – Захист від потоку запитів
- ✨ **Class Validation** – Валідація вхідних даних
- 🐳 **Docker Compose** – Проєкт може крутитися в контейнеру

## Встановлення

```bash
# 1. Склонуйте проєкт
https://github.com/kurovskyi/bitcoin-api.git

# 2. Увійдіть до проєкту
cd bitcoin-api

# 3. Вкажіть ваші змінні середовища за шаблоном
cp example.env .env
cp example.env development.env

# 4. Встановіть залежності
yarn
```

## Запуск

### Для локального запуску:

❗️ Будуть використовуватися змінні з файлу `development.env`

```bash
yarn start:dev
```

### Docker Compose:

❗️ Будуть використовуватися змінні з файлу `.env`

```bash
docker-compose up -d
```

## Використання

В конфігурації `*.env` вказується порт, за яким буде доступний ресурс. Адреса за замовчуванням: `http://localhost:3000`.

Для перегляду Swagger: `http://localhost:3000/docs`.

## Налаштування

❗️ Для правильної роботи програми треба власноруч налаштувати [third-party API CoinMarketCap](https://coinmarketcap.com/api/) для роботи з курсом BTC та поштовий сервер SMTP.

Усі ці параметри задаються в `.env` файлі.

```bash
# Сюди ключ від сервісу CoinMarketCap
RATE_API_KEY=your-key

Можна взяти мій – bb1f1a5e-7f4b-40d7-8903-fa8a6a1a5e1b
```

Поштові параметри задаються тут:

```bash
MAIL_HOST=mail.host.com
MAIL_PORT=587
MAIL_USER=mail@gmail.com
MAIL_PASSWORD=pass
MAIL_FROM=mail@gmail.com
MAIL_FROM_NAME=${NAME}

MAIL_TRANSPORT=
```

❗️ Якщо MAIL_TRANSPORT буде вказаний, то усі інші параметри будуть ігноруватися. Цей параметр являє собою спеціальну строку підключення.

Приклад: `MAIL_TRANSPORT=smtps://mail@gmail.com:PASSWORD@mail.host.com`
