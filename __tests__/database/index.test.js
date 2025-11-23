import { saveClient, getClientById, getAllClients, deleteClient } from '../../src/database';
import * as sqlite from '../../src/database/sqlite';

// Mock the sqlite module
jest.mock('../../src/database/sqlite', () => {
  const actualSqlite = jest.requireActual('../../src/database/sqlite');
  const mockTx = {
    runAsync: jest.fn(),
    getAllAsync: jest.fn().mockResolvedValue([]),
  };
  return {
    ...actualSqlite, // Include all actual exports
    executeSql: jest.fn(), // Override specific functions
    queryAll: jest.fn(),
    queryFirst: jest.fn(),
    runInTransaction: jest.fn(async (callback) => callback(mockTx)),
    generateId: jest.fn(() => 'mock-id'),
  };
});

describe('Database Client Functions', () => {
  afterEach(() => {
    // Reset mocks to ensure test isolation
    jest.resetAllMocks();
  });

  describe('saveClient', () => {
    it('should insert a new client if no _id is provided', async () => {
      const newClient = {
        name: 'John Doe',
        phone: '123456789',
        email: 'john.doe@example.com',
        address: '123 Main St',
      };

      // This is the object that `mapClientRow` will create from the DB result
      const finalClient = {
        _id: 'mock-id',
        id: 'mock-id', // mapClientRow adds this
        ...newClient,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // When saveClient calls getClientById at the end, queryFirst returns the raw data,
      // which then gets mapped by mapClientRow. So we mock the raw data.
      sqlite.queryFirst.mockResolvedValue({
        _id: 'mock-id',
        ...newClient,
        createdAt: finalClient.createdAt.getTime(),
        updatedAt: finalClient.updatedAt.getTime(),
      });


      const result = await saveClient(newClient);

      expect(sqlite.generateId).toHaveBeenCalled();
      expect(sqlite.executeSql).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO clients'),
        expect.arrayContaining([
          'mock-id',
          newClient.name,
          newClient.phone,
          newClient.email,
          newClient.address,
        ])
      );
      // The result of saveClient is the *mapped* object
      expect(result).toEqual(finalClient);
    });

    it('should update an existing client if _id is provided', async () => {
      const existingClientRaw = {
        _id: 'existing-id',
        name: 'Jane Doe',
        phone: '987654321',
        email: 'jane.doe@example.com',
        address: '456 Oak Ave',
        createdAt: new Date('2023-01-01').getTime(),
        updatedAt: new Date('2023-01-01').getTime(),
      };

      const updatedData = {
        _id: 'existing-id',
        name: 'Jane Smith',
        phone: '111222333',
      };

      const finalClient = {
        _id: 'existing-id',
        id: 'existing-id',
        name: 'Jane Smith',
        phone: '111222333',
        email: 'jane.doe@example.com',
        address: '456 Oak Ave',
        createdAt: new Date(existingClientRaw.createdAt),
        updatedAt: new Date(),
      };
      
      // 1. First call to getClientById (inside saveClient) finds the existing client.
      sqlite.queryFirst.mockResolvedValueOnce(existingClientRaw);
      // 2. Second call (at the end) returns the updated client data.
      sqlite.queryFirst.mockResolvedValueOnce({
          ...existingClientRaw,
          name: finalClient.name,
          phone: finalClient.phone,
          updatedAt: finalClient.updatedAt.getTime(),
      });

      const result = await saveClient(updatedData);

      expect(sqlite.generateId).not.toHaveBeenCalled();
      expect(sqlite.executeSql).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE clients'),
        expect.arrayContaining([
          updatedData.name,
          updatedData.phone,
          null, // email
          null, // address
          expect.any(Number), // updatedAt
          'existing-id',
        ])
      );
      // Ensure the function returns the final, mapped, updated client object
      expect(result._id).toBe(finalClient._id);
      expect(result.id).toBe(finalClient.id);
      expect(result.name).toBe(finalClient.name);
      expect(result.phone).toBe(finalClient.phone);
      expect(result.email).toBe(finalClient.email);
      expect(result.address).toBe(finalClient.address);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt.getTime()).toBe(finalClient.createdAt.getTime());
      expect(result.updatedAt.getTime()).toBe(finalClient.updatedAt.getTime());
    });
  });

  describe('getAllClients', () => {
    it('should return a list of clients', async () => {
      const mockClients = [
        { _id: '1', name: 'Client A' },
        { _id: '2', name: 'Client B' },
      ];
      sqlite.queryAll.mockResolvedValue(mockClients);

      const result = await getAllClients();

      expect(sqlite.queryAll).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM clients'));
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Client A');
    });
  });

  describe('getClientById', () => {
    it('should return a single client', async () => {
      const mockClient = { _id: '1', name: 'Test Client' };
      sqlite.queryFirst.mockResolvedValue(mockClient);

      const result = await getClientById('1');

      expect(sqlite.queryFirst).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM clients WHERE _id = ?'), ['1']);
      expect(result).not.toBeNull();
      expect(result.name).toBe('Test Client');
    });

    it('should return null if client not found', async () => {
        sqlite.queryFirst.mockResolvedValue(null);
  
        const result = await getClientById('non-existent-id');
  
        expect(result).toBeNull();
      });
  });

  describe('deleteClient', () => {
    it('should execute a DELETE statement', async () => {
      sqlite.executeSql.mockResolvedValue(undefined); // Ensure it's a resolved promise
      await deleteClient('1');

      expect(sqlite.executeSql).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM clients WHERE _id = ?'), ['1']);
    });
  });
});
