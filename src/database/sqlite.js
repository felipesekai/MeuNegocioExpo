import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('meunegocio.db');

const ensureTables = (() => {
  let initialized;
  return () => {
    if (initialized) return initialized;
    initialized = db
      .execAsync(
        `
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS clients (
          _id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          phone TEXT,
          email TEXT,
          address TEXT,
          createdAt INTEGER,
          updatedAt INTEGER
        );
        CREATE TABLE IF NOT EXISTS products (
          _id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          quantity INTEGER DEFAULT 0,
          createdAt INTEGER,
          updatedAt INTEGER
        );
        CREATE TABLE IF NOT EXISTS orders (
          _id TEXT PRIMARY KEY NOT NULL,
          clientId TEXT NOT NULL,
          orderDate INTEGER,
          totalAmount REAL,
          status TEXT,
          createdAt INTEGER,
          updatedAt INTEGER
        );
        CREATE TABLE IF NOT EXISTS order_products (
          _id TEXT PRIMARY KEY NOT NULL,
          orderId TEXT NOT NULL,
          productId TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          unitPrice REAL NOT NULL,
          createdAt INTEGER,
          updatedAt INTEGER
        );
        CREATE TABLE IF NOT EXISTS purchases (
          _id TEXT PRIMARY KEY NOT NULL,
          productId TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          unitCost REAL NOT NULL,
          totalCost REAL NOT NULL,
          purchasedAt INTEGER,
          createdAt INTEGER,
          updatedAt INTEGER
        );
        CREATE TABLE IF NOT EXISTS purchase_batches (
          _id TEXT PRIMARY KEY NOT NULL,
          totalAmount REAL NOT NULL,
          purchasedAt INTEGER,
          createdAt INTEGER,
          updatedAt INTEGER
        );
        CREATE TABLE IF NOT EXISTS purchase_items (
          _id TEXT PRIMARY KEY NOT NULL,
          batchId TEXT NOT NULL,
          productId TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          unitCost REAL NOT NULL,
          createdAt INTEGER,
          updatedAt INTEGER
        );
        `
      )
      .then(async () => {
        // ensure quantity column exists (migration para bancos antigos)
        const columns = await db.getAllAsync(`PRAGMA table_info(products);`);
        const hasQuantity = columns?.some((c) => c?.name === 'quantity');
        if (!hasQuantity) {
          await db.execAsync(`ALTER TABLE products ADD COLUMN quantity INTEGER DEFAULT 0;`);
        }

        // Migrate existing purchases to new structure
        const batchesTableInfo = await db.getAllAsync(`PRAGMA table_info(purchase_batches);`);
        const itemsTableInfo = await db.getAllAsync(`PRAGMA table_info(purchase_items);`);

        if (batchesTableInfo.length > 0 && itemsTableInfo.length > 0) {
          // Check if migration is needed
          const existingPurchases = await db.getAllAsync(`SELECT * FROM purchases`);
          const existingBatches = await db.getAllAsync(`SELECT * FROM purchase_batches`);

          // Only migrate if we have old purchases but no batches
          if (existingPurchases.length > 0 && existingBatches.length === 0) {
            console.log('Migrating existing purchases to new structure...');

            for (const purchase of existingPurchases) {
              const batchId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
              const itemId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

              // Create batch for this single purchase
              await db.runAsync(
                `INSERT INTO purchase_batches (_id, totalAmount, purchasedAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`,
                [batchId, purchase.totalCost, purchase.purchasedAt, purchase.createdAt, purchase.updatedAt]
              );

              // Create item
              await db.runAsync(
                `INSERT INTO purchase_items (_id, batchId, productId, quantity, unitCost, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [itemId, batchId, purchase.productId, purchase.quantity, purchase.unitCost, purchase.createdAt, purchase.updatedAt]
              );
            }

            console.log(`Migrated ${existingPurchases.length} purchases to new structure`);
          }
        }

        return true;
      });
    return initialized;
  };
})();

export async function executeSql(sql, params = []) {
  await ensureTables();
  return db.runAsync(sql, params);
}

export async function queryAll(sql, params = []) {
  await ensureTables();
  const rows = await db.getAllAsync(sql, params);
  return rows;
}

export async function queryFirst(sql, params = []) {
  const rows = await queryAll(sql, params);
  return rows?.[0] || null;
}

export async function runInTransaction(callback) {
  await ensureTables();
  await db.withExclusiveTransactionAsync(async (tx) => {
    await callback(tx);
  });
}

export const mapDate = (value) => (value ? new Date(Number(value)) : null);

export const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
