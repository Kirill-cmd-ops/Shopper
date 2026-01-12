# L910-Framework

Минималистичный веб-фреймворк для Node.js, разработанный с нуля без использования готовых решений (Express, Koa, Nest и т.д.).

## Описание проекта

Данный проект представляет собой полнофункциональный веб-фреймворк, аналогичный Express, который позволяет создавать серверные приложения с поддержкой:
- Маршрутизации HTTP запросов
- Middleware и цепочек middleware
- Обработки запросов и ответов
- Парсинга тела запроса (body-parser)
- Обработки ошибок

## Темы проекта

Проект реализует REST API для четырех различных систем:
1. **Магазин электроники** - управление товарами и заказами
2. **Магазин косметики** - управление косметическими продуктами и отзывами
3. **Магазин алкоголя** - управление алкогольными напитками и доставками
4. **Театральная афиша** - управление спектаклями и билетами

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

### Магазин косметики

#### 3. Косметика (Cosmetics)

Файл: `data/cosmetics.json`

Структура косметического продукта:
- **id** (string) - уникальный идентификатор продукта
- **name** (string) - название продукта
- **brand** (string) - бренд косметики
- **price** (number) - цена продукта в рублях
- **inStock** (boolean) - наличие продукта на складе
- **releaseDate** (Date string) - дата выпуска продукта в формате ISO
- **ingredients** (Array) - массив ингредиентов продукта
- **description** (string) - описание продукта

Пример косметического продукта:
```json
{
  "id": "1",
  "name": "Увлажняющий крем для лица",
  "brand": "L'Oreal Paris",
  "price": 1299,
  "inStock": true,
  "releaseDate": "2023-03-15T00:00:00.000Z",
  "ingredients": ["Гиалуроновая кислота", "Витамин E", "Алоэ вера", "Масло жожоба"],
  "description": "Интенсивное увлажнение на 24 часа для всех типов кожи"
}
```

#### 4. Отзывы (Reviews)

Файл: `data/reviews.json`

Структура отзыва:
- **id** (string) - уникальный идентификатор отзыва
- **productId** (string) - ID косметического продукта
- **customerName** (string) - имя клиента, оставившего отзыв
- **rating** (number) - оценка от 1 до 5
- **isVerified** (boolean) - подтвержден ли отзыв (верифицированная покупка)
- **reviewDate** (Date string) - дата отзыва в формате ISO
- **tags** (Array) - массив тегов отзыва
- **comment** (string) - текст отзыва

Пример отзыва:
```json
{
  "id": "1",
  "productId": "1",
  "customerName": "Анна Смирнова",
  "rating": 5,
  "isVerified": true,
  "reviewDate": "2024-01-10T14:30:00.000Z",
  "tags": ["Увлажнение", "Качество", "Рекомендую"],
  "comment": "Отличный крем! Кожа стала мягкой и увлажненной."
}
```

### Магазин алкоголя

#### 5. Алкогольные напитки (Alcohol)

Файл: `data/alcohol.json`

Структура алкогольного напитка:
- **id** (string) - уникальный идентификатор напитка
- **name** (string) - название напитка
- **type** (string) - тип алкоголя (виски, водка, шампанское и т.д.)
- **brand** (string) - бренд напитка
- **price** (number) - цена напитка в рублях
- **alcoholContent** (number) - крепость напитка в процентах
- **inStock** (boolean) - наличие напитка на складе
- **releaseDate** (Date string) - дата выпуска в формате ISO
- **countries** (Array) - массив стран производства
- **description** (string) - описание напитка

Пример алкогольного напитка:
```json
{
  "id": "1",
  "name": "Jack Daniel's Old No. 7",
  "type": "Виски",
  "brand": "Jack Daniel's",
  "price": 3499,
  "alcoholContent": 40,
  "inStock": true,
  "releaseDate": "2022-05-10T00:00:00.000Z",
  "countries": ["США", "Теннесси"],
  "description": "Классический американский виски с мягким вкусом"
}
```

#### 6. Доставки (Deliveries)

Файл: `data/deliveries.json`

Структура доставки:
- **id** (string) - уникальный идентификатор доставки
- **orderId** (string) - номер заказа
- **customerName** (string) - имя клиента
- **customerPhone** (string) - телефон клиента
- **deliveryAddress** (string) - адрес доставки
- **totalAmount** (number) - общая сумма заказа в рублях
- **isDelivered** (boolean) - статус доставки
- **deliveryDate** (Date string) - дата доставки в формате ISO
- **items** (Array) - массив товаров в доставке
  - **alcoholId** (string) - ID алкогольного напитка
  - **quantity** (number) - количество
  - **price** (number) - цена за единицу
- **deliveryNotes** (Array) - массив примечаний к доставке

Пример доставки:
```json
{
  "id": "1",
  "orderId": "ORD-001",
  "customerName": "Александр Иванов",
  "customerPhone": "+7 (999) 123-45-67",
  "deliveryAddress": "г. Москва, ул. Ленина, д. 10, кв. 25",
  "totalAmount": 3499,
  "isDelivered": true,
  "deliveryDate": "2024-01-15T14:30:00.000Z",
  "items": [
    {
      "alcoholId": "1",
      "quantity": 1,
      "price": 3499
    }
  ],
  "deliveryNotes": ["Доставить до 18:00", "Требуется проверка возраста"]
}
```

### Театральная афиша

#### 7. Спектакли (Performances)

Файл: `data/performances.json`

Структура спектакля:
- **id** (string) - уникальный идентификатор спектакля
- **title** (string) - название спектакля
- **genre** (string) - жанр (опера, балет, драма и т.д.)
- **theater** (string) - название театра
- **duration** (number) - продолжительность в минутах
- **isPremiere** (boolean) - является ли премьерой
- **premiereDate** (Date string) - дата премьеры в формате ISO
- **cast** (Array) - массив актеров в спектакле
- **description** (string) - описание спектакля

Пример спектакля:
```json
{
  "id": "1",
  "title": "Евгений Онегин",
  "genre": "Опера",
  "theater": "Большой театр",
  "duration": 180,
  "isPremiere": false,
  "premiereDate": "2023-09-15T19:00:00.000Z",
  "cast": ["Анна Нетребко", "Дмитрий Хворостовский", "Мария Гулегина"],
  "description": "Классическая опера П.И. Чайковского по роману А.С. Пушкина"
}
```

#### 8. Билеты (Tickets)

Файл: `data/tickets.json`

Структура билета:
- **id** (string) - уникальный идентификатор билета
- **performanceId** (string) - ID спектакля
- **seatNumber** (string) - номер места
- **row** (number) - ряд
- **section** (string) - сектор зала (Партер, Бенуар, Балкон и т.д.)
- **price** (number) - цена билета в рублях
- **isSold** (boolean) - продан ли билет
- **saleDate** (Date string) - дата продажи в формате ISO (null если не продан)
- **buyerInfo** (object) - информация о покупателе (null если не продан)
  - **name** (string) - имя покупателя
  - **phone** (string) - телефон
  - **email** (string) - email
- **discounts** (Array) - массив примененных скидок

Пример билета:
```json
{
  "id": "1",
  "performanceId": "1",
  "seatNumber": "15",
  "row": 5,
  "section": "Партер",
  "price": 3500,
  "isSold": true,
  "saleDate": "2024-01-10T12:30:00.000Z",
  "buyerInfo": {
    "name": "Иван Петров",
    "phone": "+7 (999) 123-45-67",
    "email": "ivan.petrov@example.com"
  },
  "discounts": ["Студенческий", "Льготный"]
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

### Маршруты для косметики (Cosmetics)

#### GET /cosmetics
Возвращает список всей косметики.

**Пример запроса:**
```bash
curl http://localhost:3000/cosmetics
```

#### GET /cosmetics/:id
Возвращает конкретный косметический продукт по его ID.

**Пример запроса:**
```bash
curl http://localhost:3000/cosmetics/1
```

#### POST /cosmetics
Создает новый косметический продукт. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса с данными:**
```bash
curl -X POST http://localhost:3000/cosmetics \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новая помада",
    "brand": "MAC Cosmetics",
    "price": 2499,
    "inStock": true,
    "releaseDate": "2024-01-01T00:00:00.000Z",
    "ingredients": ["Воск карнауба", "Масло ши"],
    "description": "Матовое покрытие"
  }'
```

#### PUT /cosmetics/:id
Полностью обновляет косметический продукт. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса:**
```bash
curl -X PUT http://localhost:3000/cosmetics/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Обновленное название",
    "brand": "Новый бренд",
    ...
  }'
```

#### PATCH /cosmetics/:id
Частично обновляет косметический продукт (только указанные поля). Реализация не идемпотентна.

**Пример запроса:**
```bash
curl -X PATCH http://localhost:3000/cosmetics/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1999,
    "inStock": false
  }'
```

#### DELETE /cosmetics/:id
Удаляет косметический продукт по ID.

**Пример запроса:**
```bash
curl -X DELETE http://localhost:3000/cosmetics/1
```

### Маршруты для отзывов (Reviews)

#### GET /reviews
Возвращает список всех отзывов.

**Пример запроса:**
```bash
curl http://localhost:3000/reviews
```

#### GET /reviews/:id
Возвращает конкретный отзыв по его ID.

**Пример запроса:**
```bash
curl http://localhost:3000/reviews/1
```

#### POST /reviews
Создает новый отзыв. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса с данными:**
```bash
curl -X POST http://localhost:3000/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "1",
    "customerName": "Анна Иванова",
    "rating": 5,
    "isVerified": true,
    "tags": ["Качество", "Рекомендую"],
    "comment": "Отличный продукт!"
  }'
```

**Примечание:** Если `productId` не указан, выбирается случайный продукт из существующих.

#### PUT /reviews/:id
Полностью обновляет отзыв. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса:**
```bash
curl -X PUT http://localhost:3000/reviews/1 \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "comment": "Обновленный комментарий",
    ...
  }'
```

#### PATCH /reviews/:id
Частично обновляет отзыв (только указанные поля). Реализация не идемпотентна.

**Пример запроса:**
```bash
curl -X PATCH http://localhost:3000/reviews/1 \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "isVerified": true
  }'
```

#### DELETE /reviews/:id
Удаляет отзыв по ID.

**Пример запроса:**
```bash
curl -X DELETE http://localhost:3000/reviews/1
```

### Маршруты для алкоголя (Alcohol)

#### GET /alcohol
Возвращает список всех алкогольных напитков.

**Пример запроса:**
```bash
curl http://localhost:3000/alcohol
```

#### GET /alcohol/:id
Возвращает конкретный алкогольный напиток по его ID.

**Пример запроса:**
```bash
curl http://localhost:3000/alcohol/1
```

#### POST /alcohol
Создает новый алкогольный напиток. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса с данными:**
```bash
curl -X POST http://localhost:3000/alcohol \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новый виски",
    "type": "Виски",
    "brand": "Johnnie Walker",
    "price": 4999,
    "alcoholContent": 40,
    "inStock": true,
    "releaseDate": "2024-01-01T00:00:00.000Z",
    "countries": ["Шотландия"],
    "description": "Выдержанный шотландский виски"
  }'
```

#### PUT /alcohol/:id
Полностью обновляет алкогольный напиток. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса:**
```bash
curl -X PUT http://localhost:3000/alcohol/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Обновленное название",
    "type": "Водка",
    ...
  }'
```

#### PATCH /alcohol/:id
Частично обновляет алкогольный напиток (только указанные поля). Реализация не идемпотентна.

**Пример запроса:**
```bash
curl -X PATCH http://localhost:3000/alcohol/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 3999,
    "alcoholContent": 42
  }'
```

#### DELETE /alcohol/:id
Удаляет алкогольный напиток по ID.

**Пример запроса:**
```bash
curl -X DELETE http://localhost:3000/alcohol/1
```

### Маршруты для доставок (Deliveries)

#### GET /deliveries
Возвращает список всех доставок.

**Пример запроса:**
```bash
curl http://localhost:3000/deliveries
```

#### GET /deliveries/:id
Возвращает конкретную доставку по ее ID.

**Пример запроса:**
```bash
curl http://localhost:3000/deliveries/1
```

#### POST /deliveries
Создает новую доставку. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса с данными:**
```bash
curl -X POST http://localhost:3000/deliveries \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-100",
    "customerName": "Иван Петров",
    "customerPhone": "+7 (999) 111-22-33",
    "deliveryAddress": "г. Москва, ул. Тверская, д. 1, кв. 10",
    "isDelivered": false,
    "items": [
      {
        "alcoholId": "1",
        "quantity": 2,
        "price": 3499
      }
    ],
    "deliveryNotes": ["Доставить до 20:00"]
  }'
```

**Примечание:** Если `totalAmount` не указан, он вычисляется автоматически на основе `items`.

#### PUT /deliveries/:id
Полностью обновляет доставку. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса:**
```bash
curl -X PUT http://localhost:3000/deliveries/1 \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Новое имя",
    ...
  }'
```

#### PATCH /deliveries/:id
Частично обновляет доставку (только указанные поля). Реализация не идемпотентна.

**Пример запроса:**
```bash
curl -X PATCH http://localhost:3000/deliveries/1 \
  -H "Content-Type: application/json" \
  -d '{
    "isDelivered": true,
    "deliveryDate": "2024-01-20T15:00:00.000Z"
  }'
```

#### DELETE /deliveries/:id
Удаляет доставку по ID.

**Пример запроса:**
```bash
curl -X DELETE http://localhost:3000/deliveries/1
```

### Маршруты для спектаклей (Performances)

#### GET /performances
Возвращает список всех спектаклей.

**Пример запроса:**
```bash
curl http://localhost:3000/performances
```

#### GET /performances/:id
Возвращает конкретный спектакль по его ID.

**Пример запроса:**
```bash
curl http://localhost:3000/performances/1
```

#### POST /performances
Создает новый спектакль. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса с данными:**
```bash
curl -X POST http://localhost:3000/performances \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ромео и Джульетта",
    "genre": "Балет",
    "theater": "Большой театр",
    "duration": 140,
    "isPremiere": true,
    "premiereDate": "2024-03-15T19:00:00.000Z",
    "cast": ["Светлана Захарова", "Владимир Васильев"],
    "description": "Трагическая история любви"
  }'
```

#### PUT /performances/:id
Полностью обновляет спектакль. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса:**
```bash
curl -X PUT http://localhost:3000/performances/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Обновленное название",
    ...
  }'
```

#### PATCH /performances/:id
Частично обновляет спектакль (только указанные поля). Реализация не идемпотентна.

**Пример запроса:**
```bash
curl -X PATCH http://localhost:3000/performances/1 \
  -H "Content-Type: application/json" \
  -d '{
    "duration": 200,
    "isPremiere": false
  }'
```

#### DELETE /performances/:id
Удаляет спектакль по ID.

**Пример запроса:**
```bash
curl -X DELETE http://localhost:3000/performances/1
```

### Маршруты для билетов (Tickets)

#### GET /tickets
Возвращает список всех билетов.

**Пример запроса:**
```bash
curl http://localhost:3000/tickets
```

#### GET /tickets/:id
Возвращает конкретный билет по его ID.

**Пример запроса:**
```bash
curl http://localhost:3000/tickets/1
```

#### POST /tickets
Создает новый билет. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса с данными:**
```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "performanceId": "1",
    "seatNumber": "10",
    "row": 3,
    "section": "Партер",
    "price": 4000,
    "isSold": false,
    "discounts": []
  }'
```

**Примечание:** Если `performanceId` не указан, выбирается случайный спектакль из существующих.

#### PUT /tickets/:id
Полностью обновляет билет. Если тело запроса пустое, генерируются случайные данные.

**Пример запроса:**
```bash
curl -X PUT http://localhost:3000/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 5000,
    "section": "VIP",
    ...
  }'
```

#### PATCH /tickets/:id
Частично обновляет билет (только указанные поля). Реализация не идемпотентна.

**Пример запроса:**
```bash
curl -X PATCH http://localhost:3000/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{
    "isSold": true,
    "price": 3500
  }'
```

#### DELETE /tickets/:id
Удаляет билет по ID.

**Пример запроса:**
```bash
curl -X DELETE http://localhost:3000/tickets/1
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
