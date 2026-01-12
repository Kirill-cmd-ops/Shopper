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

module.exports = {
  generateRandomProduct,
  generateRandomOrder,
  randomString,
  randomNumber,
  randomBoolean,
  randomDate,
  randomArray
};
