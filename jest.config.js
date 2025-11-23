module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/react-hooks/native'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/', '/__tests__/db.test.js'],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unform/core|@unform/mobile|react-native-masked-text|react-native-numeric-input|@firebase|firebase|@react-native-async-storage/async-storage|expo-sqlite)",
  ],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
};
