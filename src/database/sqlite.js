import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('meunegocio.db');

const ensureTables = (() => {
  let initialized;
  return () => {
    if (initialized) return initialized;
    initialized = new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS clients (
              _id TEXT PRIMARY KEY NOT NULL,
              name TEXT NOT NULL,
              phone TEXT,
              email TEXT,
              address TEXT,
              createdAt INTEGER,
              updatedAt INTEGER
            );`
          );
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS products (
              _id TEXT PRIMARY KEY NOT NULL,
              name TEXT NOT NULL,
              description TEXT,
              price REAL NOT NULL,
              createdAt INTEGER,
              updatedAt INTEGER
            );`
          );
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS orders (
              _id TEXT PRIMARY KEY NOT NULL,
              clientId TEXT NOT NULL,
              orderDate INTEGER,
              totalAmount REAL,
              status TEXT,
              createdAt INTEGER,
              updatedAt INTEGER
            );`
          );
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS order_products (
              _id TEXT PRIMARY KEY NOT NULL,
              orderId TEXT NOT NULL,
              productId TEXT NOT NULL,
              quantity INTEGER NOT NULL,
              unitPrice REAL NOT NULL,
              createdAt INTEGER,
              updatedAt INTEGER
            );`
          );
        },
        (error) => reject(error),
        () => resolve(true),
      );
    });
    return initialized;
  };
})();

export async function executeSql(sql, params = []) {
  await ensureTables();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          reject(error);
          return true;
        },
      );
    });
  });
}

export async function runInTransaction(callback) {
  await ensureTables();
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => callback(tx),
      (error) => reject(error),
      () => resolve(true),
    );
  });
}

export const mapDate = (value) => (value ? new Date(Number(value)) : null);

export const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
