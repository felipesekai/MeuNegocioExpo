const dataStore = {};

export const openDatabaseSync = () => ({
  execAsync: jest.fn().mockResolvedValue(true),
  runAsync: jest.fn().mockResolvedValue(true),
  getAllAsync: jest.fn(async (sql) => {
    // simplistic mock returning stored table data keyed by sql string
    return dataStore[sql] || [];
  }),
  withExclusiveTransactionAsync: jest.fn(async (cb) => cb({ runAsync: jest.fn().mockResolvedValue(true) })),
});
