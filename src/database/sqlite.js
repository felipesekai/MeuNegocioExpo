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
        `
      )
      .then(() => true);
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
