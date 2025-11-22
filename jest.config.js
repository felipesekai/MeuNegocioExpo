module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/react-hooks/native'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/', '/__tests__/db.test.js'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
};
