module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest', // Combine the two transform rules
  },
  testEnvironment: 'node',
  verbose: true,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node', 'mjs'], // Add 'mjs' to the list
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
