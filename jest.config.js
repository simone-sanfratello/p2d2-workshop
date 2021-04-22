'use strict'

module.exports = {
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/test/!(_)**.(test|e2e).js'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  globalSetup: './test/00-setup.js',
  globalTeardown: './test/99-teardown.js'
  // testTimeout: 10000
}
