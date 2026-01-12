// Генератор случайных данных для создания новых записей

function randomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBoolean() {
  return Math.random() > 0.5;
}

function randomDate(start = new Date(2020, 0, 1), end = new Date()) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomArray(length = 3) {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push(randomString(5));
  }
  return items;
}

function generateRandomProduct() {
  const categories = ['Смартфоны', 'Ноутбуки', 'Наушники', 'Игровые консоли', 'Планшеты', 'Умные часы'];
  const specs = ['Высокая производительность', 'Долгая батарея', 'Качественный экран', 'Быстрая зарядка'];
  
  return {
    name: `Товар ${randomString(8)}`,
    category: categories[randomNumber(0, categories.length - 1)],
    price: randomNumber(5000, 300000),
    inStock: randomBoolean(),
    releaseDate: randomDate().toISOString(),
    specifications: randomArray(randomNumber(2, 5)).map((_, i) => specs[i] || randomString(10)),
    description: `Описание товара ${randomString(20)}`
  };
}

function generateRandomOrder(productIds) {
  const names = ['Иван', 'Мария', 'Алексей', 'Елена', 'Дмитрий', 'Анна', 'Сергей', 'Ольга'];
  const surnames = ['Петров', 'Сидорова', 'Козлов', 'Волкова', 'Смирнов', 'Иванова', 'Кузнецов', 'Новикова'];
  const statuses = ['В обработке', 'Ожидает оплаты', 'Доставлен', 'Отменен'];
  
  const customerName = `${names[randomNumber(0, names.length - 1)]} ${surnames[randomNumber(0, surnames.length - 1)]}`;
  const itemCount = randomNumber(1, 3);
  const items = [];
  let totalAmount = 0;
  
  for (let i = 0; i < itemCount; i++) {
    const productId = productIds[randomNumber(0, productIds.length - 1)];
    const quantity = randomNumber(1, 2);
    const price = randomNumber(10000, 100000);
    items.push({ productId, quantity, price });
    totalAmount += price * quantity;
  }
  
  return {
    customerName,
    customerEmail: `${customerName.toLowerCase().replace(' ', '.')}@example.com`,
    totalAmount,
    isPaid: randomBoolean(),
    orderDate: randomDate().toISOString(),
    items,
    status: statuses[randomNumber(0, statuses.length - 1)]
  };
}

function generateRandomCosmetic() {
  const brands = ['L\'Oreal Paris', 'Maybelline', 'MAC Cosmetics', 'The Ordinary', 'Urban Decay', 'NYX', 'Revlon', 'Estée Lauder'];
  const productTypes = ['Крем для лица', 'Тональный крем', 'Помада', 'Тушь для ресниц', 'Сыворотка', 'Палетка теней', 'Пудра', 'Консилер'];
  const ingredients = ['Гиалуроновая кислота', 'Витамин E', 'Ретинол', 'Ниацинамид', 'Коллаген', 'SPF', 'Алоэ вера', 'Масло жожоба'];
  
  const ingredientCount = randomNumber(3, 6);
  const selectedIngredients = [];
  for (let i = 0; i < ingredientCount; i++) {
    const ing = ingredients[randomNumber(0, ingredients.length - 1)];
    if (!selectedIngredients.includes(ing)) {
      selectedIngredients.push(ing);
    }
  }
  
  return {
    name: `${productTypes[randomNumber(0, productTypes.length - 1)]} ${randomString(5)}`,
    brand: brands[randomNumber(0, brands.length - 1)],
    price: randomNumber(500, 5000),
    inStock: randomBoolean(),
    releaseDate: randomDate().toISOString(),
    ingredients: selectedIngredients.length > 0 ? selectedIngredients : ingredients.slice(0, 3),
    description: `Качественный продукт для ухода и макияжа от бренда ${brands[randomNumber(0, brands.length - 1)]}`
  };
}

function generateRandomReview(cosmeticIds) {
  const names = ['Анна', 'Мария', 'Елена', 'Ольга', 'Ирина', 'Светлана', 'Татьяна', 'Наталья'];
  const surnames = ['Смирнова', 'Петрова', 'Козлова', 'Волкова', 'Новикова', 'Иванова', 'Кузнецова', 'Морозова'];
  const tags = ['Качество', 'Рекомендую', 'Увлажнение', 'Стойкость', 'Естественный вид', 'Эффект', 'Доступная цена', 'Лучший продукт'];
  const comments = [
    'Отличный продукт! Результат превзошел ожидания.',
    'Хорошее качество за свою цену. Рекомендую к покупке.',
    'Использую уже месяц, вижу положительные изменения.',
    'Качественный продукт, но цена немного завышена.',
    'Потрясающий эффект! Буду покупать еще.'
  ];
  
  const customerName = `${names[randomNumber(0, names.length - 1)]} ${surnames[randomNumber(0, surnames.length - 1)]}`;
  const tagCount = randomNumber(1, 3);
  const selectedTags = [];
  for (let i = 0; i < tagCount; i++) {
    const tag = tags[randomNumber(0, tags.length - 1)];
    if (!selectedTags.includes(tag)) {
      selectedTags.push(tag);
    }
  }
  
  return {
    productId: cosmeticIds[randomNumber(0, cosmeticIds.length - 1)],
    customerName,
    rating: randomNumber(1, 5),
    isVerified: randomBoolean(),
    reviewDate: randomDate().toISOString(),
    tags: selectedTags.length > 0 ? selectedTags : [tags[0]],
    comment: comments[randomNumber(0, comments.length - 1)]
  };
}

function generateRandomAlcohol() {
  const types = ['Виски', 'Водка', 'Шампанское', 'Ром', 'Джин', 'Коньяк', 'Текила', 'Вино'];
  const brands = ['Jack Daniel\'s', 'Absolut', 'Moët & Chandon', 'Bacardi', 'Bombay Sapphire', 'Hennessy', 'Jose Cuervo', 'Chivas Regal'];
  const countries = ['США', 'Швеция', 'Франция', 'Пуэрто-Рико', 'Великобритания', 'Мексика', 'Шотландия', 'Италия'];
  
  const countryCount = randomNumber(1, 2);
  const selectedCountries = [];
  for (let i = 0; i < countryCount; i++) {
    const country = countries[randomNumber(0, countries.length - 1)];
    if (!selectedCountries.includes(country)) {
      selectedCountries.push(country);
    }
  }
  
  return {
    name: `${types[randomNumber(0, types.length - 1)]} ${randomString(6)}`,
    type: types[randomNumber(0, types.length - 1)],
    brand: brands[randomNumber(0, brands.length - 1)],
    price: randomNumber(1000, 20000),
    alcoholContent: randomNumber(12, 50),
    inStock: randomBoolean(),
    releaseDate: randomDate().toISOString(),
    countries: selectedCountries.length > 0 ? selectedCountries : [countries[0]],
    description: `Качественный алкогольный напиток от бренда ${brands[randomNumber(0, brands.length - 1)]}`
  };
}

function generateRandomDelivery(alcoholIds) {
  const names = ['Александр', 'Мария', 'Дмитрий', 'Елена', 'Сергей', 'Анна', 'Иван', 'Ольга'];
  const surnames = ['Иванов', 'Петрова', 'Сидоров', 'Козлова', 'Волков', 'Смирнова', 'Кузнецов', 'Новикова'];
  const cities = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Новосибирск', 'Казань', 'Нижний Новгород'];
  const streets = ['ул. Ленина', 'пр. Невский', 'ул. Мира', 'ул. Красный проспект', 'ул. Баумана', 'ул. Пушкина'];
  const notes = ['Доставить до 18:00', 'Требуется проверка возраста', 'Курьер позвонит за час', 'Хрупкий товар', 'Подарочная упаковка'];
  
  const customerName = `${names[randomNumber(0, names.length - 1)]} ${surnames[randomNumber(0, surnames.length - 1)]}`;
  const city = cities[randomNumber(0, cities.length - 1)];
  const street = streets[randomNumber(0, streets.length - 1)];
  const deliveryAddress = `г. ${city}, ${street}, д. ${randomNumber(1, 100)}, кв. ${randomNumber(1, 100)}`;
  
  const itemCount = randomNumber(1, 3);
  const items = [];
  let totalAmount = 0;
  
  for (let i = 0; i < itemCount; i++) {
    const alcoholId = alcoholIds[randomNumber(0, alcoholIds.length - 1)];
    const quantity = randomNumber(1, 3);
    const price = randomNumber(1000, 15000);
    items.push({ alcoholId, quantity, price });
    totalAmount += price * quantity;
  }
  
  const noteCount = randomNumber(0, 2);
  const selectedNotes = [];
  for (let i = 0; i < noteCount; i++) {
    const note = notes[randomNumber(0, notes.length - 1)];
    if (!selectedNotes.includes(note)) {
      selectedNotes.push(note);
    }
  }
  
  return {
    orderId: `ORD-${randomString(6).toUpperCase()}`,
    customerName,
    customerPhone: `+7 (999) ${randomNumber(100, 999)}-${randomNumber(10, 99)}-${randomNumber(10, 99)}`,
    deliveryAddress,
    totalAmount,
    isDelivered: randomBoolean(),
    deliveryDate: randomDate().toISOString(),
    items,
    deliveryNotes: selectedNotes
  };
}

function generateRandomPerformance() {
  const titles = ['Евгений Онегин', 'Лебединое озеро', 'Гамлет', 'Щелкунчик', 'Вишневый сад', 'Кармен', 'Ромео и Джульетта', 'Спящая красавица'];
  const genres = ['Опера', 'Балет', 'Драма', 'Комедия', 'Мюзикл', 'Трагедия'];
  const theaters = ['Большой театр', 'Мариинский театр', 'МХТ им. Чехова', 'Театр им. Вахтангова', 'Ленком', 'Современник'];
  const actors = ['Анна Нетребко', 'Дмитрий Хворостовский', 'Данила Козловский', 'Евгений Миронов', 'Светлана Захарова', 'Константин Хабенский'];
  
  const castCount = randomNumber(2, 4);
  const selectedCast = [];
  for (let i = 0; i < castCount; i++) {
    const actor = actors[randomNumber(0, actors.length - 1)];
    if (!selectedCast.includes(actor)) {
      selectedCast.push(actor);
    }
  }
  
  return {
    title: titles[randomNumber(0, titles.length - 1)],
    genre: genres[randomNumber(0, genres.length - 1)],
    theater: theaters[randomNumber(0, theaters.length - 1)],
    duration: randomNumber(90, 240),
    isPremiere: randomBoolean(),
    premiereDate: randomDate().toISOString(),
    cast: selectedCast.length > 0 ? selectedCast : [actors[0], actors[1]],
    description: `Театральная постановка в жанре ${genres[randomNumber(0, genres.length - 1)]}`
  };
}

function generateRandomTicket(performanceIds) {
  const sections = ['Партер', 'Бенуар', 'Балкон', 'VIP', 'Амфитеатр', 'Ложа'];
  const names = ['Иван', 'Мария', 'Алексей', 'Елена', 'Дмитрий', 'Анна', 'Сергей', 'Ольга'];
  const surnames = ['Петров', 'Сидорова', 'Козлов', 'Волкова', 'Смирнов', 'Иванова', 'Кузнецов', 'Новикова'];
  const discounts = ['Студенческий', 'Пенсионный', 'Льготный', 'Семейный', 'Детский'];
  
  const buyerName = `${names[randomNumber(0, names.length - 1)]} ${surnames[randomNumber(0, surnames.length - 1)]}`;
  const isSold = randomBoolean();
  
  const discountCount = isSold ? randomNumber(0, 2) : 0;
  const selectedDiscounts = [];
  for (let i = 0; i < discountCount; i++) {
    const discount = discounts[randomNumber(0, discounts.length - 1)];
    if (!selectedDiscounts.includes(discount)) {
      selectedDiscounts.push(discount);
    }
  }
  
  const section = sections[randomNumber(0, sections.length - 1)];
  let basePrice = 2000;
  if (section === 'VIP') basePrice = 10000;
  else if (section === 'Партер') basePrice = 4000;
  else if (section === 'Бенуар') basePrice = 5500;
  else if (section === 'Балкон') basePrice = 1500;
  
  return {
    performanceId: performanceIds[randomNumber(0, performanceIds.length - 1)],
    seatNumber: String(randomNumber(1, 30)),
    row: randomNumber(1, 10),
    section: section,
    price: basePrice + randomNumber(-500, 1000),
    isSold: isSold,
    saleDate: isSold ? randomDate().toISOString() : null,
    buyerInfo: isSold ? {
      name: buyerName,
      phone: `+7 (999) ${randomNumber(100, 999)}-${randomNumber(10, 99)}-${randomNumber(10, 99)}`,
      email: `${buyerName.toLowerCase().replace(' ', '.')}@example.com`
    } : null,
    discounts: selectedDiscounts
  };
}

module.exports = {
  generateRandomProduct,
  generateRandomOrder,
  generateRandomCosmetic,
  generateRandomReview,
  generateRandomAlcohol,
  generateRandomDelivery,
  generateRandomPerformance,
  generateRandomTicket,
  randomString,
  randomNumber,
  randomBoolean,
  randomDate,
  randomArray
};
