import { executeSql, queryAll, queryFirst, runInTransaction, mapDate, generateId } from './sqlite';

const toMillis = (value, fallback) => {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback ?? Date.now();
};

const mapClientRow = (row) => ({
  _id: row._id,
  id: row._id,
  name: row.name,
  phone: row.phone,
  email: row.email,
  address: row.address,
  createdAt: mapDate(row.createdAt) || undefined,
  updatedAt: mapDate(row.updatedAt) || undefined,
});

const mapProductRow = (row) => ({
  _id: row._id,
  id: row._id,
  name: row.name,
  description: row.description,
  price: Number(row.price) || 0,
  quantity: Number(row.quantity) || 0,
  createdAt: mapDate(row.createdAt) || undefined,
  updatedAt: mapDate(row.updatedAt) || undefined,
});

const mapOrderRow = (row) => ({
  _id: row._id,
  id: row._id,
  clientId: row.clientId,
  orderDate: mapDate(row.orderDate) || mapDate(row.createdAt) || new Date(),
  totalAmount: Number(row.totalAmount) || 0,
  status: row.status || 'pending',
  createdAt: mapDate(row.createdAt) || undefined,
  updatedAt: mapDate(row.updatedAt) || undefined,
});

const mapOrderProductRow = (row) => ({
  _id: row._id,
  id: row._id,
  orderId: row.orderId,
  productId: row.productId,
  quantity: Number(row.quantity) || 0,
  unitPrice: Number(row.unitPrice) || 0,
  createdAt: mapDate(row.createdAt) || undefined,
  updatedAt: mapDate(row.updatedAt) || undefined,
});

export async function saveClient(clientData) {
  const id = clientData._id || generateId();
  const existing = clientData._id ? await getClientById(id) : null;
  const now = Date.now();
  const createdAt = toMillis(clientData.createdAt, existing?.createdAt?.getTime() ?? now);
  const updatedAt = toMillis(clientData.updatedAt, now);

  if (existing) {
    await executeSql(
      `UPDATE clients SET name = ?, phone = ?, email = ?, address = ?, updatedAt = ? WHERE _id = ?`,
      [clientData.name || '', clientData.phone || null, clientData.email || null, clientData.address || null, updatedAt, id],
    );
  } else {
    await executeSql(
      `INSERT INTO clients (_id, name, phone, email, address, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, clientData.name || '', clientData.phone || null, clientData.email || null, clientData.address || null, createdAt, updatedAt],
    );
  }

  return getClientById(id);
}

export async function getAllClients() {
  const rows = await queryAll(`SELECT * FROM clients ORDER BY name COLLATE NOCASE ASC`);
  return rows.map(mapClientRow);
}

export async function getClientById(clientId) {
  const row = await queryFirst(`SELECT * FROM clients WHERE _id = ? LIMIT 1`, [clientId]);
  return row ? mapClientRow(row) : null;
}

export async function deleteClient(clientId) {
  await executeSql(`DELETE FROM clients WHERE _id = ?`, [clientId]);
}

export async function saveProduct(productData) {
  const id = productData._id || generateId();
  const existing = productData._id ? await getProductById(id) : null;
  const now = Date.now();
  const createdAt = toMillis(productData.createdAt, existing?.createdAt?.getTime() ?? now);
  const updatedAt = toMillis(productData.updatedAt, now);

  if (existing) {
    await executeSql(
      `UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, updatedAt = ? WHERE _id = ?`,
      [
        productData.name || '',
        productData.description || null,
        Number(productData.price) || 0,
        Number(productData.quantity) || 0,
        updatedAt,
        id,
      ],
    );
  } else {
    await executeSql(
      `INSERT INTO products (_id, name, description, price, quantity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        productData.name || '',
        productData.description || null,
        Number(productData.price) || 0,
        Number(productData.quantity) || 0,
        createdAt,
        updatedAt,
      ],
    );
  }

  return getProductById(id);
}

export async function getAllProducts() {
  const rows = await queryAll(`SELECT * FROM products ORDER BY name COLLATE NOCASE ASC`);
  return rows.map(mapProductRow);
}

export async function getProductById(productId) {
  const row = await queryFirst(`SELECT * FROM products WHERE _id = ? LIMIT 1`, [productId]);
  return row ? mapProductRow(row) : null;
}

export async function incrementProductStock(productId, amount) {
  const product = await getProductById(productId);
  if (!product) return null;
  const now = Date.now();
  const nextQty = Math.max(0, (Number(product.quantity) || 0) + (Number(amount) || 0));
  await executeSql(`UPDATE products SET quantity = ?, updatedAt = ? WHERE _id = ?`, [nextQty, now, productId]);
  return getProductById(productId);
}

export async function deleteProduct(productId) {
  await executeSql(`DELETE FROM products WHERE _id = ?`, [productId]);
}

export async function createOrder({ clientId, status, products, orderDate }) {
  const orderId = generateId();
  const now = Date.now();
  const orderDateMs = toMillis(orderDate, now);
  let calculatedTotal = 0;

  await runInTransaction(async (tx) => {
    await tx.runAsync(
      `INSERT INTO orders (_id, clientId, orderDate, totalAmount, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, clientId, orderDateMs, 0, status || 'pending', now, now],
    );

    for (const productItem of products) {
      const orderProductId = generateId();
      const qty = Number(productItem.quantity) || 0;
      const unitPrice = Number(productItem.unitPrice) || 0;
      calculatedTotal += qty * unitPrice;

      await tx.runAsync(
        `INSERT INTO order_products (_id, orderId, productId, quantity, unitPrice, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderProductId, orderId, productItem.productId, qty, unitPrice, now, now],
      );

      // Decrement stock
      const productResult = await tx.getAllAsync(`SELECT quantity FROM products WHERE _id = ?`, [productItem.productId]);
      if (productResult && productResult.length > 0) {
        const currentQty = Number(productResult[0].quantity) || 0;
        const newQty = Math.max(0, currentQty - qty);
        await tx.runAsync(`UPDATE products SET quantity = ?, updatedAt = ? WHERE _id = ?`, [newQty, now, productItem.productId]);
      }
    }

    await tx.runAsync(`UPDATE orders SET totalAmount = ? WHERE _id = ?`, [calculatedTotal, orderId]);
  });

  return getOrderById(orderId);
}

export async function saveOrderRecord(orderData) {
  const orderId = orderData._id || generateId();
  const existing = await getOrderById(orderId);
  const now = Date.now();
  const orderDateMs = toMillis(orderData.orderDate, existing?.orderDate?.getTime() ?? now);
  const createdAt = toMillis(orderData.createdAt, existing?.createdAt?.getTime() ?? now);
  const updatedAt = toMillis(orderData.updatedAt, now);
  const totalAmount =
    orderData.totalAmount !== undefined && orderData.totalAmount !== null
      ? Number(orderData.totalAmount)
      : existing?.totalAmount || 0;
  const status = orderData.status || existing?.status || 'pending';

  if (existing) {
    await executeSql(
      `UPDATE orders SET clientId = ?, orderDate = ?, totalAmount = ?, status = ?, updatedAt = ? WHERE _id = ?`,
      [orderData.clientId, orderDateMs, totalAmount, status, updatedAt, orderId],
    );
  } else {
    await executeSql(
      `INSERT INTO orders (_id, clientId, orderDate, totalAmount, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, orderData.clientId, orderDateMs, totalAmount, status, createdAt, updatedAt],
    );
  }

  return getOrderById(orderId);
}

export async function getAllOrders() {
  const rows = await queryAll(`SELECT * FROM orders ORDER BY orderDate DESC`);
  return rows.map(mapOrderRow);
}

export async function getOrderById(orderId) {
  const row = await queryFirst(`SELECT * FROM orders WHERE _id = ? LIMIT 1`, [orderId]);
  return row ? mapOrderRow(row) : null;
}

export async function updateOrderStatus(orderId, status) {
  const now = Date.now();
  await executeSql(`UPDATE orders SET status = ?, updatedAt = ? WHERE _id = ?`, [status, now, orderId]);
  return getOrderById(orderId);
}

export async function deleteOrder(orderId) {
  await runInTransaction(async (tx) => {
    await tx.runAsync(`DELETE FROM order_products WHERE orderId = ?`, [orderId]);
    await tx.runAsync(`DELETE FROM orders WHERE _id = ?`, [orderId]);
  });
}

export async function getOrderProductsByOrderId(orderId) {
  const rows = await queryAll(`SELECT * FROM order_products WHERE orderId = ?`, [orderId]);
  return rows.map(mapOrderProductRow);
}

export async function updateOrderWithProducts({ _id, clientId, status, products, orderDate }) {
  if (!_id) throw new Error('Order id is required to update');
  const now = Date.now();
  const orderDateMs = toMillis(orderDate, now);
  let calculatedTotal = 0;

  await runInTransaction(async (tx) => {
    await tx.runAsync(`DELETE FROM order_products WHERE orderId = ?`, [_id]);

    for (const productItem of products) {
      const orderProductId = generateId();
      const qty = Number(productItem.quantity) || 0;
      const unitPrice = Number(productItem.unitPrice) || 0;
      calculatedTotal += qty * unitPrice;

      await tx.runAsync(
        `INSERT INTO order_products (_id, orderId, productId, quantity, unitPrice, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderProductId, _id, productItem.productId, qty, unitPrice, now, now],
      );
    }

    await tx.runAsync(
      `UPDATE orders SET clientId = ?, orderDate = ?, totalAmount = ?, status = ?, updatedAt = ? WHERE _id = ?`,
      [clientId, orderDateMs, calculatedTotal, status || 'pending', now, _id],
    );
  });

  return getOrderById(_id);
}

export async function getClientsUpdatedSince(timestamp) {
  const rows = await queryAll(`SELECT * FROM clients WHERE updatedAt >= ?`, [timestamp]);
  return rows.map(mapClientRow);
}

export async function getProductsUpdatedSince(timestamp) {
  const rows = await queryAll(`SELECT * FROM products WHERE updatedAt >= ?`, [timestamp]);
  return rows.map(mapProductRow);
}

export async function getOrdersUpdatedSince(timestamp) {
  const rows = await queryAll(`SELECT * FROM orders WHERE updatedAt >= ?`, [timestamp]);
  return rows.map(mapOrderRow);
}

const mapPurchaseRow = (row) => ({
  _id: row._id,
  id: row._id,
  productId: row.productId,
  quantity: Number(row.quantity) || 0,
  unitCost: Number(row.unitCost) || 0,
  totalCost: Number(row.totalCost) || 0,
  purchasedAt: mapDate(row.purchasedAt) || mapDate(row.createdAt) || new Date(),
  createdAt: mapDate(row.createdAt) || undefined,
  updatedAt: mapDate(row.updatedAt) || undefined,
});

export async function createPurchase(purchaseData) {
  const purchaseId = purchaseData._id || generateId();
  const now = Date.now();
  const purchasedAt = toMillis(purchaseData.purchasedAt, now);
  const qty = Number(purchaseData.quantity) || 0;
  const unitCost = Number(purchaseData.unitCost) || 0;
  const totalCost = qty * unitCost;

  await runInTransaction(async (tx) => {
    // Insert purchase
    await tx.runAsync(
      `INSERT INTO purchases (_id, productId, quantity, unitCost, totalCost, purchasedAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [purchaseId, purchaseData.productId, qty, unitCost, totalCost, purchasedAt, now, now]
    );

    // Update product stock
    // We need to fetch current quantity first to be safe, or just do a direct update increment
    // Since we are in a transaction, direct update is safe if we trust the logic.
    // However, let's stick to the pattern of incrementProductStock but inside this transaction context if possible.
    // Since runInTransaction provides 'tx', we can't easily call external functions that also try to start transactions or use db.runAsync directly if they don't accept tx.
    // So we'll implement the update logic here directly.

    // Get current product to ensure it exists and get current qty
    const productResult = await tx.getAllAsync(`SELECT quantity FROM products WHERE _id = ?`, [purchaseData.productId]);
    if (productResult && productResult.length > 0) {
      const currentQty = Number(productResult[0].quantity) || 0;
      const newQty = currentQty + qty;
      await tx.runAsync(`UPDATE products SET quantity = ?, updatedAt = ? WHERE _id = ?`, [newQty, now, purchaseData.productId]);
    }
  });

  return getPurchaseById(purchaseId);
}

export async function getPurchaseById(purchaseId) {
  const row = await queryFirst(`SELECT * FROM purchases WHERE _id = ? LIMIT 1`, [purchaseId]);
  return row ? mapPurchaseRow(row) : null;
}

export async function getPurchases(productId) {
  let sql = `SELECT * FROM purchases`;
  const params = [];
  if (productId) {
    sql += ` WHERE productId = ?`;
    params.push(productId);
  }
  sql += ` ORDER BY purchasedAt DESC`;
  const rows = await queryAll(sql, params);
  return rows.map(mapPurchaseRow);
}

export async function decrementStock(productId, amount) {
  const now = Date.now();
  await runInTransaction(async (tx) => {
    const productResult = await tx.getAllAsync(`SELECT quantity FROM products WHERE _id = ?`, [productId]);
    if (productResult && productResult.length > 0) {
      const currentQty = Number(productResult[0].quantity) || 0;
      const newQty = Math.max(0, currentQty - amount); // Prevent negative stock? Or allow it? Plan says "block or allow negative". Let's allow negative for now or stick to 0? Plan says "allow negative with warning". For DB, let's just do math.
      // Actually, let's clamp to 0 for safety unless specified otherwise, but "allow negative" implies we shouldn't clamp.
      // Let's stick to simple subtraction.
      const finalQty = currentQty - amount;
      await tx.runAsync(`UPDATE products SET quantity = ?, updatedAt = ? WHERE _id = ?`, [finalQty, now, productId]);
    }
  });
}

export async function getPurchasesUpdatedSince(timestamp) {
  const rows = await queryAll(`SELECT * FROM purchases WHERE updatedAt >= ?`, [timestamp]);
  return rows.map(mapPurchaseRow);
}

export async function savePurchaseRecord(purchaseData) {
  const purchaseId = purchaseData._id || generateId();
  const existing = await getPurchaseById(purchaseId);
  const now = Date.now();
  const purchasedAt = toMillis(purchaseData.purchasedAt, existing?.purchasedAt?.getTime() ?? now);
  const createdAt = toMillis(purchaseData.createdAt, existing?.createdAt?.getTime() ?? now);
  const updatedAt = toMillis(purchaseData.updatedAt, now);
  const qty = Number(purchaseData.quantity) || 0;
  const unitCost = Number(purchaseData.unitCost) || 0;
  const totalCost = Number(purchaseData.totalCost) || (qty * unitCost);

  if (existing) {
    await executeSql(
      `UPDATE purchases SET productId = ?, quantity = ?, unitCost = ?, totalCost = ?, purchasedAt = ?, updatedAt = ? WHERE _id = ?`,
      [purchaseData.productId, qty, unitCost, totalCost, purchasedAt, updatedAt, purchaseId]
    );
  } else {
    await executeSql(
      `INSERT INTO purchases (_id, productId, quantity, unitCost, totalCost, purchasedAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [purchaseId, purchaseData.productId, qty, unitCost, totalCost, purchasedAt, createdAt, updatedAt]
    );
  }

  return getPurchaseById(purchaseId);
}
