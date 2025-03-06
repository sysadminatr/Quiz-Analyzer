# Quiz Analyzer

**Quiz Analyzer** — это браузерное расширение, предназначенное для автоматического анализа тестов на веб-страницах, извлечения вопросов и правильных ответов, а также их сохранения в базе данных MySQL через сервер на Node.js.

## Основные функции

Расширение добавляет две основные кнопки:

- **"Анализ теста"** (красная кнопка) — извлекает вопросы и правильные ответы со страницы теста и отправляет их на сервер.
- **"Показать ответы"** (зеленая кнопка) — отображает правильные ответы под соответствующими вопросами на странице.

## Компоненты проекта

### 1. Браузерное расширение

Состоит из следующих файлов:

- **manifest.json** — конфигурация расширения для браузера.
- **content.js** — основной скрипт, который выполняется на страницах с тестами, извлекает вопросы и ответы.
- **popup.html** — всплывающее окно расширения с кнопкой "Анализировать тест".
- **popup.js** — логика работы всплывающего окна.
- **styles.css** — стили для всплывающего окна.

### Как работает расширение?

1. При загрузке тестовой страницы скрипт `content.js` добавляет кнопки "Анализ теста" и "Показать ответы".
2. По нажатию **"Анализ теста"**:
   - Извлекаются все вопросы и правильные ответы.
   - Проверяется, отмечен ли ответ как "Верно".
   - Если вопроса еще нет в базе данных, он отправляется на сервер.
3. По нажатию **"Показать ответы"**:
   - Под каждым вопросом добавляется текст "Правильный ответ: ..." с найденным верным ответом.

## Как установить и запустить?

### 1. Установка браузерного расширения

1. Откройте Chrome, перейдите по адресу `chrome://extensions/`.
2. Включите "Режим разработчика".
3. Нажмите "Загрузить распакованное расширение" и выберите папку с файлами (manifest.json, content.js и т.д.).

Проект Quiz Analyzer — это удобный инструмент для анализа тестов, автоматического сохранения вопросов в базу данных и быстрого отображения правильных ответов на странице. 🚀
