module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json"
        }
    }
};
