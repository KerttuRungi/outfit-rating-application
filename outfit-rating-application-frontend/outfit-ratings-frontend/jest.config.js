const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",

  coverageProvider: "babel",
  testEnvironment: "jsdom",
};

module.exports = createJestConfig(config);
