const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/jest.setup.ts"],
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.d.ts",
    "!src/__tests__/**",
    "!src/server.ts"
  ]
};