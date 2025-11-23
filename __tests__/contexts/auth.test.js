import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { AuthContext, default as AuthProvider } from '../../src/contexts/auth';
import * as firebaseService from '../../src/services/firebaseService';
import { getDatabase, onValue, ref } from 'firebase/database';
import { Alert } from 'react-native';
import { useTheme } from 'styled-components';

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock all external dependencies
jest.mock('firebase/database');
jest.mock('../../src/services/firebaseService');
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));
jest.mock('styled-components', () => ({
  useTheme: jest.fn(() => ({
    colors: {
      primary: '#007bff',
      // ... other theme properties you might use
    },
  })),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn(); // Mock global alert
    // Default mocks for firebaseService
    firebaseService.getUserFromStorage.mockResolvedValue(null);
    firebaseService.saveUserFromStorage.mockResolvedValue(true);
    firebaseService.signInEmail.mockResolvedValue({
      user: { uid: 'test-uid', email: 'test@example.com' },
    });
    firebaseService.signUpEmail.mockResolvedValue({
      user: { uid: 'test-uid', email: 'test@example.com' },
    });
    firebaseService.insertUser.mockResolvedValue(true);
    firebaseService.signOutUser.mockResolvedValue(true);

    // Default mocks for firebase/database
    getDatabase.mockReturnValue({}); // Mock the database instance
    onValue.mockImplementation((_, callback) => {
      // Simulate no data by default for onValue
      callback({ val: () => null });
      return () => {}; // Return an unsubscribe function
    });
    ref.mockReturnValue({}); // Mock the ref instance
  });

  it('should initialize and then set loading to false with no user', async () => {
    const { result, waitForNextUpdate } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });

    // Initially, loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();

    // Wait for the async effect (loadStorageData) to complete and update state
    await act(async () => {
        await waitForNextUpdate();
    });

    // After the effect, loading should be false and user still null (because storage is null)
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should load user from storage if available', async () => {
    const mockUser = { id: 'stored-uid', name: 'Stored User', email: 'stored@example.com' };
    firebaseService.getUserFromStorage.mockResolvedValue(JSON.stringify(mockUser));

    const { result, waitForNextUpdate } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });

    expect(result.current.loading).toBe(true);
    await waitForNextUpdate(); // Wait for useEffect to finish loading storage

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
  });

  it('should handle successful sign up', async () => {
    const mockUser = { id: 'new-uid', name: 'New User', email: 'new@example.com' };
    firebaseService.signUpEmail.mockResolvedValue({
      user: { uid: 'new-uid', email: 'new@example.com' },
    });
    firebaseService.insertUser.mockResolvedValue(true);
    // Mock onValue to return user data from Firebase DB
    onValue.mockImplementation((_, callback) => {
      callback({ val: () => ({ username: 'New User' }) });
      return () => {};
    });

    const { result, waitForNextUpdate } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signUp('New User', 'new@example.com', 'password123');
    });

    expect(firebaseService.signUpEmail).toHaveBeenCalledWith('new@example.com', 'password123');
    expect(firebaseService.insertUser).toHaveBeenCalledWith('new-uid', 'New User', 'new@example.com');
    expect(firebaseService.saveUserFromStorage).toHaveBeenCalledWith(JSON.stringify(mockUser));
    expect(Alert.alert).toHaveBeenCalledWith('Cadastro realizado', '', expect.any(Array));
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });


  it('should handle successful sign in', async () => {
    const mockUser = { id: 'test-uid', name: 'Test User', email: 'test@example.com' };
    // Mock onValue to return user data from Firebase DB
    onValue.mockImplementation((_, callback) => {
      callback({ val: () => ({ username: 'Test User' }) });
      return () => {};
    });

    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signIn('test@example.com', 'password123');
    });

    expect(firebaseService.signInEmail).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(result.current.user).toEqual(mockUser);
    expect(firebaseService.saveUserFromStorage).toHaveBeenCalledWith(JSON.stringify(mockUser));
    expect(result.current.loading).toBe(false);
  });

  it('should handle sign in error', async () => {
    const errorMessage = 'Invalid credentials';
    firebaseService.signInEmail.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signIn('wrong@example.com', 'wrongpassword');
    });

    expect(firebaseService.signInEmail).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
    expect(global.alert).toHaveBeenCalledWith(errorMessage);
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should handle successful sign out', async () => {
    const mockUser = { id: 'test-uid', name: 'Test User', email: 'test@example.com' };
    firebaseService.getUserFromStorage.mockResolvedValue(JSON.stringify(mockUser)); // Pre-set user

    const { result, waitForNextUpdate } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });

    await waitForNextUpdate(); // Wait for initial load

    expect(result.current.user).toEqual(mockUser); // User is loaded

    await act(async () => {
      await result.current.signOut();
    });

    expect(firebaseService.signOutUser).toHaveBeenCalledTimes(1);
    expect(firebaseService.saveUserFromStorage).toHaveBeenCalledWith(null);
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should handle sign out error', async () => {
    const mockUser = { id: 'test-uid', name: 'Test User', email: 'test@example.com' };
    firebaseService.getUserFromStorage.mockResolvedValue(JSON.stringify(mockUser)); // Pre-set user
    const errorMessage = 'Failed to sign out';
    firebaseService.signOutUser.mockRejectedValue(new Error(errorMessage));

    const { result, waitForNextUpdate } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });

    await waitForNextUpdate(); // Wait for initial load

    expect(result.current.user).toEqual(mockUser); // User is loaded

    await act(async () => {
      await result.current.signOut();
    });

    expect(firebaseService.signOutUser).toHaveBeenCalledTimes(1);
    expect(global.alert).toHaveBeenCalledWith(errorMessage);
    // User should still be present if sign out failed to clear
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  it('should handle sign up error for existing email', async () => {
    firebaseService.signUpEmail.mockRejectedValue({ code: 'auth/email-already-in-use' });

    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signUp('Existing User', 'existing@example.com', 'password123');
    });

    expect(firebaseService.signUpEmail).toHaveBeenCalledWith('existing@example.com', 'password123');
    expect(firebaseService.insertUser).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('Ops', 'Email já existe! Não foi possivel cadastrar.', expect.any(Array));
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should handle generic sign up error', async () => {
    firebaseService.signUpEmail.mockRejectedValue({ code: 'auth/weak-password', message: 'Weak password' });

    const { result } = renderHook(() => React.useContext(AuthContext), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signUp('Any User', 'any@example.com', 'weak');
    });

    expect(firebaseService.signUpEmail).toHaveBeenCalledWith('any@example.com', 'weak');
    expect(firebaseService.insertUser).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('Ops', 'Ocorreu um erro no cadastro.');
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  // More tests for signIn, signOut, error handling, etc. will go here
});
