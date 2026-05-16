/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  setupFiles: ["./test/setupJest.ts"],
  resetMocks: false,
};
