## Тренажер изучения слов PlayWord
Приложение (fullstack PWA) для изучения и повторения английских слов на основе техники интервального повторения. Помогает переместить слова из кратковременной памяти в долговременную. Личный пет проект для себя и друзей.
  
![Build status](https://github.com/aleksandr-loskutov/play-word/actions/workflows/deploy.yml/badge.svg)

## Demo
MVP версия в проде доступна по адресу [`playword.ru`](https://playword.ru)

[![Demo Video](https://files.aleksandrl.ru/sites/playword/demo-video-poster.png)](https://files.aleksandrl.ru/sites/playword/demo-video.webm)

## Особенности
Платформы, такие как Duolingo, Lingualeo и Puzzle English, предлагают всестороннее обучение языку, но не дают возможности индивидуально настраивать изучение слов. В playword основное внимание уделяется изучению слов с возможностью гибкой настройки тренировок, что позволяет пользователям создавать удобный график обучения.
### Базовый функционал
- Создавайте свои или изучайте публичные коллекции слов;
- Гибкая настройка тренажера: слова, интервалы, ошибки;
- Умный быстрый ввод: не нужно переключать раскладку;
- Включение таймера для тренировки;
- Озвучивание слов и голосовой ввод;
- Возможность установить как приложение.


### ToDo
В ToDo много пунктов и скоро здесь появится список. Тем не менее фокус разработки направлен на улучшение базового функционала в первую очередь.

Есть предложения по функционалу или хотите контрибьютить? [`напишите мне`](https://t.me/lcantstop)

## Стек технологий
Этот проект организован как монорепозиторий с использованием Lerna.
### Фронтенд
- [React](https://reactjs.org/) - библиотека для создания пользовательских интерфейсов.
- [TypeScript](https://www.typescriptlang.org/) - язык программирования, добавляющий статическую типизацию к JavaScript.
- [Redux Toolkit](https://redux-toolkit.js.org/) - библиотека управления состоянием.
- [Ant Design](https://ant.design/) - компонентная библиотека для React с готовыми стилями и компонентами.
- [PostCSS](https://postcss.org/) - модульный препроцессор.
- [Vite](https://vitejs.dev/) - быстрый инструмент сборки и разработки для современных приложений JavaScript.


### Серверная часть

- [Node.js](https://nodejs.org/) - среда выполнения JavaScript на стороне сервера.
- [NestJS](https://nestjs.com/) - фреймворк для создания масштабируемых и эффективных серверных приложений на Node.js.
- [TypeScript](https://www.typescriptlang.org/) - язык программирования, добавляющий статическую типизацию к JavaScript.
- [PostgreSQL](https://www.postgresql.org/) - реляционная база данных.
- [Prisma](https://www.prisma.io/) - инструмент для работы с базами данных и ORM для Node.js и TypeScript.
- [Passport](http://www.passportjs.org/) - библиотека для аутентификации в Node.js приложениях.
- [JWT](https://jwt.io/) - стандарт JSON-токенов для безопасной передачи информации между двумя сторонами.
- [Jest](https://jestjs.io/) - фреймворк для тестирования JavaScript кода.
- [Supertest](https://github.com/visionmedia/supertest) - библиотека для тестирования HTTP запросов в Node.js приложениях.

### CI/CD
Линтинг, тестинг и деплоинг автоматизирован. Настроен github actions workflow на своем сервере с self-hosted раннером. Для контейнеризации используется docker и docker-compose.

### Линтинг
- [ESLint](https://eslint.org/) - инструмент статического анализа кода для поиска и исправления проблем в JavaScript/TypeScript коде.
- [Prettier](https://prettier.io/) - инструмент для автоматического форматирования кода.

## Установка приложения

###  Настольные ПК
1. Перейти на  [`playword.ru`](https://playword.ru)
2. В адресной строке браузера (если мы на desktop) появляется иконка установки приложения.
3. Нажимаем, ждем 3-5 секунд, иконка с приложением появится на рабочем столе.

### Смартфоны
1. Перейти на  [`playword.ru`](https://playword.ru) в любом современном браузере (список ниже).
2. Зайти в настройки/опции текущей страницы (у apple это иконка поделиться) и найти пункт "установить приложение" или "добавить на рабочий стол".
3. Нажимаем, ждем 3-5 секунд, иконка с приложением появится на рабочем столе смартфона.

Поддерживаемые браузеры:
Google Chrome (с версии 45 и выше)
Mozilla Firefox (с версии 58 и выше)
Microsoft Edge (с версии 17 и выше)
Apple Safari (с версии 11.3 и выше)
Opera (с версии 42 и выше)


## Запуск локально
Для запуска своей версии приложения у себя на ПК:

1. Убедитесь что у вас установлен `node` и `docker`
2. Выполните команду `yarn bootstrap` - это обязательный шаг.
3. Выполните команду `yarn dev`
3. Выполните команду `yarn dev --scope=client` чтобы запустить только клиент
4. Выполните команду `yarn dev --scope=server` чтобы запустить только server

### Как добавить зависимости?
В этом проекте используется `monorepo` на основе [`lerna`](https://github.com/lerna/lerna)

Чтобы добавить зависимость для клиента
```yarn lerna add {your_dep} --scope client```

Для сервера
```yarn lerna add {your_dep} --scope server```

И для клиента и для сервера
```yarn lerna add {your_dep}```


Если вы хотите добавить dev зависимость, проделайте то же самое, но с флагом `dev`
```yarn lerna add {your_dep} --dev --scope server```

### Тесты
Backend покрыт (core API) e2e тестами (supertest). 

(TODO) Для клиента используется  [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro/)

```yarn test```

### Линтинг

```yarn lint```

### Форматирование prettier

```yarn format```

### Production build

```yarn build```
