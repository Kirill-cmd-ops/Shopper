const app = require('./framework')();
const DataManager = require('./utils/dataManager');
const { generateRandomProduct, generateRandomOrder, generateRandomCosmetic, generateRandomReview, generateRandomAlcohol, generateRandomDelivery, generateRandomPerformance, generateRandomTicket } = require('./utils/randomGenerator');
const path = require('path');

// Инициализация менеджеров данных
const productsManager = new DataManager(path.join(__dirname, 'data', 'products.json'));
const ordersManager = new DataManager(path.join(__dirname, 'data', 'orders.json'));
const cosmeticsManager = new DataManager(path.join(__dirname, 'data', 'cosmetics.json'));
const reviewsManager = new DataManager(path.join(__dirname, 'data', 'reviews.json'));
const alcoholManager = new DataManager(path.join(__dirname, 'data', 'alcohol.json'));
const deliveriesManager = new DataManager(path.join(__dirname, 'data', 'deliveries.json'));
const performancesManager = new DataManager(path.join(__dirname, 'data', 'performances.json'));
const ticketsManager = new DataManager(path.join(__dirname, 'data', 'tickets.json'));

// Middleware для логирования
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware для обработки ошибок
app.use((req, res, next) => {
  try {
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// ==================== МАРШРУТЫ ДЛЯ ТОВАРОВ (PRODUCTS) ====================

// GET /products - получить все товары
app.get('/products', async (req, res) => {
  try {
    const products = await productsManager.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', message: error.message });
  }
});

// GET /products/:id - получить товар по ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await productsManager.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product', message: error.message });
  }
});

// POST /products - создать новый товар
app.post('/products', async (req, res) => {
  try {
    let productData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      // Используем данные из body
      const allProducts = await productsManager.findAll();
      const newId = String(allProducts.length + 1);
      productData = {
        id: newId,
        ...req.body
      };
    } else {
      // Генерируем случайные данные
      const allProducts = await productsManager.findAll();
      const newId = String(allProducts.length + 1);
      productData = {
        id: newId,
        ...generateRandomProduct()
      };
    }
    
    // Валидация обязательных полей
    if (!productData.name || !productData.category || productData.price === undefined) {
      return res.status(400).json({ error: 'Missing required fields: name, category, price' });
    }
    
    const product = await productsManager.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product', message: error.message });
  }
});

// PUT /products/:id - полностью обновить товар
app.put('/products/:id', async (req, res) => {
  try {
    const existingProduct = await productsManager.findById(req.params.id);
    
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      // Генерируем случайные данные
      updateData = generateRandomProduct();
    }
    
    // Сохраняем ID
    updateData.id = req.params.id;
    
    const updatedProduct = await productsManager.update(req.params.id, updateData);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product', message: error.message });
  }
});

// PATCH /products/:id - частично обновить товар
app.patch('/products/:id', async (req, res) => {
  try {
    const existingProduct = await productsManager.findById(req.params.id);
    
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      // Генерируем случайные данные для частичного обновления
      const fields = ['name', 'price', 'inStock', 'category'];
      const randomField = fields[Math.floor(Math.random() * fields.length)];
      updateData = { [randomField]: randomField === 'price' ? Math.floor(Math.random() * 300000) : 
                    randomField === 'inStock' ? Math.random() > 0.5 : 
                    randomField === 'name' ? `Обновленный товар ${Date.now()}` : 'Новая категория' };
    }
    
    const updatedProduct = await productsManager.partialUpdate(req.params.id, updateData);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product', message: error.message });
  }
});

// DELETE /products/:id - удалить товар
app.delete('/products/:id', async (req, res) => {
  try {
    const product = await productsManager.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await productsManager.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', message: error.message });
  }
});

// ==================== МАРШРУТЫ ДЛЯ ЗАКАЗОВ (ORDERS) ====================

// GET /orders - получить все заказы
app.get('/orders', async (req, res) => {
  try {
    const orders = await ordersManager.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
});

// GET /orders/:id - получить заказ по ID
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await ordersManager.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order', message: error.message });
  }
});

// POST /orders - создать новый заказ
app.post('/orders', async (req, res) => {
  try {
    let orderData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      // Используем данные из body
      const allOrders = await ordersManager.findAll();
      const newId = String(allOrders.length + 1);
      
      // Получаем список товаров для генерации случайного заказа, если items не указаны
      if (!req.body.items) {
        const allProducts = await productsManager.findAll();
        const productIds = allProducts.map(p => p.id);
        const randomOrder = generateRandomOrder(productIds);
        orderData = {
          id: newId,
          ...req.body,
          items: randomOrder.items
        };
      } else {
        orderData = {
          id: newId,
          ...req.body
        };
      }
    } else {
      // Генерируем случайные данные
      const allOrders = await ordersManager.findAll();
      const newId = String(allOrders.length + 1);
      const allProducts = await productsManager.findAll();
      const productIds = allProducts.map(p => p.id);
      
      if (productIds.length === 0) {
        return res.status(400).json({ error: 'No products available. Create products first.' });
      }
      
      orderData = {
        id: newId,
        ...generateRandomOrder(productIds)
      };
    }
    
    // Валидация обязательных полей
    if (!orderData.customerName || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: customerName, items' });
    }
    
    // Вычисляем totalAmount если не указан
    if (!orderData.totalAmount) {
      orderData.totalAmount = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    const order = await ordersManager.create(orderData);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
});

// PUT /orders/:id - полностью обновить заказ
app.put('/orders/:id', async (req, res) => {
  try {
    const existingOrder = await ordersManager.findById(req.params.id);
    
    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      // Генерируем случайные данные
      const allProducts = await productsManager.findAll();
      const productIds = allProducts.map(p => p.id);
      updateData = generateRandomOrder(productIds);
    }
    
    // Сохраняем ID
    updateData.id = req.params.id;
    
    const updatedOrder = await ordersManager.update(req.params.id, updateData);
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order', message: error.message });
  }
});

// PATCH /orders/:id - частично обновить заказ
app.patch('/orders/:id', async (req, res) => {
  try {
    const existingOrder = await ordersManager.findById(req.params.id);
    
    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      // Генерируем случайные данные для частичного обновления
      const fields = ['status', 'isPaid', 'customerName'];
      const randomField = fields[Math.floor(Math.random() * fields.length)];
      const statuses = ['В обработке', 'Ожидает оплаты', 'Доставлен', 'Отменен'];
      
      updateData = {
        [randomField]: randomField === 'status' ? statuses[Math.floor(Math.random() * statuses.length)] :
                      randomField === 'isPaid' ? Math.random() > 0.5 :
                      `Обновленное имя ${Date.now()}`
      };
    }
    
    const updatedOrder = await ordersManager.partialUpdate(req.params.id, updateData);
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order', message: error.message });
  }
});

// DELETE /orders/:id - удалить заказ
app.delete('/orders/:id', async (req, res) => {
  try {
    const order = await ordersManager.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    await ordersManager.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order', message: error.message });
  }
});

// ==================== МАРШРУТЫ ДЛЯ КОСМЕТИКИ (COSMETICS) ====================

// GET /cosmetics - получить всю косметику
app.get('/cosmetics', async (req, res) => {
  try {
    const cosmetics = await cosmeticsManager.findAll();
    res.json(cosmetics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cosmetics', message: error.message });
  }
});

// GET /cosmetics/:id - получить косметику по ID
app.get('/cosmetics/:id', async (req, res) => {
  try {
    const cosmetic = await cosmeticsManager.findById(req.params.id);
    
    if (!cosmetic) {
      return res.status(404).json({ error: 'Cosmetic not found' });
    }
    
    res.json(cosmetic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cosmetic', message: error.message });
  }
});

// POST /cosmetics - создать новую косметику
app.post('/cosmetics', async (req, res) => {
  try {
    let cosmeticData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      const allCosmetics = await cosmeticsManager.findAll();
      const newId = String(allCosmetics.length + 1);
      cosmeticData = {
        id: newId,
        ...req.body
      };
    } else {
      const allCosmetics = await cosmeticsManager.findAll();
      const newId = String(allCosmetics.length + 1);
      cosmeticData = {
        id: newId,
        ...generateRandomCosmetic()
      };
    }
    
    if (!cosmeticData.name || !cosmeticData.brand || cosmeticData.price === undefined) {
      return res.status(400).json({ error: 'Missing required fields: name, brand, price' });
    }
    
    const cosmetic = await cosmeticsManager.create(cosmeticData);
    res.status(201).json(cosmetic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create cosmetic', message: error.message });
  }
});

// PUT /cosmetics/:id - полностью обновить косметику
app.put('/cosmetics/:id', async (req, res) => {
  try {
    const existingCosmetic = await cosmeticsManager.findById(req.params.id);
    
    if (!existingCosmetic) {
      return res.status(404).json({ error: 'Cosmetic not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      updateData = generateRandomCosmetic();
    }
    
    updateData.id = req.params.id;
    
    const updatedCosmetic = await cosmeticsManager.update(req.params.id, updateData);
    res.json(updatedCosmetic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cosmetic', message: error.message });
  }
});

// PATCH /cosmetics/:id - частично обновить косметику
app.patch('/cosmetics/:id', async (req, res) => {
  try {
    const existingCosmetic = await cosmeticsManager.findById(req.params.id);
    
    if (!existingCosmetic) {
      return res.status(404).json({ error: 'Cosmetic not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      const fields = ['name', 'price', 'inStock', 'brand'];
      const randomField = fields[Math.floor(Math.random() * fields.length)];
      updateData = { 
        [randomField]: randomField === 'price' ? Math.floor(Math.random() * 5000) : 
                      randomField === 'inStock' ? Math.random() > 0.5 : 
                      randomField === 'name' ? `Обновленная косметика ${Date.now()}` : 'Новый бренд' 
      };
    }
    
    const updatedCosmetic = await cosmeticsManager.partialUpdate(req.params.id, updateData);
    res.json(updatedCosmetic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cosmetic', message: error.message });
  }
});

// DELETE /cosmetics/:id - удалить косметику
app.delete('/cosmetics/:id', async (req, res) => {
  try {
    const cosmetic = await cosmeticsManager.findById(req.params.id);
    
    if (!cosmetic) {
      return res.status(404).json({ error: 'Cosmetic not found' });
    }
    
    await cosmeticsManager.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cosmetic', message: error.message });
  }
});

// ==================== МАРШРУТЫ ДЛЯ ОТЗЫВОВ (REVIEWS) ====================

// GET /reviews - получить все отзывы
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await reviewsManager.findAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews', message: error.message });
  }
});

// GET /reviews/:id - получить отзыв по ID
app.get('/reviews/:id', async (req, res) => {
  try {
    const review = await reviewsManager.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch review', message: error.message });
  }
});

// POST /reviews - создать новый отзыв
app.post('/reviews', async (req, res) => {
  try {
    let reviewData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      const allReviews = await reviewsManager.findAll();
      const newId = String(allReviews.length + 1);
      
      if (!req.body.productId) {
        const allCosmetics = await cosmeticsManager.findAll();
        const cosmeticIds = allCosmetics.map(c => c.id);
        if (cosmeticIds.length === 0) {
          return res.status(400).json({ error: 'No cosmetics available. Create cosmetics first.' });
        }
        const randomReview = generateRandomReview(cosmeticIds);
        reviewData = {
          id: newId,
          ...req.body,
          productId: randomReview.productId
        };
      } else {
        reviewData = {
          id: newId,
          ...req.body
        };
      }
    } else {
      const allReviews = await reviewsManager.findAll();
      const newId = String(allReviews.length + 1);
      const allCosmetics = await cosmeticsManager.findAll();
      const cosmeticIds = allCosmetics.map(c => c.id);
      
      if (cosmeticIds.length === 0) {
        return res.status(400).json({ error: 'No cosmetics available. Create cosmetics first.' });
      }
      
      reviewData = {
        id: newId,
        ...generateRandomReview(cosmeticIds)
      };
    }
    
    if (!reviewData.productId || !reviewData.customerName || reviewData.rating === undefined) {
      return res.status(400).json({ error: 'Missing required fields: productId, customerName, rating' });
    }
    
    const review = await reviewsManager.create(reviewData);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review', message: error.message });
  }
});

// PUT /reviews/:id - полностью обновить отзыв
app.put('/reviews/:id', async (req, res) => {
  try {
    const existingReview = await reviewsManager.findById(req.params.id);
    
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      const allCosmetics = await cosmeticsManager.findAll();
      const cosmeticIds = allCosmetics.map(c => c.id);
      updateData = generateRandomReview(cosmeticIds);
    }
    
    updateData.id = req.params.id;
    
    const updatedReview = await reviewsManager.update(req.params.id, updateData);
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review', message: error.message });
  }
});

// PATCH /reviews/:id - частично обновить отзыв
app.patch('/reviews/:id', async (req, res) => {
  try {
    const existingReview = await reviewsManager.findById(req.params.id);
    
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      const fields = ['rating', 'isVerified', 'comment'];
      const randomField = fields[Math.floor(Math.random() * fields.length)];
      updateData = {
        [randomField]: randomField === 'rating' ? Math.floor(Math.random() * 5) + 1 :
                      randomField === 'isVerified' ? Math.random() > 0.5 :
                      `Обновленный комментарий ${Date.now()}`
      };
    }
    
    const updatedReview = await reviewsManager.partialUpdate(req.params.id, updateData);
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review', message: error.message });
  }
});

// DELETE /reviews/:id - удалить отзыв
app.delete('/reviews/:id', async (req, res) => {
  try {
    const review = await reviewsManager.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    await reviewsManager.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review', message: error.message });
  }
});

// ==================== МАРШРУТЫ ДЛЯ АЛКОГОЛЯ (ALCOHOL) ====================

// GET /alcohol - получить весь алкоголь
app.get('/alcohol', async (req, res) => {
  try {
    const alcohol = await alcoholManager.findAll();
    res.json(alcohol);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alcohol', message: error.message });
  }
});

// GET /alcohol/:id - получить алкоголь по ID
app.get('/alcohol/:id', async (req, res) => {
  try {
    const alcohol = await alcoholManager.findById(req.params.id);
    
    if (!alcohol) {
      return res.status(404).json({ error: 'Alcohol not found' });
    }
    
    res.json(alcohol);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alcohol', message: error.message });
  }
});

// POST /alcohol - создать новый алкоголь
app.post('/alcohol', async (req, res) => {
  try {
    let alcoholData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      const allAlcohol = await alcoholManager.findAll();
      const newId = String(allAlcohol.length + 1);
      alcoholData = {
        id: newId,
        ...req.body
      };
    } else {
      const allAlcohol = await alcoholManager.findAll();
      const newId = String(allAlcohol.length + 1);
      alcoholData = {
        id: newId,
        ...generateRandomAlcohol()
      };
    }
    
    if (!alcoholData.name || !alcoholData.type || !alcoholData.brand || alcoholData.price === undefined) {
      return res.status(400).json({ error: 'Missing required fields: name, type, brand, price' });
    }
    
    const alcohol = await alcoholManager.create(alcoholData);
    res.status(201).json(alcohol);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create alcohol', message: error.message });
  }
});

// PUT /alcohol/:id - полностью обновить алкоголь
app.put('/alcohol/:id', async (req, res) => {
  try {
    const existingAlcohol = await alcoholManager.findById(req.params.id);
    
    if (!existingAlcohol) {
      return res.status(404).json({ error: 'Alcohol not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      updateData = generateRandomAlcohol();
    }
    
    updateData.id = req.params.id;
    
    const updatedAlcohol = await alcoholManager.update(req.params.id, updateData);
    res.json(updatedAlcohol);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alcohol', message: error.message });
  }
});

// PATCH /alcohol/:id - частично обновить алкоголь
app.patch('/alcohol/:id', async (req, res) => {
  try {
    const existingAlcohol = await alcoholManager.findById(req.params.id);
    
    if (!existingAlcohol) {
      return res.status(404).json({ error: 'Alcohol not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      const fields = ['name', 'price', 'inStock', 'alcoholContent'];
      const randomField = fields[Math.floor(Math.random() * fields.length)];
      updateData = { 
        [randomField]: randomField === 'price' ? Math.floor(Math.random() * 20000) : 
                      randomField === 'inStock' ? Math.random() > 0.5 : 
                      randomField === 'alcoholContent' ? Math.floor(Math.random() * 40) + 10 :
                      randomField === 'name' ? `Обновленный напиток ${Date.now()}` : 'Новое название' 
      };
    }
    
    const updatedAlcohol = await alcoholManager.partialUpdate(req.params.id, updateData);
    res.json(updatedAlcohol);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alcohol', message: error.message });
  }
});

// DELETE /alcohol/:id - удалить алкоголь
app.delete('/alcohol/:id', async (req, res) => {
  try {
    const alcohol = await alcoholManager.findById(req.params.id);
    
    if (!alcohol) {
      return res.status(404).json({ error: 'Alcohol not found' });
    }
    
    await alcoholManager.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete alcohol', message: error.message });
  }
});

// ==================== МАРШРУТЫ ДЛЯ ДОСТАВОК (DELIVERIES) ====================

// GET /deliveries - получить все доставки
app.get('/deliveries', async (req, res) => {
  try {
    const deliveries = await deliveriesManager.findAll();
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deliveries', message: error.message });
  }
});

// GET /deliveries/:id - получить доставку по ID
app.get('/deliveries/:id', async (req, res) => {
  try {
    const delivery = await deliveriesManager.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch delivery', message: error.message });
  }
});

// POST /deliveries - создать новую доставку
app.post('/deliveries', async (req, res) => {
  try {
    let deliveryData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      const allDeliveries = await deliveriesManager.findAll();
      const newId = String(allDeliveries.length + 1);
      
      if (!req.body.items) {
        const allAlcohol = await alcoholManager.findAll();
        const alcoholIds = allAlcohol.map(a => a.id);
        if (alcoholIds.length === 0) {
          return res.status(400).json({ error: 'No alcohol available. Create alcohol first.' });
        }
        const randomDelivery = generateRandomDelivery(alcoholIds);
        deliveryData = {
          id: newId,
          ...req.body,
          items: randomDelivery.items
        };
      } else {
        deliveryData = {
          id: newId,
          ...req.body
        };
      }
    } else {
      const allDeliveries = await deliveriesManager.findAll();
      const newId = String(allDeliveries.length + 1);
      const allAlcohol = await alcoholManager.findAll();
      const alcoholIds = allAlcohol.map(a => a.id);
      
      if (alcoholIds.length === 0) {
        return res.status(400).json({ error: 'No alcohol available. Create alcohol first.' });
      }
      
      deliveryData = {
        id: newId,
        ...generateRandomDelivery(alcoholIds)
      };
    }
    
    if (!deliveryData.customerName || !deliveryData.deliveryAddress || !deliveryData.items || deliveryData.items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: customerName, deliveryAddress, items' });
    }
    
    if (!deliveryData.totalAmount) {
      deliveryData.totalAmount = deliveryData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    const delivery = await deliveriesManager.create(deliveryData);
    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create delivery', message: error.message });
  }
});

// PUT /deliveries/:id - полностью обновить доставку
app.put('/deliveries/:id', async (req, res) => {
  try {
    const existingDelivery = await deliveriesManager.findById(req.params.id);
    
    if (!existingDelivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      const allAlcohol = await alcoholManager.findAll();
      const alcoholIds = allAlcohol.map(a => a.id);
      updateData = generateRandomDelivery(alcoholIds);
    }
    
    updateData.id = req.params.id;
    
    const updatedDelivery = await deliveriesManager.update(req.params.id, updateData);
    res.json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update delivery', message: error.message });
  }
});

// PATCH /deliveries/:id - частично обновить доставку
app.patch('/deliveries/:id', async (req, res) => {
  try {
    const existingDelivery = await deliveriesManager.findById(req.params.id);
    
    if (!existingDelivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      const fields = ['isDelivered', 'deliveryAddress', 'deliveryDate'];
      const randomField = fields[Math.floor(Math.random() * fields.length)];
      updateData = {
        [randomField]: randomField === 'isDelivered' ? Math.random() > 0.5 :
                      randomField === 'deliveryAddress' ? `г. Москва, ул. Новая, д. ${Math.floor(Math.random() * 100)}, кв. ${Math.floor(Math.random() * 100)}` :
                      new Date().toISOString()
      };
    }
    
    const updatedDelivery = await deliveriesManager.partialUpdate(req.params.id, updateData);
    res.json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update delivery', message: error.message });
  }
});

// DELETE /deliveries/:id - удалить доставку
app.delete('/deliveries/:id', async (req, res) => {
  try {
    const delivery = await deliveriesManager.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    await deliveriesManager.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete delivery', message: error.message });
  }
});

// ==================== МАРШРУТЫ ДЛЯ СПЕКТАКЛЕЙ (PERFORMANCES) ====================

// GET /performances - получить все спектакли
app.get('/performances', async (req, res) => {
  try {
    const performances = await performancesManager.findAll();
    res.json(performances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch performances', message: error.message });
  }
});

// GET /performances/:id - получить спектакль по ID
app.get('/performances/:id', async (req, res) => {
  try {
    const performance = await performancesManager.findById(req.params.id);
    
    if (!performance) {
      return res.status(404).json({ error: 'Performance not found' });
    }
    
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch performance', message: error.message });
  }
});

// POST /performances - создать новый спектакль
app.post('/performances', async (req, res) => {
  try {
    let performanceData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      const allPerformances = await performancesManager.findAll();
      const newId = String(allPerformances.length + 1);
      performanceData = {
        id: newId,
        ...req.body
      };
    } else {
      const allPerformances = await performancesManager.findAll();
      const newId = String(allPerformances.length + 1);
      performanceData = {
        id: newId,
        ...generateRandomPerformance()
      };
    }
    
    if (!performanceData.title || !performanceData.genre || !performanceData.theater || performanceData.duration === undefined) {
      return res.status(400).json({ error: 'Missing required fields: title, genre, theater, duration' });
    }
    
    const performance = await performancesManager.create(performanceData);
    res.status(201).json(performance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create performance', message: error.message });
  }
});

// PUT /performances/:id - полностью обновить спектакль
app.put('/performances/:id', async (req, res) => {
  try {
    const existingPerformance = await performancesManager.findById(req.params.id);
    
    if (!existingPerformance) {
      return res.status(404).json({ error: 'Performance not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      updateData = generateRandomPerformance();
    }
    
    updateData.id = req.params.id;
    
    const updatedPerformance = await performancesManager.update(req.params.id, updateData);
    res.json(updatedPerformance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update performance', message: error.message });
  }
});

// PATCH /performances/:id - частично обновить спектакль
app.patch('/performances/:id', async (req, res) => {
  try {
    const existingPerformance = await performancesManager.findById(req.params.id);
    
    if (!existingPerformance) {
      return res.status(404).json({ error: 'Performance not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      const fields = ['title', 'duration', 'isPremiere', 'theater'];
      const randomField = fields[Math.floor(Math.random() * fields.length)];
      updateData = { 
        [randomField]: randomField === 'duration' ? Math.floor(Math.random() * 150) + 90 : 
                      randomField === 'isPremiere' ? Math.random() > 0.5 : 
                      randomField === 'title' ? `Обновленный спектакль ${Date.now()}` : 
                      'Новый театр' 
      };
    }
    
    const updatedPerformance = await performancesManager.partialUpdate(req.params.id, updateData);
    res.json(updatedPerformance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update performance', message: error.message });
  }
});

// DELETE /performances/:id - удалить спектакль
app.delete('/performances/:id', async (req, res) => {
  try {
    const performance = await performancesManager.findById(req.params.id);
    
    if (!performance) {
      return res.status(404).json({ error: 'Performance not found' });
    }
    
    await performancesManager.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete performance', message: error.message });
  }
});

// ==================== МАРШРУТЫ ДЛЯ БИЛЕТОВ (TICKETS) ====================

// GET /tickets - получить все билеты
app.get('/tickets', async (req, res) => {
  try {
    const tickets = await ticketsManager.findAll();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets', message: error.message });
  }
});

// GET /tickets/:id - получить билет по ID
app.get('/tickets/:id', async (req, res) => {
  try {
    const ticket = await ticketsManager.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket', message: error.message });
  }
});

// POST /tickets - создать новый билет
app.post('/tickets', async (req, res) => {
  try {
    let ticketData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      const allTickets = await ticketsManager.findAll();
      const newId = String(allTickets.length + 1);
      
      if (!req.body.performanceId) {
        const allPerformances = await performancesManager.findAll();
        const performanceIds = allPerformances.map(p => p.id);
        if (performanceIds.length === 0) {
          return res.status(400).json({ error: 'No performances available. Create performances first.' });
        }
        const randomTicket = generateRandomTicket(performanceIds);
        ticketData = {
          id: newId,
          ...req.body,
          performanceId: randomTicket.performanceId
        };
      } else {
        ticketData = {
          id: newId,
          ...req.body
        };
      }
    } else {
      const allTickets = await ticketsManager.findAll();
      const newId = String(allTickets.length + 1);
      const allPerformances = await performancesManager.findAll();
      const performanceIds = allPerformances.map(p => p.id);
      
      if (performanceIds.length === 0) {
        return res.status(400).json({ error: 'No performances available. Create performances first.' });
      }
      
      ticketData = {
        id: newId,
        ...generateRandomTicket(performanceIds)
      };
    }
    
    if (!ticketData.performanceId || !ticketData.seatNumber || !ticketData.section || ticketData.price === undefined) {
      return res.status(400).json({ error: 'Missing required fields: performanceId, seatNumber, section, price' });
    }
    
    const ticket = await ticketsManager.create(ticketData);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket', message: error.message });
  }
});

// PUT /tickets/:id - полностью обновить билет
app.put('/tickets/:id', async (req, res) => {
  try {
    const existingTicket = await ticketsManager.findById(req.params.id);
    
    if (!existingTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      const allPerformances = await performancesManager.findAll();
      const performanceIds = allPerformances.map(p => p.id);
      updateData = generateRandomTicket(performanceIds);
    }
    
    updateData.id = req.params.id;
    
    const updatedTicket = await ticketsManager.update(req.params.id, updateData);
    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket', message: error.message });
  }
});

// PATCH /tickets/:id - частично обновить билет
app.patch('/tickets/:id', async (req, res) => {
  try {
    const existingTicket = await ticketsManager.findById(req.params.id);
    
    if (!existingTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    let updateData;
    
    if (req.body && Object.keys(req.body).length > 0) {
      updateData = req.body;
    } else {
      const fields = ['isSold', 'price', 'section'];
      const randomField = fields[Math.floor(Math.random() * fields.length)];
      updateData = {
        [randomField]: randomField === 'isSold' ? Math.random() > 0.5 :
                      randomField === 'price' ? Math.floor(Math.random() * 10000) + 1000 :
                      'Партер'
      };
    }
    
    const updatedTicket = await ticketsManager.partialUpdate(req.params.id, updateData);
    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket', message: error.message });
  }
});

// DELETE /tickets/:id - удалить билет
app.delete('/tickets/:id', async (req, res) => {
  try {
    const ticket = await ticketsManager.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    await ticketsManager.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ticket', message: error.message });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📦 Доступные эндпоинты:`);
  console.log(`\n🛍️  Магазин электроники:`);
  console.log(`   GET    /products`);
  console.log(`   GET    /products/:id`);
  console.log(`   POST   /products`);
  console.log(`   PUT    /products/:id`);
  console.log(`   PATCH  /products/:id`);
  console.log(`   DELETE /products/:id`);
  console.log(`   GET    /orders`);
  console.log(`   GET    /orders/:id`);
  console.log(`   POST   /orders`);
  console.log(`   PUT    /orders/:id`);
  console.log(`   PATCH  /orders/:id`);
  console.log(`   DELETE /orders/:id`);
  console.log(`\n💄 Магазин косметики:`);
  console.log(`   GET    /cosmetics`);
  console.log(`   GET    /cosmetics/:id`);
  console.log(`   POST   /cosmetics`);
  console.log(`   PUT    /cosmetics/:id`);
  console.log(`   PATCH  /cosmetics/:id`);
  console.log(`   DELETE /cosmetics/:id`);
  console.log(`   GET    /reviews`);
  console.log(`   GET    /reviews/:id`);
  console.log(`   POST   /reviews`);
  console.log(`   PUT    /reviews/:id`);
  console.log(`   PATCH  /reviews/:id`);
  console.log(`   DELETE /reviews/:id`);
  console.log(`\n🍷 Магазин алкоголя:`);
  console.log(`   GET    /alcohol`);
  console.log(`   GET    /alcohol/:id`);
  console.log(`   POST   /alcohol`);
  console.log(`   PUT    /alcohol/:id`);
  console.log(`   PATCH  /alcohol/:id`);
  console.log(`   DELETE /alcohol/:id`);
  console.log(`   GET    /deliveries`);
  console.log(`   GET    /deliveries/:id`);
  console.log(`   POST   /deliveries`);
  console.log(`   PUT    /deliveries/:id`);
  console.log(`   PATCH  /deliveries/:id`);
  console.log(`   DELETE /deliveries/:id`);
  console.log(`\n🎭 Театральная афиша:`);
  console.log(`   GET    /performances`);
  console.log(`   GET    /performances/:id`);
  console.log(`   POST   /performances`);
  console.log(`   PUT    /performances/:id`);
  console.log(`   PATCH  /performances/:id`);
  console.log(`   DELETE /performances/:id`);
  console.log(`   GET    /tickets`);
  console.log(`   GET    /tickets/:id`);
  console.log(`   POST   /tickets`);
  console.log(`   PUT    /tickets/:id`);
  console.log(`   PATCH  /tickets/:id`);
  console.log(`   DELETE /tickets/:id`);
});
