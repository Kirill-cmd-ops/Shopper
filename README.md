# L910-Framework

Минималистичный веб-фреймворк для Node.js, разработанный с нуля без использования готовых решений (Express, Koa, Nest и т.д.).

## Описание проекта

Данный проект представляет собой полнофункциональный веб-фреймворк, аналогичный Express, который позволяет создавать серверные приложения с поддержкой:
- Маршрутизации HTTP запросов
- Middleware и цепочек middleware
- Обработки запросов и ответов
- Парсинга тела запроса (body-parser)
- Обработки ошибок

## Тема проекта: Магазин электроники

Проект реализует REST API для управления товарами и заказами в интернет-магазине электроники.

### Сущности данных

#### 1. Товары (Products)

Файл: `data/products.json`

Структура товара:
- **id** (string) - уникальный идентификатор товара
- **name** (string) - название товара
- **category** (string) - категория товара
- **price** (number) - цена товара в рублях
- **inStock** (boolean) - наличие товара на складе
- **releaseDate** (Date string) - дата выпуска товара в формате ISO
- **specifications** (Array) - массив характеристик товара
- **description** (string) - описание товара

Пример товара:
```json
{
  "id": "1",
  "name": "iPhone 15 Pro",
  "category": "Смартфоны",
  "price": 99999,
  "inStock": true,
  "releaseDate": "2023-09-22T00:00:00.000Z",
  "specifications": ["6.1 дюйм", "A17 Pro", "256GB", "Титановый корпус"],
  "description": "Флагманский смартфон от Apple"
}
```

#### 2. Заказы (Orders)

Файл: `data/orders.json`

Структура заказа:
- **id** (string) - уникальный идентификатор заказа
- **customerName** (string) - имя клиента
- **customerEmail** (string) - email клиента
- **totalAmount** (number) - общая сумма заказа в рублях
- **isPaid** (boolean) - статус оплаты заказа
- **orderDate** (Date string) - дата заказа в формате ISO
- **items** (Array) - массив товаров в заказе
  - **productId** (string) - ID товара
  - **quantity** (number) - количество
  - **price** (number) - цена за единицу
- **status** (string) - статус заказа

Пример заказа:
```json
{
  "id": "1",
  "customerName": "Иван Петров",
  "customerEmail": "ivan.petrov@example.com",
  "totalAmount": 129998,
  "isPaid": true,
  "orderDate": "2024-01-15T10:30:00.000Z",
  "items": [
    {
      "productId": "1",
      "quantity": 1,
      "price": 99999
    }
  ],
  "status": "Доставлен"
}
```

## Установка и запуск

```bash
npm i
npm start
```

Сервер запустится на порту 3000 (или на порту, указанном в переменной окружения PORT).

## Роутинг приложения

### Маршруты для товаров (Products)

#### GET /products
Возвращает список всех товаров.

**Пример запроса:**
```bash
curl http://localhost:3000/products
```

**Ответ:**
```json
[
  {
    "id": "1",
    "name": "iPhone 15 Pro",
    "category": "Смартфоны",
    "price": 99999,
    ...
  }
]
```

#### GET /products/:id
Возвращает конкретный товар по его ID.

**Пример запроса:**
```bash
curl http://localhost:3000/products/1
```

**Ответ:**
```json
{
  "id": "1",
  "name": "iPhone 15 Pro",
  ...
}
```

#### POST /products
Создает новый товар. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса с данными:**
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новый товар",
    "category": "Смартфоны",
    "price": 50000,
    "inStock": true,
    "releaseDate": "2024-01-01T00:00:00.000Z",
    "specifications": ["Характеристика 1", "Характеристика 2"],
    "description": "Описание товара"
  }'
```

**Пример запроса без данных (случайная генерация):**
```bash
curl -X POST http://localhost:3000/products
```

#### PUT /products/:id
Полностью обновляет товар. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса:**
```bash
curl -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Обновленное название",
    "category": "Ноутбуки",
    "price": 150000,
    ...
  }'
```

#### PATCH /products/:id
Частично обновляет товар (только указанные поля). Реализация не идемпотентна - при каждом запросе могут обновляться разные поля.

**Пример запроса:**
```bash
curl -X PATCH http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 89999,
    "inStock": false
  }'
```

#### DELETE /products/:id
Удаляет товар по ID.

**Пример запроса:**
```bash
curl -X DELETE http://localhost:3000/products/1
```

### Маршруты для заказов (Orders)

#### GET /orders
Возвращает список всех заказов.

**Пример запроса:**
```bash
curl http://localhost:3000/orders
```

#### GET /orders/:id
Возвращает конкретный заказ по его ID.

**Пример запроса:**
```bash
curl http://localhost:3000/orders/1
```

#### POST /orders
Создает новый заказ. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса с данными:**
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Иван Иванов",
    "customerEmail": "ivan@example.com",
    "isPaid": true,
    "items": [
      {
        "productId": "1",
        "quantity": 2,
        "price": 99999
      }
    ],
    "status": "В обработке"
  }'
```

**Примечание:** Если `totalAmount` не указан, он вычисляется автоматически на основе `items`.

#### PUT /orders/:id
Полностью обновляет заказ. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса:**
```bash
curl -X PUT http://localhost:3000/orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Новое имя",
    ...
  }'
```

#### PATCH /orders/:id
Частично обновляет заказ (только указанные поля). Реализация не идемпотентна.

**Пример запроса:**
```bash
curl -X PATCH http://localhost:3000/orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Доставлен",
    "isPaid": true
  }'
```

#### DELETE /orders/:id
Удаляет заказ по ID.

**Пример запроса:**
```bash
curl -X DELETE http://localhost:3000/orders/1
```

## Обработка ошибок

Сервер обрабатывает следующие типы ошибок:

- **400 Bad Request** - неверный формат данных в теле запроса
- **404 Not Found** - ресурс не найден (товар/заказ с указанным ID не существует)
- **500 Internal Server Error** - внутренняя ошибка сервера

При возникновении ошибки сервер возвращает JSON с описанием ошибки:
```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

Сервер не падает при возникновении ошибок и продолжает обрабатывать последующие запросы.

## Архитектура фреймворка

### Основные компоненты

1. **framework.js** - основной файл фреймворка
   - Класс `App` - главный класс приложения
   - Класс `Router` - маршрутизатор
   - Класс `Request` - объект запроса (req)
   - Класс `Response` - объект ответа (res)

2. **utils/dataManager.js** - менеджер для работы с JSON файлами
   - Чтение и запись данных
   - CRUD операции

3. **utils/randomGenerator.js** - генератор случайных данных
   - Генерация случайных товаров
   - Генерация случайных заказов

4. **index.js** - основное приложение с маршрутами

### Особенности реализации

- Использование встроенного модуля `http` Node.js
- Реализация EventEmitter для обработки событий
- Поддержка асинхронных обработчиков маршрутов
- Middleware цепочка с поддержкой `next()`
- Парсинг параметров маршрута (`:id`)
- Парсинг query параметров
- Парсинг JSON тела запроса
- Обработка ошибок на всех уровнях

## Технические детали

- **Node.js** - встроенные модули: `http`, `fs`, `url`, `events`
- **Без внешних зависимостей** - проект не использует npm пакеты
- **Хранение данных** - JSON файлы в директории `data/`
- **Порт по умолчанию** - 3000 (можно изменить через переменную окружения PORT)
